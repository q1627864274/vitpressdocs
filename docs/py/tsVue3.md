---
outline: deep
---
## TS
#### TS怎么编译成JS文件？

1. 全局安装typescript模块
npm install -g typescript
2. 使用tsc xxx.ts -w 转化为js文件   -w表示实时转换	
#### TS默认全局环境怎么改成局部的？



1. 通过export{ } 局部导出，可以变成局部的
#### TS了解的配置有哪些？
可以通过`tsc --init`命令自动化的创建`tsconfig.json`这个文件，更改文件，改变一些默认的行为
```javascript
{
  “compilerOptions”: {
    "outDir": "./dist",    //编译后文件输出的位置    
      "module": "ES6",       //转换后模块的风格
      "target": "ES5"        //转换成JS不同语法版本
  },
  "include": ["xxx.ts"]     //只对那些文件进行编译
}
```
#### TS使用的好处

1. 友好的IDE提示
2. 强制类型，防止报错
3. 语言编写更加严谨
4. 快速查找到拼写错误
5. JS的超集，扩展新功能
```markdown
下面通过几个小例子来感受一下TS比JS要优秀的点，

​```typescript
let a = 123;
a.map(()=>{})  // error
```

这段代码在TS中是会报错的，因为a是一个数字，不会有map方法，而JS是不会给我们进行提示的。

```typescript
let a = 1;
if(a === 1 && a === 2) { // error
}
```

这段代码在TS中是会报错的，因为从逻辑上来看这段代码并没有意义，因为a同一时间不可能既是1又是2。

```typescript
let a = {
  username: 'xiaoming',
  age: 20
}
```

这段代码TS提示会非常的好，不会夹杂一些其他的提示信息，而且一旦单词写错了，TS会有非常好的提示效果。
```
#### TS和JS的区别？

1. TS有类型声明空间，js没有
使用type来定义，`type A = number`，两种类型不能相互赋值
注意点：类在TS中既是变量声明空间，也是类型声明空间
​```markdown
type class Foo {}  
let a = Foo;  // success
type A = Foo;  // success
```
#### TS新增的类型

1. 新增的类型
any never void unknown enum
1. never：表示永不存在的值的类型，当一个值不存在的时候就会被自动类型推断成never类型。
```javascript
在这段代码中a变量要求类型既是数字又是字符串，而值是一个123无法满足类型的需求，所以a会被自动推断成never类型。所以never类型并不常用，只是在出现问题的时候会被自动转成never。

有时候也可以利用never类型的特点，实现一些小技巧应用，例如可以实现判断参数是否都已被使用，代码如下：

​```typescript
function foo(n: 1 | 2 | 3) {
  switch (n) {
    case 1:
      break
    case 2:
      break
    case 3:
      break
    default:
        let m: never = n;  // 检测n是否可以走到这里，看所有值是否全部被使用到
      break
  }
}
```
```
        2. any：表示任意类型
        3. unknow：表示未知类型
#### 联合类型和交叉类型

1. 联合类型：类型之间或的操作(变量支持多种不同类型)
​```javascript
let a: string|number|boolean = 'hello';
a = 123;
```

2. 交叉类型：类型之间与的操作
```javascript
type A = {
  username: string
}
type B = {
  age: number
}
let a: A&B = { username: 'xiaoming', age: 20 }

这里a变量，必须具备A、B两个共同指定的类型才可以。
```
#### 类型断言和非空断言

1. 类型断言：TS 推断出来的类型不满足你的需求，需要手动指定一个类型
```javascript
let a: unknown = 'hello';
a = 123;
(a as []).map(()=>{})    // success

使用了as []  就不报错了
```

  用法一：可以转换成空对象
```javascript
type Obj = {username: string}
let obj = {} as Obj;    // success
```

2. 非空断言：加上！表示自己指定为非空

```javascript
let b: string|undefined = undefined;
b.length    // error

let b: string|undefined = undefined;
b!.length   // success

因为b可能是字符串也可能是undefined，所以`b.length`的时候就会报错，这样我们可以采用非空断言来告诉TS，这个b肯定不是undefined，所以b只能是字符串，那么`b.length`就不会报错了。
```

#### TS中的对象类型写法

1. 数组类型
1. 类型[]
```javascript
let arr1: (number|string)[] = [1, 2, 3, 'hello'];
```

      2. Array<类型>    ==>  泛型的写法

```javascript
let arr2: Array<number|string> = [1, 2, 3, 'hello'];
```

2. 元祖类型：表示一个已知元素数量和类型的数组，各元素的类型不必相同，要求比较严格，类型和数量必须对得上
```javascript
let arr3: [number, string] = [1, 'hello'];

这里会限定数组的每一项的值的类型和值的个数，对于多添加一些子项都是会报错的，属于比较严格的数组形式。
```

3. 索引签名用在数组上

```javascript
索引签名中的属性也可以指定`number`类型，不过往往只有数组中会采用这种数字类型的索引签名方式

type A = {
  [index: number]: any   
}
let a: A = [1, 2, 3, true, 'hello'];
```

4. 对象类型
直接对对象字面量进行类型限定，可以精确到具体的字段都具备哪些类型
```javascript
type A = {
  username: string
  age: number
}

let a: A = {
  username: 'xiaoming',
  age: 20
}

// 对于对象类型来说，多出来的字段还是缺少的字段都会产生错误，
type A = {
  username: string
  age: number
}

let a: A = {      // error
  username: 'xiaoming'
}
```
        扩展可以给age添加一个可选标识符`?`来表示age为可选项，写与不写都是可以的。

```javascript
type A = {
  username: string
  //age是可选项 
  age?: number   
}

let a: A = {      // success
  username: 'xiaoming'
}
```

4. 索引签名（那么对于对象多出来的字段，可以通过索引签名方式来解决）
```javascript
type A = {
  username: string
  //索引签名
  [index: string]: any
}

let a: A = {
  username: 'xiaoming'
  gender: 'male',
  job: 'it'
}
```

5. 数组套对象的写法
```javascript
let json: {username: string, age: number}[] = [{username:'1', age:1}];

// 索引签名 + 数组套对象

type A = {
    //索引签名
    [index: string]: any
}[]
  
let a: A = [
    {
        username: 'xiaoming',
        gender: 'male',
        job: 'it'
    }

]
```

#### 函数类型和void类型



1. TS中对函数的定义方式
```javascript
// 第一种    使用function直接声明
表示形参n接受数值类型，m可选字符串类型，返回值需是数值类型
function foo(n: number, m?: string): number{
   return 123;
}
foo(123, 'hello');
foo(123);     // success

// 第二种    使用函数表达式的写法
let foo: (n: number, m: string) => number = function(n, m){
  return 123;
}

// 第三种   使用类型注解
type A = () => void;     // 可
let a: A = () => {};
```

2. void类型   ==>  表示函数没有任何返回值的时候得到的类型。

```javascript
let foo = function(){   // void
}
// TS自动推断为void类型
```

3. void和undefined的区别
1. 当return undefined的时候也可以返回void类型
```typescript
let foo:() => void = function(){ 
  return undefined  // success
}
```

       2. undefined 类型是不能不写return的
#### 函数重载

1. 定义：函数重载是指函数约束传入不同的参数，返回不同类型的数据，而且可以清晰的知道传入不同的参数得到不同的结果。

```javascript
function foo(n1: number, n2?: number, n3?: number, n4?: number){
}
// 下面四种都可以
foo(1);
foo(1, 2);
foo(1, 2, 3);
foo(1, 2, 3, 4);

// 通过函数重载，进行限制传递的参数
function foo(n1: number): any
function foo(n1: number, n2: number): any
function foo(n1: number, n2: number, n3: number, n4: number): any
function foo(n1: number, n2?: number, n3?: number, n4?: number){
}
foo(1);
foo(1, 2);
foo(1, 2, 3);    // error
foo(1, 2, 3, 4);

```
#### 可调用注解

1. 定义：可调用注解提供多种调用签名，用以特殊的函数重载。首先可调用注解跟普通函数的类型注解可以起到同样的作用。
2. 用法：可调用注解，
```javascript
type A = () => void;     // 普通注解
type A = {   // 可调用注解，可以针对函数重载进行类型注解的    可
  (): void
}
let a: A = () => {};
```

3. 可调用注解相比较普通类型注解的优势
普通注解只能针对一个函数重载
可调用注解可以针对多个函数重载
可以针对函数重载进行类型注解的
函数重载的个数对应可调用注解里面对象的个数
```javascript
type A = {
  (n: number, m: number): any
  (n: string, m: string): any
}
function foo(n: number, m: number): any
function foo(n: string, m: string): any
function foo(n: number|string, m: number|string){
}
let a: A = foo
```

     可调用注解还可以扩展函数这个对象的属性

```javascript
type A = {
   (n: number): number
   username?: string
}
let foo: A = (n) => {return n}
foo.username = 'xiaomoing' // success
```
#### 枚举类型与const枚举

1. 枚举
定义：其实简单来说枚举就是定义一组常量
使用：枚举默认不给值的情况下，
就是一个从0开始的数字，是可以自动进行累加的，当然也可以自己指定数值，后面的数值也是可以累加的。

可以用来判断权限，admin 之类的东西，这样更具备语义化，看的出来想做的事情
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688880532952-f163b9f3-7c6c-433b-adbd-7b82bc1137b6.png#averageHue=%23eaeaea&clientId=u3a7c48b1-65f1-4&from=paste&height=305&id=uf6c8529c&originHeight=335&originWidth=518&originalType=binary&ratio=1&rotation=0&showTitle=false&size=70024&status=done&style=none&taskId=ua4a2fd70-4698-49e1-84cb-ab3727917c9&title=&width=470.9090807024115)

```javascript
enum Roles {
  SUPER_ADMIN,
  ADMIN = 3,
  USER
}
console.log( Roles.SUPER_ADMIN );   // 0
console.log( Roles.ADMIN );    // 3
console.log( Roles.USER );     // 4
```
      注意点：枚举也支持反向枚举操作，通过数值来找到对应的key属性，这样操作起来会非常的灵活。
```javascript
enum Roles {
  SUPER_ADMIN,
  ADMIN = 3,
  USER
}
console.log( Roles[0] );    // SUPER_ADMIN
console.log( Roles[3] );    // ADMIN
console.log( Roles[4] );    // USER
```
  优点：给我们的编程带来的好处就是更容易阅读代码
   注意点：如果定义成字符串，字符串没有默认值，不能做反向映射
```javascript
enum Roles {
   SUPER_ADMIN = 'super_admin',
   ADMIN = 'admin',
   USER = 'user'
}
```

   既可以作为类型，也可以作为值
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688880692487-c4af1206-003a-4506-9d63-789246b64298.png#averageHue=%23e5e2dd&clientId=u3a7c48b1-65f1-4&from=paste&height=263&id=uacfde76c&originHeight=289&originWidth=474&originalType=binary&ratio=1&rotation=0&showTitle=false&size=92326&status=done&style=none&taskId=uc721537b-1e3f-4450-8712-79d0378ba5d&title=&width=430.9090815693881)

2. 有const的枚举和没有const枚举的区别？
主要区别在于编译的最终结果，const方式最终编译出来的就是一个普通字符串，并不会产生一个对象，更有助于性能的体现。

没有const的编译结果
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688880748347-b574a9f8-bb4e-43ff-b014-94d68b59e3e5.png#averageHue=%23d8d8cd&clientId=u3a7c48b1-65f1-4&from=paste&height=284&id=ue760f6fd&originHeight=312&originWidth=1350&originalType=binary&ratio=1&rotation=0&showTitle=false&size=251282&status=done&style=none&taskId=uce0baa61-abd5-4d15-ad80-10965598989&title=&width=1227.2727006723078)

       有const的编译结果
       ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688880779540-da6e34f9-2afc-4b8e-b3f9-a13c192dbc6d.png#averageHue=%23eaeaea&clientId=u3a7c48b1-65f1-4&from=paste&height=268&id=u5ade13ed&originHeight=295&originWidth=1300&originalType=binary&ratio=1&rotation=0&showTitle=false&size=116290&status=done&style=none&taskId=uf0e9c6d3-e126-45d2-8b01-1523083fa69&title=&width=1181.818156202963)

3. 不能对里面的内容进行修改
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688880871226-db35c103-20d7-4e21-8a96-9da68f0fa914.png#averageHue=%23eae9e9&clientId=u3a7c48b1-65f1-4&from=paste&height=231&id=u6573eb6a&originHeight=254&originWidth=637&originalType=binary&ratio=1&rotation=0&showTitle=false&size=86977&status=done&style=none&taskId=u48d4687a-eef3-494a-ad71-3d50e3dd7eb&title=&width=579.0908965394519)
#### 接口和类型别名

1. 接口
定义：接口跟类型别名类似都是用来定义类型注解的，接口是用`interface`关键字来实现的
```javascript
interface A {
  username: string;
  age: number;
}
let a: A = {
  username: 'xiaoming',
  age: 20
}
```
      因为接口跟类型别名功能类似，所以接口也具备像索引签名，可调用注解等功能。
```javascript
interface A {
  [index: number]: number;
}
let a: A = [1, 2, 3];

interface A {
  (): void;
}
let a: A = () => {}
```

2. 接口和类型别名的区别
1. 对象类型
第一个区别，类型别名可以操作任意类型，而接口只能操作对象类型。
```javascript
type A = number

type B {
  username: string;
}
interface B {
  username: string;
}
```
      2. 接口合并
      接口可以进行合并操作
```javascript
interface A {
  username: string;
}
interface A {
  age: number;
}
let a: A = {
  username: 'xiaoming',
  age: 20
}
```
      3. 接口具备继承能力
```javascript
// B这个接口继承了A接口，所以B类型就有了username这个属性。在指定类型的时候，b变量要求同时具备A类型和B类型。
interface A {
  username: string
}
interface B extends A {
  age: number
}
let b: B = {
  username: 'xiaoming',
  age: 20
}
```
      4. 接口不具备定义成接口的映射类型，而别名是可以做成映射类型的
```javascript
type A = {   // success
  [P in 'username'|'age']: string;
}
let a: A = {
    username: 'lisi',
    age: '12'
}; // success
interface A {   // error
  [P in 'username'|'age']: string;
}
```
#### 字面量类型和keyof关键字


1. 字面量类型
定义：在TS中可以把字面量作为具体的类型来使用，当使用字面量作为具体类型时, 该类型的取值就必须是该字面量的值。
```javascript
type A = 1;
let a: A = 1;

type A = 'linear'|'swing';
let a: A = 'ease'    // error
// 这里的A对应一个1这样的值，所以A类型就是字面量类型，那么a变量就只能选择1作为可选的值，除了1作为值以外，那么其他值都不能赋值给a变量。
```

2. keyof关键字
用法1，在一个定义好的接口中，想把接口中的每一个属性提取出来，形成一个联合的字面量类型
```javascript
interface A {
  username: string;
  age: number;
}
//keyof A -> 'username'|'age'
let a: keyof A = 'username';
```
       用法2，利用typeof语法去引用一个变量，可以得到这个变量所对应的类型

```javascript
let a = 'hello';
type A = typeof a;   // string 
```
      用法3，利用这样一个特性，可以通过一个对象得到对应的字面量类型，把typeof和keyof两个关键字结合使用
```javascript
let obj: {
  username: 'xiaoming',
  age: 20
}
let a: keyof typeof obj = 'username'
```
#### 类型保护与自定义类型保护

1. 类型保护
定义： **类型保护允许你使用更小范围下的对象类型**。这样可以缩小类型的范围保证类型的正确性，防止TS报错
```javascript
// 这段代码在没有类型保护的情况下就会报错，如下：
function foo(n: string|number){
	n.length   // error
}
```
     实现方式1：typeof关键字
```javascript
function foo(n: string|number){
  if(typeof n === 'string'){
    n.length   // success
  }
}
```
     实现方式2：instanceof关键字，主要是**针对类**进行保护的
```javascript
class Foo {
  username = 'xiaoming'
}
class Bar {
  age = 20
}
function baz(n: Foo|Bar){
  if( n instanceof Foo ){
    n.username
  }
}
```
      实现方式3：in关键字实现类型保护，主要是**针对对象的属性**保护的
```javascript
function foo(n: { username: string } | { age: number }){
  if( 'username' in n ){
    n.username
  }
}
```
      实现方式4：字面量类型保护
```javascript
function foo(n: 'username'|123){
  if( n === 'username' ){
    n.length
  }
}
```

2. 自定义类型保护
定义：只需要利用`is`关键字即可， `is`为类型谓词，它可以做到类型保护
```javascript
function isString(n: any): n is string{
  return typeof n === 'string';
}
function foo(n: string|number){
  if( isString(n) ){
    n.length
  }
}
```
#### 定义泛型和泛型常见操作

1. 泛型
定义：指在定义函数、接口或者类时，未指定其参数类型，只有在运行时传入才能确定
          泛型简单来说就是对类型进行传参处理
          多泛型和泛型默认值
```javascript
type A<T, U> = T|U    // 多泛型
type A<T = string> = T //泛型默认值
let a: A = 'hello'
let b: A<number> = 123
let c: A<boolean> = true


// 讲过数组有两种定义方式，除了基本定义外，还有一种泛型的写法
let arr: Array<number> = [1, 2, 3];
//自定义MyArray实现
type MyArray<T> = T[];
let arr2: MyArray<number> = [1, 2, 3]; 
// 这段代码等价于
let arr2: number[] = [1, 2, 3]; 
```
        泛型在函数中的使用（这个方式不常用，不推荐）

```javascript
function foo<T>(n: T){
}
foo<string>('hello');
foo(123);   // 泛型会自动类型推断
```
       泛型和接口结合使用（常用）
```javascript
interface A<T> {
  (n?: T): void  // 可调用注解的用法
  default?: T
}
let foo: A<string> = (n) => {}
let foo2: A<number> = (n) => {}
foo('hello')
foo.default = 'hi'
foo2(123)
foo2.default = 123
```
        泛型和类结合使用

```javascript
class Foo<T> {
  username!: T;
}
let f = new Foo<string>();
f.username = 'hello';

class Foo<T> {
  username!: T
}
class Baz extends Foo<string> {}
let f = new Baz()
f.username = 'hello'
```

2. 泛型约束
定义：对泛型进行约束，可以指定哪些类型才能进行传递
方式1，通过通过extends关键字可以完成泛型约束处理
```javascript
type A = string
function foo<T extends A>(n: T) {}
foo(123)   // error
foo('hello')

type A = {
  length: number
}
function foo<T extends A>(n: T) {}

// 传递进来的东西，需要具备length属性
foo(123)   // error
foo('hello')   // 字符串具备length属性
```
#### 类型兼容性


定义：赋值操作
类型兼容性用于确定一个类型是否能赋值给其他类型。如果是相同的类型是可以进行赋值的，如果是不同的类型就不能进行赋值操作。
```javascript
let a: number = 123;
let b: number = 456;
b = a;   // success

let a: number = 123;
let b: string = 'hello';
b = a;   // error
```

1. 当有类型包含的情况下

```javascript
// 变量a是可以赋值给变量b的，但是变量b是不能赋值给变量a的，因为b的类型包含a的类型，所以a赋值给b是可以的。
let a: number = 123;
let b: string | number = 'hello';
//b = a;  // success
a = b;  // error

// 当是对象的情况（发现与想象的相反）
// b的类型满足a的类型，所以b是可以赋值给a的，但是a的类型不能满足b的类型，所以a不能赋值给b
let a: {username: string} = { username: 'xiaoming' };
let b: {username: string; age: number} = { username: 'xiaoming', age: 20 };
a = b; // success
b = a;  // error
```

2. 运用场景
使用类型兼容，使得foo(a)不报错
```javascript
function foo(n: { username: string }) {}
foo({ username: 'xiaoming' }) // success
foo({ username: 'xiaoming', age: 20 }) // error
let a = { username: 'xiaoming', age: 20 }
foo(a) // success
```
#### 映射类型与内置工具类型
#### 



1. 映射类型
定义：简单来说就是可以从一种类型映射出另一种类型，例如：将已知类型的每个属性都变为可选的或者只读的
实现方式：映射类型只能用类型别名去实现，不能使用接口的方式来实现

```typescript
type A = {
  username: string
  age: number
}
type B<T> = {
  [P in keyof T]: T[P]
}
type C = B<A>

这段代码中类型C与类型A是完全一样的，其中`in`关键字就类似于一个`for in`循环，可以处理A类型中的所有属性记做`p`，然后就可以得到对应的类型`T[p]`
```

     扩展：在原有类型的基础上拓展

```typescript
// 例如让每一个属性都是只读的，可以给每一项前面添加`readonly`关键字
type B<T> = {
  readonly [P in keyof T]: T[P]
}
```

2. 内置工具类型
定义：去实现这种映射类型的功能是非常麻烦的，所以TS中给我们提供了很多常见的映射类型，这些内置的映射类型被叫做，内置工具类型
例如：Readonly就是跟我们上边实现的映射类型是一样的功能，给每一个属性做成只读的。

Required可以把对象的每一个属性变成必选项。
```typescript
type A = {
  username: string
  age: number
}
/* type B = {
    readonly username: string;
    readonly age: number;
} */
type B = Readonly<A>
```

      内置工具类型举例
      Partial：可以把每一个属性变成可选的

```typescript
type A = {
  username: string
  age: number
}
/* type B = {
    username?: string|undefined;
    age?: number|undefined;
} */
type B = Partial<A>
```
     Pick可以把某些指定的属性给筛选出来

```typescript
type A = {
  username: string
  age: number
  gender: string
}
/* type D = {
    username: string;
    age: number;
} */
type D = Pick<A, 'username'|'age'>

// Pick的底层
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
K继承'username'|'age'，然后p在k里面循环，这样就筛选出来了
```

     Record可以把字面量类型指定为统一的类型。

```typescript
/* type E = {
    username: string;
    age: string;
} */
type E = Record<'username'|'age', string>

// Record的底层，就是在'username'|'age'中进行循环
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

      Required可以把对象的每一个属性变成必选项。

```typescript
type A = {
  username?: string
  age?: number
}
/* type B = {
    username: string;
    age: number;
} */
type B = Required<A>
```
      Omit是跟Pick工具类相反的操作，把指定的属性进行排除。

```typescript
type A = {
  username: string
  age: number
  gender: string
}
/* type D = {
    gender: string
} */
type D = Omit<A, 'username'|'age'> 
```
     Omit底层实现的原理

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Exclude的原理
Exclude可以排除某些类型，得到剩余的类型。
type A = Exclude<string | number | boolean, string | boolean>


type Exclude<T, U> = T extends U ? never : T;   // 这是一个条件类型判断
```

#### 条件类型和infer关键字
#### 

1. 条件类型
定义：在初始状态并不直接确定具体类型，而是通过一定的类型运算得到最终的变量类型

```typescript
type A = string
type B = number | string
type C = A extends B ? {} : []   // {}

条件类型需要使用`extends`关键字，如果A类型继承B类型，那么C类型得到问号后面的类型，如果A类型没有继承B类型，那么C类型得到冒号后面的类型，

当无法确定A是否继承B的时候，则返回两个类型的联合类型
type A = any
type B = number | string
type C = A extends B ? {} : []   // {} || []
```

      应用场景：条件类型还是在内置工具类型中用的比较多，例如Exclude，Extract

```typescript
type Exclude<T, U> = T extends U ? never : T;
// 不满足继承的留下

Extract跟Exclude正好相反，得到需要筛选的类型

 type Extract<T, U> = T extends U ? T : never  ->
// 满足继承的留下
```

      NonNullable用于排除null和undefined这些类型。
```typescript
//type NonNullable<T> = T extends null | undefined ? never : T;  -> 实现原理
//type A = string
type A = NonNullable<string|null|undefined>   // string
```
     Parameters可以把函数的参数转成对应的元组类型。

```typescript
type Foo = (n: number, m: string) => string
//type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;   -> 实现原理
// type A = [n: number, m: string]
type A = Parameters<Foo>  // [n:number, m:string]
```

2. infer关键字
定义：主要是用于在程序中对类型进行推断
例如：在Parameters方法的实现原理中，出现了一个`infer`关键字，它主要是用于在程序中对类型进行定义，通过得到定义的p类型来决定最终要的结果。

ReturnType可以把函数的返回值提取出类型。

```typescript
type Foo = (n: number, m: string) => string
//type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;   -> 实现原理
//type A = string
type A = ReturnType<Foo> // string

这里也通过`infer`关键字定义了一个R类型，对应的就是函数返回值的类型。通过`infer`关键字可以在泛型之外也可以定义类型出来。
```

     使用infer做一个小练习
下面再利用`infer`来实现一个小功能，定义一个类型方法，当传递一个数组的时候返回子项的类型，当传递一个基本类型的时候就返回这个基本类型。
```typescript
type A<T> = T extends Array<infer U> ? U : T
// type B = number
type B = A<Array<number>>
// type C = string
type C = A<string>
```
#### 

#### 类中使用类型
#### 

1. 类可以直接作为值或者类型进行使用

```typescript
// 作为值进行使用
class Foo {}
new Foo();

// 作为类型进行使用
class Foo {}
let a: Foo = 123;
a = 'hello';
```

2. 类中定义类型
属性必须给初始值，如果不给初始值可通过非空断言来解决。
```typescript
// 给初始值的写法
class Foo {
  //第一种写法
  //username: string = 'xiaoming';
  //第二种写法
  // username: string;
  // constructor(){
  //   this.username = 'xiaoming';
  // }
  //第三种写法
  username: string;
  constructor(username: string){
    this.username = username;
  }
}

// 非空断言的写法
class Foo {
  username!: string;
}
```
   类中定义方法及添加类型

```typescript
class Foo {
  ...
  showAge = (n: number): number => {
    return n;
  }
}
```

3. 类中使用接口
类中使用接口，是需要使用`implements`关键字。

在类中使用接口的时候，是一种类型兼容性的方式，对于少的字段是不行的，但是对于多出来的字段是没有问题的，比如说gender字段。
```typescript
interface A {
  username: string
  age: number
  showName(n: string): string
}

class Foo implements A {
  username: string = 'xiaoming'
  age: number = 20
  gender: string = 'male'  
  showName = (n: string): string => {
    return n
  }
}
```

4. 类中使用泛型

```typescript
class Foo<T> {
  username: T;
  constructor(username: T){
    this.username = username;
  }
}
new Foo<string>('xiaoming');
```

    继承用的比较多

```typescript
class Foo<T> {
  username: T;
  constructor(username: T){
    this.username = username;
  }
}
class Bar extends Foo<string> {
}
```

5. 类中去结合接口与泛型的方式

```typescript
interface A<T> {
  username: T
  age: number
  showName(n: T): T
}
class Foo implements A<string> {
  username: string = 'xiaoming'
  age: number = 20
  gender: string = 'male'
  showName = (n: string): string => {
    return n
  }
}
```
建议不用类去开发，面向对象复杂，面向函数更简单，建议函数

## TS结合Vue3
#### 模块系统与命名空间

1. 模块系统
定义：TS中的模块化开发跟ES6中的模块化开发并没有太多区别，像ES6中的导入、导出、别名等，TS都是支持的。TS跟ES6模块化的区别在于TS可以把类型进行模块化导入导出操作。

关键字type可加可不加，一般导出类型的时候尽量加上，这样可以区分开到底是值还是类型
```typescript
// TS支持ES6模块的导入导出

// 2_demo.ts
export type A = string
// 1_demo.ts
import type { A } from './2_demo'
```

     同样也支持require风格的导入导出

```typescript
// 2_demo.ts
type A = string
export = A
// 1_demo.ts
import A = require('./2_demo')
let a: A = 'hello'
```

2. 模块化的动态引入（TS独有）
定义：正常我们`import`导入方式是必须在顶部进行添加的，不能在其他语句中引入，这样就不能在后续的某个时机去导入，所以TS提供了动态引入模块的写法

注意点：这种动态导入只支持值的导入，不支持类型的导入。
```typescript

// 2_demo.ts
export a = 0
// 1_demo.ts
setTimeout(() => {
	import('./2_demo').then(({ a }) => {
		console.log(a)
	})
}, 2000)
```

3. 命令空间
定义：模块化是外部组织代码的一种方式，而命名空间则是内部组织代码的一种方式。防止在一个文件中产生代码之间的冲突。

TS提供了`namespace`语法来实现命名空间

```typescript
namespace Foo {
	export let a = 123
}
namespace Bar {
	export let a = 456
}
console.log(Foo.a)
console.log(Bar.a)
```

     应用：命名空间也是可以导出的，在另一个模块中可以导入进行使用，并且导出值和类型都是可以的。

```typescript
// 2_demo.ts
export namespace Foo {
  export let a = 123
  export type A = string
  export function foo() {}
  export class B {}
}

// 1_demo.ts
import { Foo } from './2_demo'
console.log(Foo.a)
let a: Foo.A = 'hello world'
```
#### 
d.ts声明文件和declare关键字



1. d.ts声明文件
定义：TypeScript 声明文件。它的主要作用是描述 JS 模块内所有导出接口的类型信息。

应用场景：当我们开发了一个模块，我们需要让模块既可以适配JS项目，又可以适配TS项目，那么就可以利用.d.ts声明文件来实现，这样就可以让我们的JS模块在TS环境下进行使用了，而类型空间就交给声明文件来处理吧。

简单来说：就是让JS文件能在TS文件中使用
`declare`这个关键词，就是在声明文件中进行类型定义的，这个只是用于定义类型，不会产生任何功能实现
```typescript
// 01_demo.js
function foo(n) {
    console.log(n);
}
exports.foo = foo;

// 01_demo.d.ts
export declare function foo(n: number): void

// 02_demo.ts
import { foo } from './01_demo'
foo(123)   // ✔
foo('hello')  // ✖     
```

2. TS工程化配置自动创建声明文件，自动生成
```typescript
// tsconfig.json
"declaration": true,   // 打开注释后，自动生成.d.ts文件   
```
#### @types和DefinitelyTyped仓库

1. DefinitelyTyped仓库
定义：DefinitelyTyped 是一个 高质量 的 TypeScript 类型定义的仓库。通过 @types方式来安装常见的第三方JavaScript库的声明适配模块。
地址：仓库的在线地址为：https://github.com/borisyankov/DefinitelyTyped

仓库的作用：如果一个JS模块想要适配TS项目，那么需要有d.ts声明文件。那么如果这个JS模块没有提供声明文件的话，就可以通过DefinitelyTyped仓库下载第三方的声明文件来进行适配。这个仓库会包含大部分常见JS库的声明文件，只需要下载就可以生效

举例引入jquery库

```typescript
// 1_demo.ts
import $ from 'jquery  // error，提示缺少声明文件


// jquery库并没有默认提供d.ts声明文件，所以导入模块的时候肯定是要报错的。鼠标移入到错误上，提示的信息就有让我们去安装对应的第三方声明文件，即：`npm i --save-dev @types/jquery`
```

     注意点：当然并不是所有的JS模块都需要下载第三方的@types，因为有些模块默认就会代码d.ts的声明文件，例如moment这个模块，安装好后，就会自带moment.d.ts文件。
#### lib.d.ts和global.d.ts

1. lib.d.ts
定义：当你安装 TypeScript 时，会顺带安装一个 lib.d.ts 声明文件。这个文件包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明。

这里的`HTMLBodyElement`和`Date`都是TypeScript下自带的一些内置类型，这些类型都存放在lib这个文件夹下。
```typescript
// 当我们使用一些原生JS操作的时候，也会拥有类型
let body: HTMLBodyElement | null = document.querySelector('body')
let date: Date = new Date()
```

2. global.d.ts
定义：有时候我们也想扩展像lib.d.ts这样的声明类型，可以在全局下进行使用，所以TS给我们提供了global.d.ts文件使用方式，这个文件中定义的类型都是可以直接在全局下进行使用的，不需要模块导入。

```typescript
// global.d.ts
type A = string

// 1_demo.ts
let a: A = 'hello'   // ✔
let b: A = 123       // ✖
```

#### Vue选项式API中如何使用TS

1. 安装脚手架，vue create project

      vue3 + ts + vcil
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688867218796-fb117d08-459b-4db4-a196-4444b3ce0a6b.png#averageHue=%23302c21&clientId=u3a7c48b1-65f1-4&from=paste&height=196&id=uef047d7c&originHeight=289&originWidth=679&originalType=binary&ratio=1&rotation=0&showTitle=false&size=144773&status=done&style=none&taskId=u6a44662a-aae7-430d-9c36-1ba8551a4a4&title=&width=460)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688867247155-73993073-0671-4e68-b46f-c163272ab32b.png#averageHue=%232d2a26&clientId=u3a7c48b1-65f1-4&from=paste&height=268&id=ucab93e76&originHeight=482&originWidth=841&originalType=binary&ratio=1&rotation=0&showTitle=false&size=260511&status=done&style=none&taskId=u418082d9-aa9e-4a68-8864-ce3c985141c&title=&width=468)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688867295414-0450c9e6-cf35-4887-851f-2f083605ef8f.png#averageHue=%23302d28&clientId=u3a7c48b1-65f1-4&from=paste&height=215&id=uf36266f3&originHeight=215&originWidth=1509&originalType=binary&ratio=1&rotation=0&showTitle=false&size=198378&status=done&style=none&taskId=u8f2cec96-8b8d-4f13-939f-36f6922d7eb&title=&width=1509)
不采用类的写法，采用函数式编程
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688867318520-5f7289f2-e17d-4f9a-9df3-1ff822a200f6.png#averageHue=%232b2924&clientId=u3a7c48b1-65f1-4&from=paste&height=157&id=ubb7381dc&originHeight=157&originWidth=1537&originalType=binary&ratio=1&rotation=0&showTitle=false&size=206272&status=done&style=none&taskId=ud40ca9db-c40b-4b8f-9660-425622a41aa&title=&width=1537)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688867429535-effe0312-f55b-41e8-8ad1-f968e178aec8.png#averageHue=%2337342c&clientId=u3a7c48b1-65f1-4&from=paste&height=391&id=u4b0f682d&originHeight=391&originWidth=1737&originalType=binary&ratio=1&rotation=0&showTitle=false&size=569825&status=done&style=none&taskId=u3d6f868c-f609-4f59-8ae3-25c94cd489d&title=&width=1737)

2. `defineComponent`方法，这个方法可以对选项式API进行自动类型推断。并且需要在`<script>`标签上明确指定`lang="ts"`这个属性。
```javascript
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  data(){
    return {
      count: 0
    }
  },
  mounted(){
    this.count = 2   // ✔
  }
});
</script>
```
可以利用类型断言的方式给响应式数据进行类型注解
```javascript
<script lang="ts">
import { defineComponent } from 'vue'
type Count = number | string;
interface List {
  username: string
  age: number
}
export default defineComponent({
  data(){
    return {
      count: 0 as Count,  // 类型断言的方式进行注解
      list: [] as List[]
    }
  }
});
</script>
```
像计算属性、方法等功能就可以正常配合TS的类型系统进行使用就好，
如果是多个类型可以通过类型保护的方式进行控制，代码如下：
```javascript
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  ...
  computed: {
    doubleCount(): number|string{
      if(typeof this.count === 'number'){
        return this.count * 2;
      }
      else{
        return this.count;
      }
    }
  },
  methods: {
    handleClick(n: number){
      if(typeof this.count === 'number'){
        this.count += n;
      }
    }
  }
});
```
####  Vue选项式API中组件通信使用TS

1. 父到子
子： props的count为Number类型
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688888476032-47af486d-c72f-462e-b43a-36d2c7937df5.png#averageHue=%23e9e9e8&clientId=u3a7c48b1-65f1-4&from=paste&height=494&id=u4904d9ee&originHeight=735&originWidth=787&originalType=binary&ratio=1&rotation=0&showTitle=false&size=235236&status=done&style=none&taskId=ua53951ef-84f1-4d46-95fa-2c23395f7f0&title=&width=528.4545288085938)

      父向子传递非Number类型就会报错
    ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688888553047-0d2bfb95-654e-42a0-9d5f-06d636c6d972.png#averageHue=%23e4ddd8&clientId=u3a7c48b1-65f1-4&from=paste&height=520&id=u4421dfd8&originHeight=759&originWidth=788&originalType=binary&ratio=1&rotation=0&showTitle=false&size=306286&status=done&style=none&taskId=u3ae28a4a-ded6-4673-88bf-be360ceec66&title=&width=540.3635864257812)
    想要传递字符串，数字的话，子组件的props可以这样写
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688888624872-fa6901e8-e5c5-4868-a836-f4eb2f776c96.png#averageHue=%23dbd8d1&clientId=u3a7c48b1-65f1-4&from=paste&height=194&id=u20613a4e&originHeight=265&originWidth=717&originalType=binary&ratio=1&rotation=0&showTitle=false&size=89536&status=done&style=none&taskId=u495ac01f-1fdb-49c1-a3af-bf2cf1f8f19&title=&width=525.8181762695312)
   对于更复杂的类型，需要使用vue提供的api，PropType<> 泛型的写法，也会有报错提示
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688888719713-e66a7ae7-1c4d-4190-8afd-a832101c2714.png#averageHue=%23e4e2dd&clientId=u3a7c48b1-65f1-4&from=paste&height=352&id=u9e65dfff&originHeight=609&originWidth=859&originalType=binary&ratio=1&rotation=0&showTitle=false&size=261245&status=done&style=none&taskId=u9057e039-9429-4a04-a5ca-50b2619d5b1&title=&width=497.00848388671875)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688888759509-8dd634e2-6cd5-4c90-84ae-6cb00ebb9bab.png#averageHue=%23eae8e7&clientId=u3a7c48b1-65f1-4&from=paste&height=308&id=u4421d903&originHeight=759&originWidth=1228&originalType=binary&ratio=1&rotation=0&showTitle=false&size=366395&status=done&style=none&taskId=u374eec28-81e6-4283-936d-a2c875ed406&title=&width=498.9999694824219)

2. 子到父，通过emit传值，emit需要写成对象，主要通过emit这边进行判断
父： 需要传递的参数是字符串
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688888906628-7d4a885b-4001-4619-a9d5-751d577fbce5.png#averageHue=%23d7d3cc&clientId=u3a7c48b1-65f1-4&from=paste&height=170&id=u51de9a2d&originHeight=220&originWidth=559&originalType=binary&ratio=1&rotation=0&showTitle=false&size=73204&status=done&style=none&taskId=u4babbfa5-0674-44a1-958c-3532619e2d5&title=&width=433.1817932128906)

       子：
       ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688889100767-9fe573f5-67b7-4bbc-8f7e-ea5b2ea7030d.png#averageHue=%23e6cac1&clientId=u3a7c48b1-65f1-4&from=paste&height=171&id=ueb7f076e&originHeight=363&originWidth=1183&originalType=binary&ratio=1&rotation=0&showTitle=false&size=178358&status=done&style=none&taskId=u6886e68c-5f35-4dc0-a31c-8c61b1af632&title=&width=556.991455078125)
#### Vue组合式API中如何使用TS
相比于选项式更简单，只需要利用原生TS的能力就可以
count和doubleCount都会被自动推断出其对应的类型。如果想要进行更复杂的类型设置，需要自己手动进行类型注解，可利用泛型方式来实现。
```vue
<script setup lang="ts">
  import { computed, ref } from 'vue';
  interface List {
    username: string
    age: number
  }
  // 响应式数据
  let count = ref(0);
  let count1 = ref<number|string>(0);
  let list = ref<List[]>([]);

 
  // 计算属性
  let doubleCount = computed(()=> count.value * 2);
  // 方法
  let handlClick = (n: number) => {
    count.value += n;
  }
</script>
```

## TS面试题

1. 接口和类型别名的区别?
2. 
