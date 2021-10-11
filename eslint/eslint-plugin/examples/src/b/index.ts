// const {a} = {a:1}

// console.log(a)



// export type a = {

// }
// export interface b{
//   a:number
// }
// export enum Gender {
//   BOY,
//   GIRL
// }
// const uploadProps = {
//   name: 'file',
//   action: '/api/budget/importTemplate',
//   listType: 'picture',
//   beforeUpload: (file ) => {
//     if (file.size / 1024 / 1024 > 50) {
//       return false;
//     }
//     this.setState(() => ({
//       fileList: [file],
//     }));
//     return false;
//   },
//   onChange: info => {
//     const status = info.file.status;
//     if (info.fileList[0] && info.fileList[0].name && info.fileList[0].name.indexOf('xls') < 0) {
//       info.fileList.pop();
//     }
//     if (status === 'uploading') {
//       this.setState({ uploading: true });
//       return;
//     }
//     if (status === 'error') {
//       this.setState({ uploading: false });
//     }
//     if (status === 'done' || status === 'removed') {
//       this.setState({ uploading: false });
//     }
//     if (status === 'removed') {
//       this.setState({
//         fileList: [],
//       });
//     }
//   },
// };
// console.log(uploadProps)

// 导出变量声明
export const b = 1
// // 变量声明
const c = 2

// 函数声明
function d() {
  
}

// 函数表达式
const ee = function () {

}

// 导出函数表达式
export const e = function () {

}

// 导出箭头函数
export const f = () => {}
// 箭头函数
const g = () => {}