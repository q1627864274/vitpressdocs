---
outline: deep
---

#### 什么是闭包？
闭包：内层函数可以访问到外层函数中的变量，即使外部函数已经执行完毕并返回了
优点：

- 可以让外部作用域访问到函数内部的变量，实现了数据的私有化
```javascript
function out1() {
    let a = 10
    return function inner1() {
        console.log(a)
    }
}
let fn1 = out1()
fn1() // 在函数的外部访问到了函数内部的变量a，实现私有化
```
缺点：

- 内存泄露
解决措施：将闭包存在局部变量或者赋值为null
```javascript
function foo() {
  let x = 10;
  return function bar() {
    console.log(x);
  }
}

let baz = foo(); // 此时baz为闭包
baz(); // 10

// baz 变量持有了 bar 函数形成了闭包。在 foo 函数执行完毕后，变量 x 仍然被 bar 函数所引用，如果 baz 不被释放，那么 x 的内存就无法被回收，从而导致内存泄漏。
```
应用场景：节流，防抖，vue3 script中的setup大量使用到闭包
#### new的过程

1. 创建一个空对象，并将空对象的隐式原型指向构造函数的显示原型，即是原型对象。
2. 将构造函数的 this 指向这个新创建的空对象。
3. 执行构造函数内的代码，定义属性和方法，也可以调用其他函数。
4. 如果构造函数没有显示返回对象，则返回这个新创建的对象。
```javascript
       function Fn(name, age){
           // const obj = {}
           this.name = name 
           this.age = age 
			     return [1, 2, 3]
           // 看它内部有没有return对象或者函数，
       }

       // Fn 就相当于是我们要new 的构造函数
       function myNew(fn, ...args){
        // 1. 创建一个空对象
        const obj = {} // new Object()
        obj.__proto__ = Fn.prototype

        // 2. 执行构造函数，并且让它内部的this指向我们的obj
        // 3. 执行构造函数内的代码，定义属性和方法，也可以调用其他函数。
        let res = fn.call(obj, ...args)

        // 4. 如果构造函数没有显示返回对象，则返回这个新创建的对象
        if (res && (typeof res === 'object' || typeof res === 'function')) return res
        return obj // ==》obj就是我们最后要的实例
       }
    //    const res = myNew()
    //    res.__proto__ === Fn.prototype
```
## 
#### 0.1+0.2为什么不等于0.3？
由于计算机内部的数字表示方式使用二进制，0.1 和 0.2 在二进制中都是无限循环小数
而二进制无法精确地表示十进制的分数，因此它们的和也是无限循环小数，在计算时会发生舍入，从而导致精度损失
#### fetch/xhr 有什么区别？和 axios 有什么区别？
fetfetch 两段 then
fetch(url, { method, headers: {}, body }).then(res=>status, res.json()).then(result)
fetch 调用 url，请求方法，头部设置，请求体设置
第一段then，获取状态码，然后配置处理方式（json，text，blob）
第二段then，处理结果
xhr 有五步

1. const xhr = new XMLHttpRequest()
2. xhr.setHeaders()
3. xhr.open(方法, url)
4. xhr.send()
5. xhr.onreadystatechange 状态为 4，状态码为 200 - 500 时，处理结果

axios

1. 配置 axios 实例（timeout，基地址，结果处理方式）
2. 配置请求拦截器
3. axios.get

区别：

1. axios 是第三方库，基于 xhr，fetch/xhr 是浏览器原生的
2. axios 兼容性和 xhr 一样， 可以兼容 ie 10 - ie11, fetch 不兼容 IE
3. xhr 有 onProgress，可以处理上传进度问题
4. fetch 第二段then的参数，类型是 流（stream）
5. xhr 的 readystate 有5个状态
![](https://cdn.nlark.com/yuque/0/2023/png/35643604/1681974257161-f43fd1ce-4915-41ff-b0b6-7b315b786b83.png#averageHue=%23292928&from=url&id=UIU9t&originHeight=436&originWidth=1184&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)
#### 改变this指向

1. .call()
   - 定义：改变this的指向，调用函数，立即执行，返回执行结果
   - 用法：fn.call() 第一个参数，就是让this指向哪个对象，后面紧跟的是参数列表（参数可传可不传）
```
const obj = {
    msg:'hello world'
}
function fn(x, y) {
    console.log(this)  // 指向{msg: 'hello world'}
    return x + y
}
const res2 = fn.call(obj, 1, 2)
console.log(res2) //{msg: 'hello world'} 3
```

2. .apply()
   - 定义：改变this指向， 调用函数，立即执行
   - 用法：第一个参数是this指向的对象，第二个参数是数组。
```
const obj = {
    msg:'hello world'
}
function fn(x, y) {
    console.log(this)  //  {msg: 'hello world'}
    return x + y
}
const res2 = fn.apply(obj, [1, 2])
console.log(res2)  // {msg: 'hello world'} 3
```

3. .bind
   - 定义：改变this指向，bind不是立即执行的，需要手动调用
   - 用法：bind有返回值，bind的返回值是一个函数，这个函数里面的this就是我们传入的第一个参数，第二个参数列表
```
const obj = {
    msg:'hello world'
}
function fn(x, y) {
    console.log(this)  // {msg: 'hello world'}
    return x + y
}
// 这里，相当于用fun去接收了fn.bind()改变了this之后的函数  
const fun = fn.bind(obj, 1, 2) 
console.log(fun)   // ƒ fn(x, y) {
//       console.log(this)
//       return x + y
//       }
const res = fun()
console.log(res)  // {msg: 'hello world'}   3
```

```
// 面试题  call / apply / bind 的区别
/* ====================  ===================== */
// 1. 都是改变this的指向
// 2. call 接收的是参数列表，apply接收的是数组
// 3. call 和 apply是立即执行的， bind返回一个函数，需要手动调用
/* ====================  ===================== */
```
#### ES6新增的语法有哪些？

1. let 和 const：引入块级作用域的变量声明方式，用于替代 var 关键字。拓展：let，var，const的区别？
```
1. var是ES5引入的，let const是ES6引入的
2. var 声明的变量是函数作用域或全局作用域，而 let 和 const 声明的变量是块级作用域。 
                                     块级作用域：{} + let / const
3. var 声明的变量可以被重复声明，而 let 和 const 不允许在同一作用域内重复声明同一个变量。
4. var存在变量提升，let和const不存在
5. var可以在声明之前使用，let /const不能（暂时性死区：变量在声明之前不能被访问或使用）,
6. 浏览器中，var声明的全局变量会挂载到window对象下，let / const 不会
7. let 声明的变量可以被修改，而 const 声明的变量是常量，不允许被修改。
8. const声明的时候，必须马上赋值
```

2. 箭头函数：一种更简洁的函数定义方式，可以减少代码量。
   - 箭头函数没有prototype属性，也没有原型
   - 箭头函数不能作为构造函数
   - 箭头函数没有arguments
   - 箭头函数本身没有this，指向的是上层作用域中的this
3. 模板字符串：允许在字符串中使用变量和表达式，使用反引号（`）来定义字符串，可在字符串中使用 ${} 来引用变量或表达式。
4. 解构赋值：允许从对象或数组中提取数据，赋值给变量，可以方便地获取和使用数据。
5. 对象和数组的扩展：引入了对象的属性简写、对象的方法简写、展开运算符、Rest 参数、Array.from() 等方法，可以更方便地创建和处理对象和数组。属性简写：属性名和属性值相同时，可简写方法简写展开运算符：方便内容插入数组或者对象rest参数：函数调用时传入的多余参数收集成一个数组
6. 类和继承：引入了类和继承的语法，使得 JavaScript 更加面向对象。
7. Promise：一种新的异步编程方式，可以更好地处理异步操作。
8. 模块化：引入了 import 和 export 关键字，可以更好地组织和管理代码。
9. 迭代器和生成器：提供了一种迭代数据的方式，可以用于遍历数据、生成数据等操作。
10. Symbol/bigInt：一种新的数据类型，表示独一无二的值，可以用于对象属性名的命名。
#### 实现继承的方式
继承：子类拥有父类的属性和方法

1. 原型链继承 ---> 需要掌握
   - 核心 ==> 让子类的原型 等于 父类构造函数的实例注意点：需要手动的修正Child的constructor
   - 

   - 优缺点：
      - 优点：方法复用，共享
      - 缺点：
         1. 子类在实例化的时候，不能给父类构造函数传参const boy1 = new Child('sing')
         2. 子类的实例共享了父类构造函数的属性和方法，如果父类里的属性值是引用类型（数组，对象等），实例修改这个值后会相互影响
      - 总结：因为有上面两个缺陷，原型链继承一般不会单独使用！
```
// 父类 
    function Parent(name){
        this.name = name || '父类'  // 相当于给默认值
        this.arr = [1, 2, 3]
    }
    Parent.prototype.sayHi = function(){
        console.log('hi~~')
    }
    // 子类 
    function Child(hobby){
        this.hobby = hobby
    }
    // 核心 ==> 让子类的原型 等于 父类构造函数的实例 
    Child.prototype = new Parent() // 相当于Child和Parent两个构造函数之间有了关联
    Child.prototype.constructor = Child  // 手动的修正Child的constructor
    
  
    // 让boy1实例,可以访问（拥有）父类的sayHi / name / arr属性
    const boy1 = new Child('sing')
    boy1.sayHi()   // hi~~
```

```
const boy1 = new Child('sing')
const boy2 = new Child('dance')
boy1.arr.push(666)
console.log(boy2.arr) // boy2访问的arr也会发生改变
```

2. 借用构造函数（经典继承）
3. 组合继承
4. 原型式继承
5. 寄生式继承
6. 寄生式组合继承 ===> 最完美的
7. ES6中的 extends 继承 （===> 语法糖，寄生式组合继承）
#### 怎么检测某个字符串包含在对象的key值里面

1. Object.keys()获得数组的key集合，通过includes方法进行
2. str in obj

```javascript
const obj = {
  apple: 1,
  banana: 2,
  orange: 3
};

console.log('apple' in obj);    // true
console.log('banana' in obj);   // true
console.log('grape' in obj);    // false

// 注意点：in 运算符会检查对象的原型链上的属性，所以如果你只想检查对象自身的属性，可以使用 Object.prototype.hasOwnProperty() 方法来进行检查
console.log(obj.hasOwnProperty('apple'));   // true
console.log(obj.hasOwnProperty('toString'));   // false
```
#### Set的使用

2023/7/12  huawei

1. 定义：存储原始值或对象引用的**唯一值**的数据集合

2. 常见使用方法：

   ```js
   1. 创建
   const set = new Set(); // 创建一个空的Set
   const set = new Set([1, 2, 3]); // 创建一个包含初始值的Set
   2. 相关使用方法..........需要的时候去查找
   set.add(1); // 添加一个元素
   set.add(2).add(3); // 链式添加多个元素
   set.clear() // 移除Set对象内的所有元素
   set.delete(value) // 移除值为 value 的元素，并返回一个布尔值来表示是否移除成功
   
   ```

   


2023/7/18  huawei

#### 什么是Promise？

两层概念：

1. Promise A+ 规范(社区规范)
   出现原因：解决回调地狱以及异步实现不统一的问题
   定义：Promise 就是一个带有then方法的东西(函数或对象)

   ```js
   // 对象
   {
       then(...){}
   }
   // 函数
   function A(){}
   A.then
   ```

   

2. ES6的  Promise (官方实现社区的规范)

   new Promise() 本身不是一个promise因为它没then方法
   通过let p =  new Promise() 创建的对象才是promise，因为它有then方法
   p.then()

   1. 官方做了额外的扩展，p.catch，新增catch方法
      catch是通过then实现的，then接收两个回调，一个是成功的，一个是失败的
   2. p.finnaly  Promise.all  Promise.race

3. ES7 的async awit 不是ES6 Promise独有的， 不一定是ES6的promise对象
   只要满足Promise A+ 规范(社区规范)就可以用



#### 数组去重

2023/7/19  huawei

1. 使用ES6的Set和展开运算符去重

   ```js
   function uniqueArray(arr) {
     return [...new Set(arr)];
   }
   console.log(uniqueArray([
     { id: 1, name: 'a' },
     { id: 1, name: 'a' }
   ]))
   ```

2. 双重for循环，手写去重过程

   ```js
   function uniqueArray(arr) {
     var result = [];
     for (var i = 0; i < arr.length; i++) {
       var isFind = false;
       for (var j = 0; j < result.length; j++) {
         if (result[j] === arr[i]) {
           isFind = true;
           break;
         }
       }
       if (!isFind) {
         result.push(arr[i]);
       }
     }
     return result;
   }
   ```

3. 进阶版去重，例如:{ id: 1, name: 'a' }  { id: 1, name: 'a' }这种情况也算重复

   ```js
   function uniqueArray(arr) {
     var result = [];
     for (var i = 0; i < arr.length; i++) {
       var isFind = false;
       for (var j = 0; j < result.length; j++) {
         if (equals(result[j], arr[i])) {
           isFind = true;
           break;
         }
       }
       if (!isFind) {
         result.push(arr[i]);
       }
     }
     return result;
   }
   function isPrimitive(value){
      return value === null || !['object', 'function'].includes(typeof value)
   
   }
   function equals(v1, v2) {
      if (isPrimitive(v1) || isPrimitive(v2)){
         return Object.is(v1, v2)
      }
      const entries1 = Object.entries(v1)
      const entries2 = Object.entries(v2)
      if(entries1.length !== entries2.length){
         return false
      }
      for (const [key, value] of entries1) {
         // if (v2[key] !== value) {
         //    return false
         // }
         // 下面这种递归调用很难理解
         if (!equals(value,v2[key])) {
            return false
         }
      }
      return true
   }
   console.log(uniqueArray([{a:1,b:{a:1}},{a:1,b:{a:2}}]))
   ```




#### 事件绑定的第三个参数capture

2023/7/20   huawei

1. 事件发生的过程：捕获阶段、目标阶段和冒泡阶段

   - 捕获阶段：事件从最外层的祖先元素一直传递到目标元素之前的阶段。
   - 目标阶段：事件到达目标元素时触发。
   - 冒泡阶段：事件从目标元素开始向上冒泡，直到最外层的祖先元素。

   设置为true的时候，表示在捕获阶段执行

   **设置为true的有点，比不设置true先执行**
   
   ```js
      <style>
         #outer {
            width: 100px;
            height: 100px;
            background-color: aquamarine;
            display: flex;
            justify-content: center;
            align-items: center;
         }
         #inner{
            width: 50px;
            height: 50px;
            background-color: white;
         }
      </style>
   </head>
   
   <body>
      <div id="outer">
         <div id="inner">
            点击我！
         </div>
      </div>
      <script>
         const outerDiv = document.getElementById('outer');
         const innerDiv = document.getElementById('inner');
   
         // 使用 `true` 处理事件在捕获阶段
         outerDiv.addEventListener('click', () => {
            console.log('捕获阶段(outerDiv)');
         }, true);
   
         // 使用 `false` 处理事件在冒泡阶段（默认行为）
         outerDiv.addEventListener('click', () => {
            console.log('冒泡阶段(outerDiv)');
         });
   
         innerDiv.addEventListener('click', () => {
            console.log('冒泡阶段(innerDiv)');
         });
   
         innerDiv.addEventListener('click', () => {
            console.log('捕获阶段(innerDiv)');
         }, true);
      </script>
   ```



#### 属性名的类型([])的用法

2023/7/20 huawei

定义：通过一个对象取到它的某一个属性值  对象[属性名]

属性名： string | symbol

如果传的是数字会去转成字符串

- 可以是字面量，obj['name']   ==>  简写为 obj.name
- 可以传递变量，obj[a]
- 可以传递表达式或函数调用，obj[a+b] / obj[foo()]

#### 对象和数组常见的拷贝方式

2023/7/28  huawei

1. 对象

   ```js
   this.objData=Object.assign({}, row) //这样就不会共用同一个对象
   ```

2. 数组

   ```js
   newArray = oldArray.slice(); //slice会clone返回一个新数组
   ```




#### 回调函数

2023/11/3  huawei

1. 回调覆盖

   ```js
   定义：当你使用一个全局或共享的机制来处理回调（如串口的事件处理器），并且在不同的上下文或不同的函数中多次设置该回调，你可能会不小心地覆盖之前设置的回调。这会导致预期外的行为，因为原始的回调不再被执行
   
   例子：
   // 接受/发送串口信息
   const sendPortData = (writeData, callback) => {
      proxy.$SerialPortManager.write(writeData, res => {
         if (res) {
            callback(res);
         } else {
            HuiMessage({
               message: `${res}`,
               duration: 3000,
               type: 'error'
            })
         }
      });
   }
   // 当全局只有一个调用的时候：
   const  A = （） => {
     sendPortData(writeData.value, res => {
           // 所有的接收值统一在这里出现
      })
   }
   A()
   
   // 当出现第二个回调时，会发现只走第二个，不走第一个
   // 原因是：发生了回调覆盖，原始的回调不再被调用
   const  B = （） => {
     sendPortData(writeData.value, res => {
           // 所有的接收值统一在这里出现
      })
   }
   B()
   
   解决方案：1. 用一个数组接收回调在列表里面
           2. 建议接收和发送数据分开，使用promise
   ```

#### 手写Call/手写bind

2024/1/23

```js
call:改变this的指向，调用函数，立即执行，返回执行结果
  
1. 传入的ctx，有可能是null || undefined || 简单数据类型的处理
    Function.prototype.myCall = function(ctx, ...args){
        // null和undefined指向全局的this(globalThis)
        // 基本数据类型，通过Object(ctx)能转化，普通对象不转化
         ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx)
 
     }
2. 改变函数this的指向，最简单的方法是作为对象去调用这个函数
    Function.prototype.myCall = function(ctx, ...args){
         ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx)
         // 但是ctx没得fn这个属性
         // let fn = this
         // ctx.fn
         // 所以让ctx.fn = this,这样就能改变this的指向了
         ctx.fn = this
        let res = ctx.fn(...args)
        return res
     }
3. 如果对象本身里面就有fn，就会发生覆盖，进行处理
   想办法让属性不重复：创建一个符号，这样就不重复了（每个从 Symbol() 返回的 symbol 值都是唯一的。一个    symbol 值能作为对象属性的标识符）
   const key = Symbol()
   ctx[key] = this
   let res = ctx[key](...args)
   delete ctx[key]
   return res
4. 发现打印的时候有symbol打印,使用Object.defineProperties
   const key = Symbol()
   // 这样就不显示了
   Object.defineProperties(ctx, key, {
     value:this,
     enumerable: false,
   })
   let res = ctx[key](...args)
   delete ctx[key]
   return res

完整代码：
      Function.prototype.myCall = function(ctx, ...args){
         ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx)
         const key = Symbol()
         Object.defineProperty(ctx, key, {
            value: this,
            enumerable: false
         })
         let result = ctx[key](...args)
         delete ctx[key]
         return result
      }
 

// 手写bind
Function.prototype.myBind = function(ctx, ...args) {
    // 1. 获取调用的函数
    const fn = this
    return function (...subArgs) {
        // 2. 改变this的指向，并且合并参数
        return fn.apply(ctx, [...args, ...subArgs])
    }
}
```

#### call和apply的链式调用

2024/1/25

```js
题目： console.log.call.call.call.call.call.apply((a) => a, [1,2])
1. console.log是函数，所以有call方法，call也是函数，所有的函数都指向函数的原型对象
   console.log.call === console.log.call.call === Function.prototype.call
   所以简化成：Function.prototype.call.apply((a) => a, [1,2])
2. 函数.apply(this指向, 参数数组)
   根据apply原理：this指向.函数(参数数组)
   (a) => a.apply([1,2])
   let fn = (a) => a
   fn.apply([1, 2]) ==> fn(2) => 2  // 最终结果是2
```

#### promise工具函数，微队列/判断是否是promise

```js
      // 将函数放在微队列中
      function runMicroTask(fn) {
         // 方法一：
         Promise.resolve().then(fn)
         // 方法二：
         // node环境中
         if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
            //  通过process.nextTick(fn)，放在微队列中
            return process.nextTick(fn)
         }else if (typeof MutationObserver === 'function') {
            // 通过观察器MutationObserver，观察东西，放在微队列，就会调用fn
            const ob = new MutationObserver(fn)
            const textNode = document.createTextNode('1')
            ob.observe(textNode, {
               // 观察字符的变化
               characterData:true
            })
            textNode.data = '2'
         }
         // 浏览器环境不支持MutationObserver不支持微队列的情况，就用定时器
         setTimeout(fn,0)

      }
      function isPromiseLike(value){
         // 方式一： 缺点，针对ES6之后的，官方才推出Promis构造函数，构建promise
         //        先有社区再有官方
         // return value instanceof Promise
         // 方式二：根据社区标准， 有then方法就行
         return value && typeof value.then === 'function'
      }
```

#### 手写promise.all

```js
      // 手写Promise.all
      Promise.myall = function(proms) {
         // 1. 返回结果是一个promis
         // 2. 不想嵌套层级太深，将函数提出来，resolve、reject都提出来
         let res,rej
         let p = new Promise ((resolve, reject) => {
             res = resolve
             rej = reject
         })
         let i = 0
         let result = []
         let filled = 0
         // 3. 传进来的不一定是数组，支持可迭代对象, 使用for...of循环
         for (const prom of proms) {
            const index = i
            i++
            // 4. 传进来的不一定是promise。转化成promise使用Promise.resolve进行转化
            // 5. 先处理失败，Promise.all只有一个就失败，所以直接调用rej，promise状态一旦确定就不会改变，状态变为fulfilled或rejected，它的状态就不会再改变
            //    循环执行到失败了，就确定失败了，就算后面循环有成功，也不改变了
            //  6. 对于成功的处理 
            //     对结果依次塞入对应的位置,根据闭包+块级作用域 index的值会是0.1.2... 闭包会记录当时的值
            //     需要值计算完成的次数在外层作用域定义fille变量
            Promise.resolve(prom).then((data) => {
                filled ++
                result[index] = data
                if (i === filled) {
                  res(result)
                }
            },rej)
         }
         return p 
      }
      Promise.myall([Promise.reject(123),2,Promise.resolve(123)]).then((res)=>{
         console.log('res', res)
      },
      (error) => {
         console.log('error', error)
      }
      )
为什么打印的index的值依次是0,1,2？
   上面都是闭包const+{},形成了块级作用域，每次循环都是从新定义的index，根据闭包的捕获变量
   捕获变量：闭包允许这些回调函数“捕获”或“记住”其定义时的环境。即使外部函数（for...of循环）已经执行完      毕，闭包仍然可以访问并操作这些变量
为什么打印的i的值依次是3,3,3？
   因为i定义在外部函数中，那么所有的闭包共享这个变量的同一份变量。这意味着如果一个闭包改变了这个变量的        值，这个改变对所有其他闭包都是可见的
   
// 实现一个Promise.race()
   Promise.myrace = function(proms) {
    return new Promise((resolve, reject) => {
        // 对每一个promise进行处理
        for (const prom of proms) {
            // 使用Promise.resolve处理传入的值，无论它是不是一个promise
            Promise.resolve(prom).then(resolve, reject);
            // 一旦任何一个promise变成fulfilled或rejected，就会调用resolve或reject
            // 由于promise的状态只能改变一次，因此第一个改变状态的promise会决定整个race的结果
        }
    });
};
      // 创建几个示例性的 Promise
      let promise1 = new Promise((resolve, reject) => {
         setTimeout(resolve, 500, 'one');
      });

      let promise2 = new Promise((resolve, reject) => {
         setTimeout(resolve, 100, 'two');
      });

      // 使用 Promise.race
      Promise.race([promise1, promise2]).then((value) => {
         console.log(value);
         // 两个 Promise 中更快的那个的结果
         // 输出："two"，因为它更快
      }).catch((error) => {
         // 如果最快的 Promise 失败了
         console.log(error);
      });


// 想实现一个几个，那个先成功，
function promiseFirstResolved(promises) {
    return new Promise((resolve, reject) => {
        let rejectedCount = 0;
        promises.forEach(promise => {
            // 使用 Promise.resolve 包装以确保处理的是 Promise 对象
            Promise.resolve(promise).then(
                // 一旦任何一个 promise 成功解决，立即解决整个 promise
                value => resolve(value),
                // 如果 promise 失败，计数失败的数量
                err => {
                    rejectedCount++;
                    // 如果所有 promise 都失败了，才最终拒绝
                    if (rejectedCount === promises.length) {
                        reject(new Error("All promises were rejected"));
                    }
                }
            );
        });
    });
}

// 使用示例
promiseFirstResolved([Promise.reject('error1'), Promise.resolve('success'), Promise.reject('error2')])
    .then(value => console.log(value)) // 输出: "success"
    .catch(error => console.log(error));
```

#### 手写promise.catch/finally/reslove/reject

```js
      // 手写promise.catch/ 是then第二个参数的快捷方式
      Promise.prototype.catch = function(onReject){
         return this.then(undefined, onReject)
      }
      // 1. 成功/失败都会执行回调  返回结果的promise等效于调的promise(它成功即它也成功，它失败它也要失败)
      //  2. onFinally()执行的返回结果, 
      //        如果onFinally()的返回结果被拒绝，返回拒绝的promise
      //        如果是完成的promise，返回当前promise返回的数据
      Promise.prototype.finally = function(onFinally){
         return this.then(
            (value) => Promise.resolve(onFinally()).then(() => value) ,
            (error) => Promise.resolve(onFinally()).then(() => {
               throw error
            })
         )
      }
      Promise.resolve = function(value) {
         // 1. 如果是满足ES6的promise直接返回
         if (value instanceof Promise) return value
         // 2. 如果是满足promiseA+规范
         // 3. 传进来是一个普通的数，转化为promise
         if (promiseLike(value)){
            return new Promise((resolve, reject) =>{
               value.then(resolve, reject)
            })
         }
         return new Promise((resolve, reject) => resolve(value))
      }
      function promiseLike(value){
         return value && typeof value.then === 'function'
      }
      Promise.reject = function(value){
         return new Promise((resolve, reject) => {
            reject(value)
         })
      }

      const p  = new Promise((resolve, reject) => {
         resolve(134)
      })
      console.log(p.finally(() =>{}).then(res => {
         console.log('res', res)
      }))
```

#### async/awit

```js
打印的结果为什么是一个promise，一个1233
let p = new Promise((resolve, reject) => {
    resolve(124)
})
async function mm1 () {
    let s = 1233
    let n = await p
    return s
}
console.log(mm1())   // promise
function mm () {
    let s = 1233
    p.then(res => {
        let n = res
        })
    return s
} 
console.log(mm())   // 1233


任何使用了 async 关键字声明的函数都是一个异步函数（asynchronous function）。这意味着该函数在执行时会自动返回一个 Promise 对象。即使你在函数体内返回一个非 Promise 的值，这个值也会被自动包装在一个解决（resolved）状态的 Promise 中

当你在一个异步函数内使用 await 关键字时，它会暂停该函数的执行，直到等待的 Promise 被解决或拒绝。这使得编写异步代码更加直观和易于理解
```

#### 计时器不准确的问题

```js
1. 事件循环延迟(js运行在单线程，计时器的回调就可能不会立即执行。计时器只能在事件循环空闲并且到达指定时间后才能执行。)
2. 后台标签页或休眠状态时浏览器可能会减慢或停止计时器的运行，以节省系统资源

解决方案：1. 使用Web Workers（它们在一些浏览器中可以在后台线程运行，不受主事件循环的影响）
           缺点：直接访问 DOM 和全局变量。所有的数据交换都必须通过消息传递进行
        2. 使用requestAnimationFrame（尤其是在动画或需要与屏幕刷新率同步的情况下）
           该回调函数将在浏览器下一次重绘之前执行
```

#### 数据的高阶函数

1. map 

   ```js
   如果回调函数没有返回任何值（即函数执行结束时没有遇到任何return语句），那么该元素在新数组中的值会是undefined。
   let arr = [1,2,3]
   console.log(arr.map(item => {
       if (item > 1) {
           return item
       }
   }))
   // [undefined, 2, 3]
   ```

   
