// 找出 app 这个 API 被导入后是否有调用
import { app } from 'framework';
const dataLen = 3;
let name = 'zhangsan';

if (app) {
    console.log(name);
}

function getInfos(info: string) {
    const result = app.get(info);
    return result;
}
