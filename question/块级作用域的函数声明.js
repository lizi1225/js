//@1第一问
// {
//   function foo() {}
//   foo = 1;
//   console.log('foo1', foo);
// }
// console.log('foo2',foo);//[Function: foo]

//@2第二问
// {
//   function foo() {}
//   foo = 1;
//   function foo() {}
// }
// console.log(foo);//1

// 解析

{  
  console.log(window.a,a)   //全局 undefined   局部 fn
  a = 2;
  console.log(window.a,a)   //全局 undefined   局部 2
  a = 3;
  console.log(window.a,a)   //全局 undefined   局部 2
  function a(){}           //执行完之后全局变为3 函数声明之后将全局变量赋值为函数声明之前的局部变量值
        
  console.log(window.a===a,a) //全局 3   局部 3
  a = 4;  
  console.log(window.a,a); //全局3  局部4
}
  console.log(window.a,a); //全局 3

/**
 * 预编译时，将块级作用域中的函数声明同时提升到全局和块内顶部，但块内顶部的赋值为function a(){}  ,全局的赋值为undefined
  a = 2,a = 3 都改的块级中的 a,执行完 a = 3 时块内中的a变为3，全局中的不变;
  块内执行到函数声明时,由于函数不具备块级作用域,会将全局中的a改为块内中的a，即，window.a = 3;
  后面执行a = 4时，会顺着作用域链往上找，由于块级中已经有a了，因此会将块级中的a的改为4,局部不变；
  块级作用域中执行到函数声明时会将a提升到全局，没有执行函数声明之前提升到块级顶部；
  但在局部作用域（函数内）中函数声明不会提升到全局中，只能在局部作用域顶部；
  块级作用域中函数声明可以打断点，但在局部作用域中不能打断点，也就是说在块级作用域中函数声明会执行，但在局部作用域中函数声明，只做声明，本身自身不执行

  块级：块级作用域中的函数在预编译的时候会被提升到全局中单赋值为undefined，只有在执行到函数声明时才是赋值,
  函数：函数内的函数声明不会提升到全局中
 */