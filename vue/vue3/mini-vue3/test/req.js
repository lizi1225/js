var fetch2 = cacheAsync(fetchData, "test2");

  async function fetchData(a) {
    const data = await fetch("//127.0.0.1:3000/test");
    const d = await data.json();
    console.log(d);
    return d;
  }
// 并发6个相同的请求
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));

const cacheAsync = (promiseGenerator, symbol) => {
    const cache = new Map();
    const never = Symbol();
    return async (params) => {
      return new Promise((resolve, reject) => {
      // 可以提供键值
        symbol = symbol || params;
        let cacheCfg = cache.get(symbol);
        if (!cacheCfg) {
          cacheCfg = {
            hit: never,
            exector: [{ resolve, reject }],
          };
          cache.set(symbol, cacheCfg);
        } else {
          // 命中缓存
          if (cacheCfg.hit !== never) {
            return resolve(cacheCfg.hit)
          }
          cacheCfg.exector.push({ resolve, reject });
        }

        const { exector } = cacheCfg;
        
        // 处理并发，在请求还处于pending过程中就发起了相同的请求
        // 拿第一个请求
        if (exector.length === 1) {
          const next = async () => {
            try {
              if (!exector.length) return;
              const response = await promiseGenerator(params);
              // 如果成功了，那么直接resolve掉剩余同样的请求
              while (exector.length) { // 清空
                exector.shift().resolve(response); 
              }
              // 缓存结果
              cacheCfg.hit = response;
            } catch (error) {
              // 如果失败了 那么这个promise的则为reject
              const { reject } = exector.shift();
              reject(error);
              next(); // 失败重试，降级为串行
            }
          };
          next();
        }
      });
    };
  };