Promise.prototype.finally = function (cb) {
  return this.then(
    (y) => {
      return Promise.resolve(cb()).then(() => y);
    },
    (r) => {
      return Promise.resolve(cb()).then(() => {
        // 因为finally的promise执行出错, 会导致不会执行Promise.resolve的正常逻辑 ，所以以finally错误为结果
        throw r;
      }); 
    }
  );
};