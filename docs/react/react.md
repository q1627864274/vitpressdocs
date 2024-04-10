---
outline: deep
---
## React

#### react和vue的区别有那些

1. 语法：
   react使用JSX语法，HTML和JavaScript代码混合在一起
   vue使用模板语法，类似于HTML，有一些额外功能，例如数据绑定和指令
2. 数据绑定
   react使用单向数据流，只能父组件传到子组件，如果子组件需要更新数据，需通过回调函数通知父组件
3. 组件化
   react的组件是JavaScript类或函数
   vue中组件是vue的实例，有自己的状态，方法和生命周期钩子
4. 性能
   都用虚拟Dom最小化Dom操作，但是react更好
5. 更新用户界面方式
   react需要使用useState提供的函数，进行页面的更新
   vue是响应式的，更新数据同时用户界面也会更新



## React(codewhy)

#### **React的开发依赖**

   react：包含react所必须的核心代码 

 react-dom：react渲染在不同平台所需要的核心代码
                    为什么拆分出来？

​                     原因就是react-native

 babel：将jsx转换成React代码的工具

​             为什么不用原生的React.createElement 来编写源代码，因为这样太繁琐
​             直接编写jsx（JavaScript XML）的语法，并且让babel帮助我们转换成React.createElement

​            babel定义：很多浏览器并不支持ES6的语法，通过Babel工具，将ES6转成大多数浏览器都支持的ES5的语法

#### 组件化开发

1. 类的方式封装组件

```javascript
1. 类名大写(组件的名称是必须大写的，小写会被认为是HTML元素)
2. 继承自React.Component
3. .实现当前组件的render函数
    render当中返回的jsx内容，就是之后React会帮助我们渲染的内容
```

#### 组件化-数据依赖

1. 参与数据流，这个数据是定义在当前对象的state中

   

```javascript
1. 过在构造函数中 this.state = {定义的数据}
2. 数据变化时，通过以调用 this.setState 来更新数据（React自动调用render函数进行update操作）
```

#### 组件化-事件绑定

1. 事件绑定中的this
   默认情况下是undefined

```javascript
因为React并不是直接渲染成真实的DOM，我们所编写的button只是一个语法糖，它的本质React的Element对象；
```


      解决方案：
     \1. 在传入函数时，给这个函数直接绑定this

```javascript
<button onClick={this.changeText.bind(this)}
```


     \2. 在constructor函数中书写



```javascript
constructor(){
  super()
   this.changeText = this.changeText.bind(this)
}
```

#### JSX语法

1. 定义：一种JavaScript的语法扩展（eXtension），也在很多地方称之为JavaScript XML，因为看起就是一段XML语法
   在js中写html
2. 书写规范

```html
1.jsx结构中只能有一个根元素
2.jsx结构通常会包裹一个(), 将整个jsx当做一个整体, 实现换行
3.jsx可以是单标签, 也可以双标签, 但是单标签必须以/>结尾
4.JSX的注释写法

render() {
  const { message } = this.state
  return (
    <div>
      <div>
        { /* JSX的注释写法 */ }
        <h2>{message}</h2>
        <br/>
      </div>
      <div>哈哈哈</div>
    </div>
  )
}
```

1. JSX嵌入变量作为子元素

   

```html
          <div>
            {/* 1.Number/String/Array直接显示出来 */}
            <h2>{counter}</h2>
            <h2>{message}</h2>
            <h2>{names}</h2>

            {/* 2.undefined/null/Boolean */}
            <h2>{String(aaa)}</h2>
            <h2>{bbb + ""}</h2>
            <h2>{ccc.toString()}</h2>

            {/* 3.Object类型不能作为子元素进行显示*/}
            <h2>{friend.name}</h2>
            <h2>{Object.keys(friend)[0]}</h2>

            {/* 4.可以插入对应的表达式*/}
            <h2>{10 + 20}</h2>
            <h2>{firstName + " " + lastName}</h2>
            <h2>{fullName}</h2>

            {/* 5.可以插入三元运算符*/}
            <h2>{ageText}</h2>
            <h2>{age >= 18 ? "成年人": "未成年人"}</h2>

            {/* 6.可以调用方法获取结果*/}
            <ul>{liEls}</ul>
            <ul>{this.state.movies.map(movie => <li>{movie}</li>)}</ul>
            <ul>{this.getMovieEls()}</ul>
          </div>
```

1. jsx绑定属性
    绑定title属性 

 绑定有src属性 

 绑定href属性 

 绑定绑定class 

 绑定内联样式style



```html
      render() {
        const { title, imgURL, href, isActive, objStyle } = this.state
      return (
          <div>
            { /* 1.基本属性绑定 */ }
            <h2 title={title}>我是h2元素</h2>
            {/*<img src={imgURL} alt=""/>*/}
            <a href={href}>百度一下</a>

            
            { /* 2.绑定class属性: 最好使用className */ }
            <h2 className={className}>哈哈哈哈</h2>
            <h2 className={classList.join(" ")}>哈哈哈哈</h2>
            // 1.class绑定的写法一: 字符串的拼接
            const className = `abc cba ${isActive ? 'active': ''}`
            // 2.class绑定的写法二: 将所有的class放到数组中
            const classList = ["abc", "cba"]
            if (isActive) classList.push("active")
            // 3.class绑定的写法三: 第三方库classnames -> npm install classnames
             
            { /* 3.绑定style属性: 绑定对象类型 */ }
            <h2 style={{color: "red", fontSize: "30px"}}>呵呵呵呵</h2>
            <h2 style={objStyle}>呵呵呵呵</h2>
          </div>
        )
      }
```



#### React事件绑定

1. this的绑定问题

```html
  /*
      this的四种绑定规则:
        1.默认绑定 独立执行 foo()     默认window/undefined(严格模式下)
        2.隐式绑定 被一个对象执行 obj.foo() ->  obj
        3.显式绑定: call/apply/bind foo.call("aaa") -> String("aaa")
        4.new绑定: new Foo() -> 创建一个新对象, 并且赋值给this
    */
```

1. 解决事件绑定中this的指向问题

   

```html
 方案一：bind给btnClick显示绑定this
 <button onClick={this.btn1Click.bind(this)}>按钮1</button>
  constructor() {
          super()
          this.state = {
            message: "Hello World",
            counter: 100
          }
  
          this.btn1Click = this.btn1Click.bind(this)
}

 方案二：使用 ES6 class fields 语法(使用箭头函数)
<button onClick={this.btn2Click}>按钮2</button>
btn2Click = () => {
        console.log("btn2Click", this)
        this.setState({ counter: 1000 })
}

 方案三：事件监听时传入箭头函数（个人推荐）
btn3Click() {
        console.log("btn3Click", this);
        this.setState({ counter: 9999 })
}
<button onClick={() => this.btn3Click()}>按钮3</button>
```

1. 事件参数传递

   

```html
{/* 1.event参数的传递 */}  直接在方法接收参数event
<button onClick={this.btnClick.bind(this)}>按钮1</button>
<button onClick={(event) => this.btnClick(event)}>按钮2</button>
btnClick(event) {
  console.log("btnClick:", event)
}

{/* 2.额外的参数传递 */}
<button onClick={this.btnClick.bind(this, "kobe", 30)}>按钮3(不推荐)</button>
  btnClick(event, name, age) {
        console.log("btnClick:", event, this)
        console.log("name, age:", name, age)
}
第一种会发现，打印顺序不一样，event最后一个了，原因是bind的影响


<button onClick={(event) => this.btnClick(event, "why", 18)}>按钮4</button>
btnClick(event, name, age) {
        console.log("btnClick:", event, this)
        console.log("name, age:", name, age)
}
第二种更好，参数传递的顺序也对
```

#### React条件渲染

◼ **方式一：if条件判断语句** 

 适合逻辑较多的情况 

```html
render(){
  let showElement = null
  if (isReady) {
    showElement = <h2>准备开始比赛吧</h2>
  } else {
    showElement = <h1>请提前做好准备!</h1>
  }
  return <div>{showElement}</div>
}

  
```

◼ **方式二：三元运算符** 

 适合逻辑比较简单

```html
<div>{ isReady ? <button>开始战斗!</button>: <h3>赶紧准备</h3> }</div>
```

 

◼ **方式三：与运算符&&** 

 适合如果条件成立，渲染某一个组件；如果条件不成立，什么内容也不渲染；
    当某一个值, 有可能为undefined时, 使用&&进行条件判断
    （因为在JavaScript中，&&运算符在两个操作数都为真时返回第二个操作数，否则返回第一个操作数）

```html
<!--条件成立才会渲染，不成立不渲染  -->
<div>{ friend && <div>{friend.name + " " + friend.desc}</div> }</div>
```

 

◼ **v-show的效果** 

 主要是控制display属性是否为none

```html
<!--当为block则渲染，否则不渲染  -->
<h2 style={{display: isShow ? 'block': 'none'}}>哈哈哈哈</h2>
```

#### React列表渲染  

列表最多的方式就是使用数组的map高阶函数

先对它进行一些处理filter，slice函数

```html
      render() {
        return (
          <div>
            <h2>学生列表数据</h2>
            <div className="list">
              {
                students.filter(item => item.score > 100).slice(0, 2).map(item => {
                  return (
                    <div className="item" key={item.id}>
                      <h2>学号: {item.id}</h2>
                      <h3>姓名: {item.name}</h3>
                      <h1>分数: {item.score}</h1>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
```

#### JSX转换过程

定义：所有的jsx最终都会被转换成React.createElement的函数调用

```html
React.createElement(component, props, ...children)
◼ 参数一：type
 当前ReactElement的类型；
 如果是标签元素，那么就使用字符串表示 “div”；
 如果是组件元素，那么就直接使用组件的名称；
◼ 参数二：config
 所有jsx中的属性都在config中以对象的属性和值的形式存储；
 比如传入className作为元素的class；
◼ 参数三：children
 存放在标签中的内容，以children数组的方式进行存储；
 当然，如果是多个元素呢？React内部有对它们进行处理，处理的源码在下方
```

例如：不要babel进行转换直接写react.createElement函数，也是可以运行的



```html
    class App extends React.Component {
      constructor() {
        super()
        this.state = {
          message: "Hello World"
        }
      }

      render() {
        const { message } = this.state

        const element = React.createElement(
          "div",
          null,
  /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "header"
            },
            "Header"
          ),
  /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "Content"
            },
    /*#__PURE__*/ React.createElement("div", null, "Banner"),
    /*#__PURE__*/ React.createElement(
              "ul",
              null,
      /*#__PURE__*/ React.createElement(
                "li",
                null,
                "\u5217\u8868\u6570\u636E1"
              ),
      /*#__PURE__*/ React.createElement(
                "li",
                null,
                "\u5217\u8868\u6570\u636E2"
              ),
      /*#__PURE__*/ React.createElement(
                "li",
                null,
                "\u5217\u8868\u6570\u636E3"
              ),
      /*#__PURE__*/ React.createElement(
                "li",
                null,
                "\u5217\u8868\u6570\u636E4"
              ),
      /*#__PURE__*/ React.createElement("li", null, "\u5217\u8868\u6570\u636E5")
            )
          ),
  /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "footer"
            },
            "Footer"
          )
        );
        
        console.log(element)

        return element
      }
    }

    // 2.创建root并且渲染App组件
    const root = ReactDOM.createRoot(document.querySelector("#root"))
    root.render(React.createElement(App, null))
```

#### **React.createElement的作用、**

作用：React利用ReactElement对象组成了一个JavaScript的对象树（虚拟DOM（Virtual DOM））

#### 虚拟dom的作用

定义：虚拟DOM帮助我们从命令式编程转到了声明式编程的模式
你只需要告诉React希望让UI是什么状态； 

React来确保DOM和这些状态是匹配的； 

你不需要直接进行DOM操作，就可以从手动更改DOM、属性操作、事件处理中解放出来；

#### PWA（了解）

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694847787566-c3a8cc16-d803-48ba-90ba-1aac3001f0db.png)

#### React中的脚手架

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694847891059-50095bc7-82d0-4129-a05a-579ff2df2199.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694847923202-821ef6c1-3ab0-4d76-b4ce-1e1183472ae5.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694847937041-7040518a-a668-4e51-bdde-8d9472a30c3a.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694847953192-66ec5b0b-b14e-4273-8d7d-de02bb2f21df.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694847976650-4a95d979-b018-4e23-bf89-d0ce6c42537b.png)

#### React工程化的编写流程

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694848147600-a8819d24-51fb-422b-a515-f1bf6c80671b.png)

#### React组件化

定义：开发出一个个独立可复用的小组件来构造我们的应用（React的核心思想）

- 组件化的分类
  \1. 根据组件的定义方式，可以分为：函数组件(Functional Component )和类组件(Class Component)；
  \2. 根据组件内部是否有状态需要维护，可以分成：无状态组件(Stateless Component )和有状态组件(Stateful Component)；
  \3. 根据组件的不同职责，可以分成：展示型组件(Presentational Component)和容器型组件(Container Component)；

  

#### 类组件

- 书写要求
  \1. 组件的名称是大写字符开头（无论类组件还是函数组件）
  \2. 类组件需要继承自 React.Component
  \3. 类组件必须实现render函数

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694848614429-c6f84c6c-fd55-4d14-9e25-0e4e91b3bf69.png)
render可以return的类型

```jsx
import React from "react";
// 1.类组件
class App extends React.Component {
  constructor() {
    super()

    this.state = {
      message: "App Component"
    }
  }

  render() {
    // const { message } = this.state
    // 1.react元素: 通过jsx编写的代码就会被编译成React.createElement, 所以返回的就是一个React元素
    // return <h2>{message}</h2>

    // 2.组件或者fragments(后续学习)
    // return ["abc", "cba", "nba"]
    // return [
    //   <h1>h1元素</h1>,
    //   <h2>h2元素</h2>,
    //   <div>哈哈哈</div>
    // ]

    // 3.字符串/数字类型
    // return "Hello World"

    return true
  }
}

export default App;
```

函数组件
\1. 使用function来进行定义的函数，只是这个函数会返回和类组件中render函数返回一样的内容
![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694848706223-2d8bc265-5362-4220-a155-cbb19b11dbc8.png)


后面学习Hooks时，会针对函数式组件进行更多的学习

```jsx
// 函数式组件
function App(props) {
  // 返回值: 和类组件中render函数返回的是一致
  return <h1>App Functional Component</h1>
}

export default App
```

#### 生命周期

1. 装载阶段（Mount），组件第一次在DOM树中被渲染的过程
2. 更新过程（Update），组件状态发生变化，重新更新渲染的过程；
3. 卸载过程（Unmount），组件从DOM树中被移除的过程

我们组件内部实现的某些函数进行回调，这些函数就是生命周期函数：
![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694849117551-a95973b8-db94-4031-b3dc-f1e2ed05d6a6.png)



```jsx
1. Constructor（不初始化 state 或不进行方法绑定 ==> 不需要）
  通过给 this.state 赋值对象来初始化内部的state
  为事件绑定实例（this）
2.执行render函数
  渲染dom节点
3.componentDidMount（会在组件挂载后（插入 DOM 树中）立即调用）
  依赖于DOM的操作可以在这里进行；
  在此处发送网络请求就最好的地方；（官方建议）
  可以在此处添加一些订阅（会在componentWillUnmount取消订阅）
4. componentDidUpdate（会在更新后会被立即调用，首次渲染不会执行此方法）
  当组件更新后，可以在此处对 DOM 进行操作；
  如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求；（例如，当 props 未发生变 
  化  时，则不会执行网络请求
5. componentWillUnmount（会在组件卸载及销毁之前直接调用）
  在此方法中执行必要的清理操作；
  例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等；
```





```jsx
import React from "react"

class HelloWorld extends React.Component {
  // 1.构造方法: constructor
  constructor() {
    console.log("HelloWorld constructor")
    super()

    this.state = {
      message: "Hello World"
    }
  }

  changeText() {
    this.setState({ message: "你好啊, 李银河" })
  }

  // 2.执行render函数
  render() {
    console.log("HelloWorld render")
    const { message } = this.state

    return (
      <div>
        <h2>{message}</h2>
        <p>{message}是程序员的第一个代码!</p>
        <button onClick={e => this.changeText()}>修改文本</button>
      </div>
    )
  }

  // 3.组件被渲染到DOM: 被挂载到DOM
  componentDidMount() {
    console.log("HelloWorld componentDidMount")
  }

  // 4.组件的DOM被更新完成： DOM发生更新
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("HelloWorld componentDidUpdate:", prevProps, prevState, snapshot)
  }

  // 5.组件从DOM中卸载掉： 从DOM移除掉
  componentWillUnmount() {
    console.log("HelloWorld componentWillUnmount")
  }


  // 不常用的生命周期补充
  shouldComponentUpdate() {
    return true
  }

  getSnapshotBeforeUpdate() {
    console.log("getSnapshotBeforeUpdate")
    return {
      scrollPosition: 1000
    }
  }
}

export default HelloWorld
```

扩展：
![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694849545352-3e9bdea3-e52b-449b-9d7e-05c647b25e14.png)

#### 组件通信

- 父传子   怎么传递 ，以及类型限制  默认值书写
  可以参考官网：https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html
  <MainBanner banners={banners} title="轮播图"/>
  父：

```jsx
import React, { Component } from 'react'
import axios from "axios"

import MainBanner from './MainBanner'
import MainProductList from './MainProductList'

export class Main extends Component {
  constructor() {
    super()

    this.state = {
      banners: [],
      productList: []
    }
  }

  componentDidMount() {
    axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
      const banners = res.data.data.banner.list
      const recommend = res.data.data.recommend.list
      this.setState({
        banners,
        productList: recommend
      })
    })
  }

  render() {
    const { banners, productList } = this.state

    return (
      <div className='main'>
        <div>Main</div>
        {/* 通过属性传递  */}
        <MainBanner banners={banners} title="轮播图"/>
        <MainBanner/>
        <MainProductList productList={productList}/>
      </div>
    )
  }
}

export default Main
```

 子： const { title, banners } = this.props 进行接收



```jsx
import React, { Component } from 'react'
import PropTypes from "prop-types"

export class MainBanner extends Component {
  // static defaultProps = {
  //   banners: [],
  //   title: "默认标题"
  // }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    // console.log(this.props)
    const { title, banners } = this.props

    return (
      <div className='banner'>
        <h2>封装一个轮播图: {title}</h2>
        <ul>
          {
            banners.map(item => {
              return <li key={item.acm}>{item.title}</li>
            })
          }
        </ul>
      </div>
    )
  }
}

// MainBanner传入的props类型进行验证
MainBanner.propTypes = {
  banners: PropTypes.array,
  title: PropTypes.string
}

// MainBanner传入的props的默认值
MainBanner.defaultProps = {
  banners: [],
  title: "默认标题"
}

export default MainBanner
```

- 字传父  父组件给子组件传递一个回调函数

```jsx
import React, { Component } from 'react'
import AddCounter from './AddCounter'
import SubCounter from './SubCounter'

export class App extends Component {
  constructor() {
    super()

    this.state = {
      counter: 100
    }
  }

  changeCounter(count) {
    this.setState({ counter: this.state.counter + count })
  }

  render() {
    const { counter } = this.state

    return (
      <div>
        <h2>当前计数: {counter}</h2>
        {/* 传递回调函数 */}
        <AddCounter addClick={(count) => this.changeCounter(count)}/>
        <SubCounter subClick={(count) => this.changeCounter(count)}/>
      </div>
    )
  }
}

export default App
import React, { Component } from 'react'
// import PropTypes from "prop-types"

export class AddCounter extends Component {
  addCount(count) {
    this.props.addClick(count)
  }

  render() {

    return (
      <div>
        <button onClick={e => this.addCount(1)}>+1</button>
        <button onClick={e => this.addCount(5)}>+5</button>
        <button onClick={e => this.addCount(10)}>+10</button>
      </div>
    )
  }
}

// AddCounter.propTypes = {
//   addClick: PropTypes.func
// }

export default AddCounter
```



#### 组件插槽

1. 组件的children子元素
   ![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694850624483-00e615e5-4351-4fd3-8f24-75a615367c71.png)

   

```jsx
import React, { Component } from 'react'
import NavBar from './nav-bar'
import NavBarTwo from './nav-bar-two'

export class App extends Component {
  render() {
    const btn = <button>按钮2</button>

    return (
      <div>
        {/* 1.使用children实现插槽 */}
        <NavBar>
          <button>按钮</button>
          <h2>哈哈哈</h2>
          <i>斜体文本</i>
        </NavBar>
    )
  }
}

export default App
import React, { Component } from 'react'
// import PropTypes from "prop-types"
import "./style.css"

export class NavBar extends Component {
  render() {
    const { children } = this.props
    console.log(children)

    return (
      <div className='nav-bar'>
        <div className="left">{children[0]}</div>
        <div className="center">{children[1]}</div>
        <div className="right">{children[2]}</div>
      </div>
    )
  }
}

// NavBar.propTypes = {
//   children: PropTypes.array
// }

export default NavBar
```

1. props属性传递React元素；
   ![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694850679164-8099f5d6-0e9b-4b6e-8499-d448e12fe358.png)

   

```jsx
import React, { Component } from 'react'
import NavBar from './nav-bar'
import NavBarTwo from './nav-bar-two'

export class App extends Component {
  render() {
    const btn = <button>按钮2</button>

    return (
      <div>
        {/* 2.使用props实现插槽 */}
        <NavBarTwo 
          leftSlot={btn}
          centerSlot={<h2>呵呵呵</h2>}
          rightSlot={<i>斜体2</i>}
        />
      </div>
    )
  }
}

export default App
import React, { Component } from 'react'

export class NavBarTwo extends Component {
  render() {
    const { leftSlot, centerSlot, rightSlot } = this.props

    return (
      <div className='nav-bar'>
        <div className="left">{leftSlot}</div>
        <div className="center">{centerSlot}</div>
        <div className="right">{rightSlot}</div>
      </div>
    )
  }
}

export default NavBarTwo
```





#### 作用域插槽

通过props传递回调函数来  将子组件参数传递到父组件的插槽中



```jsx
import React, { Component } from 'react'
import TabControl from './TabControl'

export class App extends Component {
  constructor() {
    super()

    this.state = {
      titles: ["流行", "新款", "精选"],
      tabIndex: 0
    }
  }

  tabClick(tabIndex) {
    this.setState({ tabIndex })
  }

  getTabItem(item) {
    if (item === "流行") {
      return <span>{item}</span>
    } else if (item === "新款") {
      return <button>{item}</button>
    } else {
      return <i>{item}</i>
    }
  }

  render() {
    const { titles, tabIndex } = this.state

    return (
      <div className='app'>
        <TabControl 
          titles={titles} 
          // 通过传递回调函数进行作用域插槽传递
          tabClick={i => this.tabClick(i)}
          // itemType={item => <button>{item}</button>}
          itemType={item => this.getTabItem(item)}
        />
        <h1>{titles[tabIndex]}</h1>
      </div>
    )
  }
}

export default App
```





```jsx
import React, { Component } from 'react'
import "./style.css"

export class TabControl extends Component {
  constructor() {
    super()

    this.state = {
      currentIndex: 0
    }
  }

  itemClick(index) {
    // 1.自己保存最新的index
    this.setState({ currentIndex: index })

    // 2.让父组件执行对应的函数
    this.props.tabClick(index)
  }

  render() {
    const { titles, itemType } = this.props
    const { currentIndex } = this.state

    return (
      <div className='tab-control'>
        {
          titles.map((item, index) => {
            return (
              <div 
                className={`item ${index === currentIndex?'active':''}`} 
                key={item}
                onClick={e => this.itemClick(index)}
              >
                {/* <span className='text'>{item}</span> */}
                {itemType(item)}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default TabControl
```

#### 非父子通信-context  

较为复杂



```jsx
import React from "react"

// 1.创建一个Context
const UserContext = React.createContext()

export default UserContext
```





```jsx
import React, { Component } from 'react'
import Home from './Home'

import ThemeContext from "./context/theme-context"
import UserContext from './context/user-context'
import Profile from './Profile'

export class App extends Component {
  constructor() {
    super()

    this.state = {
      info: { name: "kobe", age: 30 }
    }
  }

  render() {
    const { info } = this.state

    return (
      <div>
        <h2>App</h2>
        {/* 1.给Home传递数据 */}
        {/* <Home name="why" age={18}/>
        <Home name={info.name} age={info.age}/>
        <Home {...info}/> */}

        {/* 2.普通的Home */}
        {/* 第二步操作: 通过ThemeContext中Provider中value属性为后代提供数据 */}
        <UserContext.Provider value={{nickname: "kobe", age: 30}}>
          <ThemeContext.Provider value={{color: "red", size: "30"}}>
            <Home {...info}/>
          </ThemeContext.Provider>
        </UserContext.Provider>
        <Profile/>
      </div>
    )
  }
}

export default App
```





```jsx
import React, { Component } from 'react'
import ThemeContext from './context/theme-context'
import UserContext from './context/user-context'

export class HomeInfo extends Component {
  render() {
    // 4.第四步操作: 获取数据, 并且使用数据
    console.log(this.context)

    return (
      <div>
        <h2>HomeInfo: {this.context.color}</h2>
        <UserContext.Consumer>
          {
            value => {
              return <h2>Info User: {value.nickname}</h2>
            }
          }
        </UserContext.Consumer>
      </div>
    )
  }
}

// 3.第三步操作: 设置组件的contextType为某一个Context
HomeInfo.contextType = ThemeContext

export default HomeInfo
```





```jsx
import ThemeContext from "./context/theme-context"

function HomeBanner() {

  return <div>
    {/* 函数式组件中使用Context共享的数据 */}
    <ThemeContext.Consumer>
      {
        value => {
          return <h2> Banner theme:{value.color}</h2>
        }
      }
    </ThemeContext.Consumer>
  </div>
}

export default HomeBanner
```





```jsx
import React, { Component } from 'react'
import ThemeContext from './context/theme-context'

export class Profile extends Component {
  render() {
    console.log(this.context)

    return (
      <div>Profile</div>
    )
  }
}

Profile.contextType = ThemeContext

export default Profile
```

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694851700695-167b2e67-9aa8-417b-8b57-fc1502bc6031.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694851681509-6bd03839-0eea-49a4-b140-80aae923b206.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694851717336-4a39b75c-5b6d-43d1-bcab-02b882a445fd.png)

#### 非父子通信-EventBus

使用的一个第三方库`import { HYEventBus } from "hy-event-store`

utils/event-bus.js

```jsx
import { HYEventBus } from "hy-event-store"
const eventBus = new HYEventBus()
export default eventBus
```

HomeBanner.jsx（孙组件）

```jsx
import React, { Component } from 'react'
// 导入eventBus
import eventBus from "./utils/event-bus"

export class HomeBanner extends Component {
  prevClick() {
    console.log("上一个")
    // 发送事件
    eventBus.emit("bannerPrev", "why", 18, 1.88)
  }

  nextClick() {
    console.log("下一个")
    // 发送事件
    eventBus.emit("bannerNext", {nickname: "kobe", level: 99})
  }

  render() {
    return (
      <div>
        <h2>HomeBanner</h2>
        <button onClick={e => this.prevClick()}>上一个</button>
        <button onClick={e => this.nextClick()}>下一个</button>
      </div>
    )
  }
}

export default HomeBanner
```


App.jsx   进行监听该事件



```jsx
import React, { Component } from 'react'
import Home from './Home'
// 导入eventBus
import eventBus from './utils/event-bus'

export class App extends Component {
  constructor() {
    super()

    this.state = {
      name: "",
      age: 0,
      height: 0
    }
  }

  componentDidMount() {
    // eventBus.on("bannerPrev", (name, age, height) => {
    //   console.log("app中监听到bannerPrev", name, age, height)
    //   this.setState({ name, age, height })
    // })
    // 监听该事件，并且可以接收参数
    eventBus.on("bannerPrev", this.bannerPrevClick, this)
    eventBus.on("bannerNext", this.bannerNextClick, this)
  }

  bannerPrevClick(name, age, height) {
    console.log("app中监听到bannerPrev", name, age, height)
    this.setState({ name, age, height })
  }

  bannerNextClick(info) {
    console.log("app中监听到bannerNext", info)
  }

  componentWillUnmount() {
    // 卸载该事件
    eventBus.off("bannerPrev", this.bannerPrevClick)
  }

  render() {
    const { name, age, height } = this.state

    return (
      <div>
        <h2>App Component: {name}-{age}-{height}</h2>
        <Home/>
      </div>
    )
  }
}

export default App
```

#### setState详解

Vue2中的Object.defineProperty或者Vue3中的Proxy的方式来监听数据的变化（数据劫持）
React必须通过setState来告知React数据已经发生了变化（无数据劫持）
![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694934681068-88165938-e736-4ab4-bd12-c936e9021954.png)
组件中，setState方法是从Component中继承过来的（挂载在Component原型上面的）
![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694934156316-448fe29b-686f-4745-8dd1-7173d058d5e5.png)

- setState的三种用法
  \1. 基本使用
      传入的是一个对象

```jsx
this.setState({
  message: "你好啊, 李银河"
})
```


       \2. setState可以传入一个回调函数
           好处一: 可以在回调函数中编写新的state的逻辑
           好处二: 当前的回调函数会将之前的state和props传递进来

```jsx
this.setState((state, props) => {
  // 1.编写一些对新的state处理逻辑
  // 2.可以获取之前的state和props值
  console.log(this.state.message, this.props)
  return {
    message: "你好啊, 李银河"
  }
})
```


        \3. setState在React的事件处理中是一个异步调用
           如果希望在数据更新之后(数据合并), 获取到对应的结果执行一些逻辑代码
           那么可以在setState中传入第二个参数: callback

```jsx
    this.setState({ message: "你好啊, 李银河" }, () => {
      console.log("++++++:", this.state.message)   // 原来的值
    })
    console.log("------:", this.state.message)   // 改变的值    ==>你好啊, 李银河
```

####   

#### setState设计是异步的  

在react18之前, setTimeout中setState操作, 是同步操作
在react18之后, setTimeout中setState异步操作(批处理)

1. 异步的原因是什么？

   

```jsx
1. 显著的提升性能

因为每次调用 setState都进行一次更新，那么意味着render函数会被频繁调用，界面重新渲染，这样效率是很低的；（所以将setState异步处理，放在队列中，统一合并，最终只是调动一次render函数，diff算法，渲染界面）
2. state和props保持同步
如果同步更新了state，但是还没有执行render函数，props就和state中的不一致（导致很麻烦）
```





```jsx
    this.setState({
      counter: this.state.counter + 1
    })
    this.setState({
      counter: this.state.counter + 1
    })
    this.setState({
      counter: this.state.counter + 1
    })
最终结果还是1，因为异步每个的this.state.counter都是0

this.setState((state) => {
  return {
    counter: state.counter + 1
  }
})
this.setState((state) => {
  return {
    counter: state.counter + 1
  }
})
this.setState((state) => {
  return {
    counter: state.counter + 1
  }
})
最终结果是3，因为异步每个的state是最新的state
```





#### 获取setState的异步结果  

1. setState的回调,第二个参数是一个回调函数，这个回调函数会在更新后会执行；
   ![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694935612280-efd9f1f7-54d0-4c00-9853-9a87cab973be.png)
2. 生命周期函数
   ![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1694935582998-beb98129-09e7-4745-b592-6b9db8026ed2.png)

#### setState一定是异步吗？



huawei



```jsx
1. 在react18之前，存在同步的情况
 
   在setTimeout或者原生dom事件，setState是同步的
   changeText(){
      setTimeout(() => {
          message: "你好，李银河"
      })
   }
   console.log(this.state.message) //  你好，李银河
   打印的是修改后的值，所以是同步的
   
   原生dom事件
   const btnE1 = document.getElementById('btn')
   btnE1.addEventListener('click', () => {
       this.setState({
           message: '你好啊，李银河'
       })
       console.log(this.state.message) //  你好，李银河
       打印的是修改后的值，所以是同步的
   })
   
   
2. react18之后，全是异步
   在React18之后，默认所有的操作都被放到了批处理中（异步处理）

   希望代码可以同步会拿到，则需要执行特殊的flushSync操作
   import { flushSync } from 'react-dom'
    changeText() {
    setTimeout(() => {
      flushSync(() => {
        this.setState({ message: "你好啊, 李银河" })
      })
      console.log(this.state.message)  // 你好啊, 李银河
      // 代码是同步的
    }, 0);
    }
```



#### React性能优化SCU



1.  React的更新流程
   props/state改变  ==>  render函数重新执行  ==> 产生新的DOM树
   ==> 新旧DOM树进行diff  ==>  计算出差异进行更新  ==>  更新到真实的DOM 
2.  新旧虚拟dom比较的时候，keys的优化 

```jsx
在map循环遍历的时候
1. 在最后位置插入数据(这种情况，有无key意义并不大)
2. 在前面插入数据(这种做法，在没有key的情况下，所有的li都需要进行修改)
3. 在中间插入数据（没有key的，后面的都要改变，有key的话只变一个）
key的注意事项：
 key应该是唯一的；
 key不要使用随机数（随机数在下一次render时，会重新生成一个数字）；
 使用index作为key，对性能是没有优化的；
```

 

1.  state/props改变，render函数被调用，render函数调用的优化
   背景：**只要是修改了 App中的数据，所有的组件都需要重新render，进行diff算法， 性能必然是很低的**
   很多的组件没有必须要重新render 

```jsx
优化方向：就是依赖的数据（state、props）发生改变时，再调用自己的render方法

render是否调用，通过shouldComponentUpdate返回true/false（SCU）
通过前后的state/pros改不改变，来判断是否更新
// shouldComponentUpdate(nextProps, newState) {
//   // App进行性能优化的点
//   if (this.state.message !== newState.message || this.state.counter !== newState.counter) {
//     return true
//   }
//   return false
// }
```


每一个类组件都这么判断太麻烦，所以采用react官方的**将class继承自PureComponent**  



#### PureComponent的底层原理



根据react源码中的shallowEqual进行浅层比较



```jsx
if (ctor.prototype && ctor.prototype.isPureReactComponent){
   return.(
   !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newstate)
  )
}
```



针对类组件可以使用PureComponent，针对函数式组件使用高阶组件memo



```jsx
import { memo } from "react"

const Profile = memo(function(props) {
  console.log("profile render")
  return <h2>Profile: {props.message}</h2>
})

export default Profile
```



#### 不可变数据的力量



```jsx
 this.state = {
      books: [
        { name: "你不知道JS", price: 99, count: 1 },
        { name: "JS高级程序设计", price: 88, count: 1 },
        { name: "React高级设计", price: 78, count: 2 },
        { name: "Vue高级设计", price: 95, count: 3 },
  ],

1. 当类的继承使用的是PureComponent，官方建议做法
     
    赋值一份books, 在新的books中修改, 设置新的books
    const books = [...this.state.books]
    books.push(newBook)
    this.setState({ books: books })
2. 采用直接修改数据
    this.state.books.push(newBook)
    this.setState({ books: this.state.books })
    注：在PureComponent是不能引入重新渲染(re-render)
       因为新旧一样，无变化
       在Component可以渲染
```



#### ref的使用



1.  获取原生dom 

```jsx
1.方式一: 在React元素上绑定一个ref字符串   (不推荐)
    <h2 ref="why">Hello World</h2>
    console.log(this.refs.why)
2. 方式二: 提前创建好ref对象, createRef(), 将创建出来的对象绑定到元素 (推荐)
   constructor() {
    super()
    this.titleRef = createRef()
   }
   <h2 ref={this.titleRef}>你好啊,李银河</h2>
   console.log(this.titleRef.current)
3. 方式三: 传入一个回调函数, 在对应的元素被渲染之后, 回调函数被执行, 并且将元素传入
    constructor() {
    super()
    this.titleEl = null
   }
    <h2 ref={el => this.titleEl = el}>你好啊, 师姐</h2>
    console.log(this.titleEl)
```

 

1.  获取类组件实例
   使用第二种方式createRef()获取组件实例 

```jsx
 constructor() {
    super()
    this.hwRef = createRef()
  }
<HelloWorld ref={this.hwRef}/>
console.log(this.hwRef.current)
this.hwRef.current.test()
```

  

1.  获取函数组件的DOM
   **不能在函数组件上使用 ref 属性，因为他们没有实例** 

```jsx
constructor() {
    super()
    this.hwRef = createRef()
}
 <HelloWorld ref={this.hwRef}/>
const HelloWorld = forwardRef(function(props, ref) {
  return (
    <div>
      <h1 ref={ref}>Hello World</h1>
      <p>哈哈哈</p>
    </div>
  )
console.log(this.hwRef.current)
```

  



#### 受控组件和非受控组件



1.  什么是受控组件
   例如：input等表单元素 :value绑定了state就成了受控组件
   受控组件不绑定change，则直接在浏览器输入内容无法输入进去 

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      username: "coderwhy"
    }
  }

  inputChange(event) {
    console.log("inputChange:", event.target.value)
    this.setState({ username: event.target.value })
  }

  render() {
    const { username } = this.state

    return (
      <div>
        {/* 受控组件 */}
        <input type="checkbox" value={username} onChange={e => this.inputChange(e)}/>

        {/* 非受控组件 */}
        <input type="text" />
        <h2>username: {username}</h2>
      </div>
    )
  }
}

export default App
```

 

1.  非受控组件
   不绑定value 

```jsx
   {/* 非受控组件 */}
        <input type="text" />
        <h2>username: {username}</h2>
```

#### 高阶函数



1. 定义：**接受一个或多个函数作为输入**或者**输出一个函数**
   (较常见的filter、map、reduce)



#### 高阶组件



基于React的 组合特性而形成的设计模式



定义：



- 高阶组件是参数为组件，返回值为新组件的函数
- 本身不是一个组件，而是**一个函数**



例子：redux中的connect，react-router中的withRouter



拦截组件，在组件中添加一些操作，例如传pros之类的操作



```jsx
import React, { PureComponent } from 'react'

// 定义一个高阶组件
function hoc(Cpn) {
  // 1.定义类组件
//   class NewCpn extends PureComponent {
//     render() {
//       return <Cpn name="why"/>
//     }
//   }
//   return NewCpn

//   定义函数组件
  function NewCpn2(props) {
   return <Cpn name="why"/>
  }
  return NewCpn2
}

class HelloWorld extends PureComponent {
  render() {
    // 通过高阶组件拦截添加了props 的 name
    console.log(this.props.name)
    return <h1>Hello World</h1>
  }
}

const HelloWorldHOC = hoc(HelloWorld)

export class App extends PureComponent {
  render() {
    return (
      <div>
        <HelloWorldHOC/>
      </div>
    )
  }
}

export default App
```



应用：



1.  props增强 

```jsx
enhanced_props.jsx 
// 高阶函数定义
import { PureComponent } from 'react'

// 定义组件: 给一些需要特殊数据的组件, 注入props
function enhancedUserInfo(OriginComponent) {
  class NewComponent extends PureComponent {
    constructor(props) {
      super(props)

      this.state = {
        userInfo: {
          name: "coderwhy",
          level: 99
        }
      }
    }

    render() {
      return <OriginComponent {...this.props} {...this.state.userInfo}/>
    }
  }

  return NewComponent
}

export default enhancedUserInfo


// App.jsx文件
import React, { PureComponent } from 'react'
import enhancedUserInfo from './hoc/enhanced_props'
import About from './pages/About'
const Home = enhancedUserInfo(function(props) {
  return <h1>Home: {props.name}-{props.level}-{props.banners}</h1>
})

// 使用高阶组件，向组件注入props
const Profile = enhancedUserInfo(function(props) {
  return <h1>Profile: {props.name}-{props.level}</h1>
})
// 使用高阶组件，向组件注入props
const HelloFriend = enhancedUserInfo(function(props) {
  return <h1>HelloFriend: {props.name}-{props.level}</h1>
})
// 使用高阶组件，向组件注入props
export class App extends PureComponent {
  render() {
    return (
      <div>
        <Home banners={["轮播1", "轮播2"]}/>
        <Profile/>
        <HelloFriend/>

        <About/>
      </div>
    )
  }
}

export default App

// about.jsx
import React, { PureComponent } from 'react'
import enhancedUserInfo from '../hoc/enhanced_props'

export class About extends PureComponent {
  render() {
    return (
      <div>About: {this.props.name}</div>
    )
  }
}
// 导出的时候使用高阶组件
export default enhancedUserInfo(About)
```

 

1.  利用高阶组件来共享Context 

```jsx
// 不用高阶组件的共享Context
theme_contex.jsx
import { createContext } from "react"
const ThemeContext = createContext()
export default ThemeContext

App.jsx
import React, { PureComponent } from 'react'
import ThemeContext from './context/theme_context'
import Product from './pages/Product'
export class App extends PureComponent {
  render() {
    return (
      <div>
        <ThemeContext.Provider value={{color: "red", size: 30}}>
          <Product/>
        </ThemeContext.Provider>
      </div>
    )
  }
}

export default App

Product.jsx
import React, { PureComponent } from 'react'
import ThemeContext from '../context/theme_context'
import withTheme from '../hoc/with_theme'

export class Product extends PureComponent {
  render() {
    return (
      <div>
        Product:
        <ThemeContext.Consumer>
          {
            value => {
              return <h2>theme:{value.color}-{value.size}</h2>
            }
          }
        </ThemeContext.Consumer>
      </div>
    )
  }
}

export default Product

// 问题点：需要用的组件，都要这么写，感觉重复代码过多，尝试使用高阶组件
```

  

1.  渲染判断鉴权
    某些页面是必须用户登录成功才能进行进入；
    如果用户没有登录成功，那么直接跳转到登录页面； 

```jsx
App.jsx
import React, { PureComponent } from 'react'
import Cart from './pages/Cart'

export class App extends PureComponent {
  constructor() {
    super()
  }

  loginClick() {
    localStorage.setItem("token", "coderwhy")
    // 强制刷新
    this.forceUpdate()
  }
  render() {
    return (
      <div>
        App
        <button onClick={e => this.loginClick()}>登录</button>
        <Cart/>
      </div>
    )
  }
}

export default App


loginAuth.jsx
function loginAuth(OriginComponent) {
  return props => {
    // 从localStorage中获取token
    const token = localStorage.getItem("token")
    // 拦截判断
    if (token) {
      return <OriginComponent {...props}/>
    } else {
      return <h2>请先登录, 再进行跳转到对应的页面中</h2>
    }
  }
}

export default loginAuth


Cart.jsx
import React, { PureComponent } from 'react'
import loginAuth from '../hoc/login_auth'

export class Cart extends PureComponent {
  render() {
    return (
      <h2>Cart Page</h2>
    )
  }
}

export default loginAuth(Cart)
```

 

1.  生命周期劫持（例如：组件渲染时间，render函数） 

```jsx
App.jsx
import React, { PureComponent } from 'react'
import Detail from './pages/Detail'
export class App extends PureComponent {
  render() {
    return (
      <div>
        <Detail/>
      </div>
    )
  }
}
export default App

logRenderTime.jsx
import { PureComponent } from "react";
function logRenderTime(OriginComponent) {
  return class extends PureComponent {
    // 将要渲染的生命周期
    UNSAFE_componentWillMount() {
      this.beginTime = new Date().getTime()
    }
    // 渲染完的生命周期
    componentDidMount() {
      this.endTime = new Date().getTime()
      const interval = this.endTime - this.beginTime
      console.log(`当前${OriginComponent.name}页面花费了${interval}ms渲染完成!`)
    }
    render() {
      return <OriginComponent {...this.props}/>
    }
  }
}

export default logRenderTime

Detail.jsx
import React, { PureComponent } from 'react'
import logRenderTime from '../hoc/log_render_time'

export class Detail extends PureComponent {
  // UNSAFE_componentWillMount() {
  //   this.beginTime = new Date().getTime()
  // }

  // componentDidMount() {
  //   this.endTime = new Date().getTime()
  //   const interval = this.endTime - this.beginTime
  //   console.log(`当前页面花费了${interval}ms渲染完成!`)
  // }
  render() {
    return (
      <div>
        <h2>Detail Page</h2>
        <ul>
          <li>数据列表1</li>
          <li>数据列表2</li>
          <li>数据列表3</li>
          <li>数据列表4</li>
          <li>数据列表5</li>
          <li>数据列表6</li>
          <li>数据列表7</li>
          <li>数据列表8</li>
          <li>数据列表9</li>
          <li>数据列表10</li>
        </ul>
      </div>
    )
  }
}
// 导入的时候进行拦截 logRenderTime
export default logRenderTime(Detail)
```

 

1.  ref的转发
   作用：获取函数式组件中某个元素的DOM，通过forwardRef高阶函数 



实早期的React有提供组件之间的一种复用方式是mixin（目前已经不再建议使用）



缺点：



- Mixin 可能会**相互依赖，相互耦合，不利于代码维护**
- **不同的Mixin中的方法可能会相互冲突**
- Mixin非常多时，组件处理起来会比较麻烦，甚至还要为其做相关处理，这样会给代码造成**滚雪球式**的复杂性；



高阶组件的缺点



- HOC需要在原组件上进行包裹或者嵌套，如果大量使用HOC，将会产生**非常多的嵌套，这让调试变得非常困难**；
- HOC可以**劫持props，在不遵守约定的情况下也可能造成冲突**



最佳方案： **Hooks的出现，是开创性的，它解决了很多React之前的存在的问题**



#### Portals的使用



定义：希望渲染的内容独立于父组件，甚至是独立于当前挂载到的DOM元素中（默认都是挂载到id为root的DOM 元素上的）



用法：



- 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment；
- 第二个参数（container）是一个 DOM 元素；



```jsx
index.html
  <body>
    <div id="root"></div>
    // 新增why，modal的div标签
    <div id="why"></div>
    <div id="modal"></div>
  </body>
    
    
App.jsx
import React, { PureComponent } from 'react'
import { createPortal } from "react-dom"
import Modal from './Modal'

export class App extends PureComponent {
  render() {
    return (
      <div className='app'>
        // 默认挂载root的节点下面
        <h1>App H1</h1>
            
        // 挂载在#why的下面
        {
          createPortal(<h2>App H2</h2>, document.querySelector("#why"))
        }

        {/* 2.Modal组件 */}
        <Modal>
          <h2>我是标题</h2>
          <p>我是内容, 哈哈哈</p>
        </Modal>
      </div>
    )
  }
}
export default App

Modal.jsx
import React, { PureComponent } from 'react'
import { createPortal } from "react-dom"
export class Modal extends PureComponent {
  render() {
      // 挂载在#modal的下面
    return createPortal(this.props.children, document.querySelector("#modal"))
  }
}

export default Modal
```



#### fragment



在之前的开发中，我们总是在一个组件中返回内容时包裹一个div元素



如何取消掉div



- 使用Fragment （短语法： <> ，需要在Fragment中添加key，那么就不能使用短语法）
- Fragment 允许你将子列表分组，而无需向 DOM 添加额外节点



```jsx
import React, { PureComponent, Fragment } from 'react'

export class App extends PureComponent {
  constructor() {
    super() 

    this.state = {
      sections: [
        { title: "哈哈哈", content: "我是内容, 哈哈哈" },
        { title: "呵呵呵", content: "我是内容, 呵呵呵" },
        { title: "嘿嘿嘿", content: "我是内容, 嘿嘿嘿" },
        { title: "嘻嘻嘻", content: "我是内容, 嘻嘻嘻" },
      ]
    }
  }

  render() {
    const { sections } = this.state

    return (
      // 可以使用短语法
      <>
        <h2>我是App的标题</h2>
        <p>我是App的内容, 哈哈哈哈</p>
        <hr />

        {
          sections.map(item => {
            return (
            // 不可以使用短语法
              <Fragment key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.content}</p>
              </Fragment>
            )
          })
        }
      </>
    )
  }
}

export default App
```



#### StrictMode（严格模式）



1.  StrictMode 是一个用来突出显示应用程序中潜在问题的工具 

- - 与 Fragment 一样，StrictMode 不会渲染任何可见的 UI
  - 它为其后代元素触发额外的检查和警告
  - 严格模式检查仅在开发模式下运行；它们不会影响生产构建

1.  可以为应用程序的任何部分启用严格模式 

```jsx
import React, { PureComponent, StrictMode } from 'react'
// import { findDOMNode } from "react-dom"
import Home from './pages/Home'
import Profile from './pages/Profile'

export class App extends PureComponent {
  render() {
    return (
      <div>
        <StrictMode>
          <Home/>
        </StrictMode>
        <Profile/>
      </div>
    )
  }
}

export default App
```

 

1.  严格模式的作用 

- - 识别不安全的生命周期
  - 使用过时的ref API
  - 检查意外的副作用
    这个组件的constructor会被调用两次；
    这是严格模式下故意进行的操作，让你来查看在这里写的一些逻辑代码被调用多次时，是否会产生一些副作用；
    在生产环境中，是不会被调用两次的；



#### react-transition-group库



本质：通过添加类名实现过渡效果



定义：想要给一个组件的显示和消失添加某种过渡动画



​      使用`react-transitiongroup`库进行实现



分类：



1.  `Transition`
   该组件是一个和平台无关的组件（不一定要结合CSS）
   在前端开发中，我们一般是结合CSS来完成样式，所以比较常用的是CSSTransition 
2.  `CSSTransition`
   在前端开发中，通常使用CSSTransition来完成过渡动画效果 
3.  `SwitchTransition`
   两个组件显示和隐藏切换时，使用该组件 
4.  `TransitionGroup`
   将多个动画组件包裹在其中，一般用于列表中元素的动画； 



#### CSSTransition



定义： CSSTransition是基于Transition组件构建的



状态：



1. appear
2. enter
3. exit



常见对应的属性:



- 如果添加了unmountOnExit={true}，那么该组件会在执行退出动画结束后被移除掉；
- 当in为true时，触发进入状态，会添加-enter、-enter-acitve的class开始执行动画，当动画执行结束后，会移除两个class， 并且添加-enter-done的class
- 当in为false时，触发退出状态，会添加-exit、-exit-active的class开始执行动画，当动画执行结束后，会移除两个class，并 且添加-enter-done的class；
- classNames：动画class的名称
  决定了在编写css时，对应的class名称：比如card-enter、card-enter-active、card-enter-done；
- timeout：
  过渡动画的时间
  （添加删除类名的时间）
- appear：
  是否在初次进入添加动画（需要和in同时为true）
- https://reactcommunity.org/react-transition-group/transition
- CSSTransition对应的钩子函数：主要为了检测动画的执行过程，来完成一些JavaScript的操作
   onEnter：在进入动画之前被触发；
   onEntering：在应用进入动画时被触发；
   onEntered：在应用进入动画结束后被触发；



```jsx
App.jsx
import React, { createRef, PureComponent } from 'react'
import { CSSTransition } from "react-transition-group"
import "./style.css"

export class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isShow: true
    }

    this.sectionRef = createRef()
  }

  render() {
    const { isShow } = this.state

    return (
      <div>
        <button onClick={e => this.setState({isShow: !isShow})}>切换</button>
        {/* { isShow && <h2>哈哈哈</h2> } */}

        <CSSTransition 
          nodeRef={this.sectionRef}
          in={isShow} 
          unmountOnExit={true} 
          classNames="why" 
          timeout={2000}
          appear
          onEnter={e => console.log("开始进入动画")}
          onEntering={e => console.log("执行进入动画")}
          onEntered={e => console.log("执行进入结束")}
          onExit={e => console.log("开始离开动画")}
          onExiting={e => console.log("执行离开动画")}
          onExited={e => console.log("执行离开结束")}
        >
          <div className='section' ref={this.sectionRef}>
            <h2>哈哈哈</h2>
            <p>我是内容, 哈哈哈</p>
          </div>
        </CSSTransition>
      </div>
    )
  }
}

export default App


style.css
/* 进入动画 */
.why-appear {
  transform: translateX(-150px);
}

.why-appear-active {
  transform: translateX(0);
  transition: transform 2s ease;
} 

.why-appear, .why-enter {
  opacity: 0;
}

.why-appear-active, .why-enter-active {
  opacity: 1;
  transition: opacity 2s ease;
}

/* 离开动画 */
.why-exit {
  opacity: 1;
}

.why-exit-active {
  opacity: 0;
  transition: opacity 2s ease;
}
```



#### SwitchTransition



定义：`SwitchTransition`可以完成两个组件之间切换的炫酷动画



属性：



- mode
  in-out：表示新组件先进入，旧组件再移除；
  out-in：表示就组件先移除，新组建再进入；（常用）



使用方法：



- SwitchTransition组件里面要有CSSTransition或者Transition组件，不能直接包裹你想要切换的组件；
- SwitchTransition里面的CSSTransition或Transition组件不再像以前那样接受in属性来判断元素是何种状态，取而代之的是 key属性；



```jsx
App.jsx
import React, { PureComponent } from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import "./style.css"
export class App extends PureComponent {
  constructor() {
    super() 

    this.state = {
      isLogin: true
    }
  }
  render() {
    const { isLogin } = this.state

    return (
      <div>
        <SwitchTransition mode='out-in'>
          <CSSTransition
            key={isLogin ? "exit": "login"}
            classNames="login"
            timeout={1000}
          >
            <button onClick={e => this.setState({ isLogin: !isLogin })}>
              { isLogin ? "退出": "登录" }
            </button>
          </CSSTransition>
        </SwitchTransition>
      </div>
    )
  }
}
export default App



style.css
.login-enter {
  transform: translateX(100px);
  opacity: 0;
}

.login-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}

.login-exit {
  transform: translateX(0);
  opacity: 1;
}

.login-exit-active {
  transform: translateX(-100px);
  opacity: 0;
  transition: all 1s ease;
}
```



#### TransitionGroup



```jsx
App.jsx
import React, { PureComponent } from 'react'
import { TransitionGroup, CSSTransition } from "react-transition-group"
import "./style.css"

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      books: [
        { id: 111, name: "你不知道JS", price: 99 },
        { id: 222, name: "JS高级程序设计", price: 88 },
        { id: 333, name: "Vuejs高级设计", price: 77 },
      ]
    }
  }

  addNewBook() {
    const books = [...this.state.books]
    books.push({ id: new Date().getTime(), name: "React高级程序设计", price: 99 })
    this.setState({ books })
  }

  removeBook(index) {
    const books = [...this.state.books]
    books.splice(index, 1)
    this.setState({ books })
  }

  render() {
    const { books } = this.state

    return (
      <div>
        <h2>书籍列表:</h2>
        <TransitionGroup component="ul">
          {
            books.map((item, index) => {
              return (
                <CSSTransition key={item.id} classNames="book" timeout={1000}>
                  <li>
                    <span>{item.name}-{item.price}</span>
                    <button onClick={e => this.removeBook(index)}>删除</button>
                  </li>
                </CSSTransition>
              )
            })
          }
        </TransitionGroup>
        <button onClick={e => this.addNewBook()}>添加新书籍</button>
      </div>
    )
  }
}

export default App

style.css
.book-enter {
  transform: translateX(150px);
  opacity: 0;
}

.book-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 1s ease;
}

.book-exit {
  transform: translateX(0);
  opacity: 1;
}

.book-exit-active {
  transform: translateX(150px);
  opacity: 0;
  transition: all 1s ease;
}
```



#### React中编写less



1.  需要修改webpack的配置 

- -  方案一：num run eject （弹出webpack配置，不推荐） 
  -  方案二： 安装插件（create-react-app ） 新建craco.config.js 文件书写配置   （推荐） 

```jsx
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
```

 



#### React中编写CSS



1.  内联样式 

- -  优点： 

```jsx
 1.内联样式, 样式之间不会有冲突
 2.可以动态获取当前state中的状态
```

 

- -  缺点： 

```jsx
 1.写法上都需要使用驼峰标识
 2.某些样式没有提示
 3.大量的样式, 代码混乱
 4.某些样式无法编写(比如伪类/伪元素)
```

 

```jsx
import React, { PureComponent } from 'react'
export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      titleSize: 30
    }
  }

  addTitleSize() {
    this.setState({ titleSize: this.state.titleSize + 2 })
  }

  render() {
    const { titleSize } = this.state

    return (
      <div>
        <button onClick={e => this.addTitleSize()}>增加titleSize</button>
        <h2 style={{color: "red", fontSize: `${titleSize}px`}}>我是标题</h2>
        <p style={{color: "blue", fontSize: "20px"}}>我是内容, 哈哈哈</p>
      </div>
    )
  }
}

export default App
```

1.  普通的css
   缺点：最大的问题是样式之间会相互层叠掉 
2.  css modules实现了局部
   用法： 

```jsx
1.  css modules并不是React特有的解决方案，而是所有使用了类似于webpack配置的环境下都可以使用的。
如果在其他项目中使用它，那么我们需要自己来进行配置，比如配置webpack.config.js中的modules: true等。
2. React的脚手架已经内置了css modules的配置：
  .css/.less/.scss 等样式文件都需要修改成 .module.css/.module.less/.module.scss 等；
   之后就可以引用并且进行使用了；
```


缺点： 

- - 引用的类名，不能使用连接符(.home-title)，在JavaScript中是不识别的；
  - 所有的className都必须使用{style.className} 的形式来编写；
  - 不方便动态来修改某些样式，依然需要使用内联样式的方式；

```jsx
App.jsx
import React, { PureComponent } from 'react'
import Home from './home/Home'
import Profile from './profile/Profile'
import appStyle from "./App.module.css"
export class App extends PureComponent {
  render() {
    return (
      <div>
        <h2 className={appStyle.title}>我是标题</h2>
        <p className={appStyle.content}>我是内容, 哈哈哈哈</p>

        <Home/>
        <Profile/>
      </div>
    )
  }
}
export default App

App.module.css
.title {
  font-size: 32px;
  color: green;
}

.content {
  font-size: 22px;
  color: orange;
}

// 不允许使用短横线连接符
.hy-title {
  
}
```

1.  CSS in JS  (推荐)
   定义：“CSS-in-JS” 是指一种模式，其中  **CSS 由 JavaScript 生成**而不是在外部文件中定义；
   流行的库： 

- -  styled-components(是社区最流行的CSS-in-JS库) 

- - - 本质：**通过函数的调用，最终创建出一个组件** 

- - - - 这个组件会被自动添加上一个不重复的class
      - styled-components会给该class添加相关的样式

- - - 作用： 

- - - - 支持类似于CSS预处理器一样的样式嵌套
      - 直接子代选择器或后代选择器，并且直接编写 样式
      - 可以通过&符号获取当前元素
      - 直接伪类选择器、伪元素等

```jsx
组件home.jsx 旁边就会跟着style.js 样式文件

// 可以在variables.js定义一些公共CSS变量
variables.js
export const primaryColor = "#ff8822"
export const secondColor = "#ff7788"
export const smallSize = "12px"
export const middleSize = "14px"
export const largeSize = "18px"

style.js
import styled from "styled-components"
import {
  primaryColor,
  largeSize
} from "./style/variables"

// 1.基本使用
export const AppWrapper = styled.div`
  .footer {
    border: 1px solid orange;
  }
`

// const obj = {
//   name: (props) => props.name || "why"
// }


// 2.子元素单独抽取到一个样式组件
// 3.可以接受外部传入的props
// 4.可以通过attrs给标签模板字符串中提供的属性
// 5.从一个单独的文件中引入变量
export const SectionWrapper = styled.div.attrs(props => ({
  // 不传入props还可以给默认值
  tColor: props.color || "blue"
}))`
  border: 1px solid red;

  .title {
    font-size: ${props => props.size}px;
    color: ${props => props.tColor};

    &:hover {
      background-color: purple;
    }
  }

  .content {
    font-size: ${largeSize}px;
    color: ${primaryColor};
  }
`

App,jsx
import React, { PureComponent } from 'react'
import Home from './home'
import { AppWrapper, SectionWrapper } from "./style"
export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      size: 30,
      color: "yellow"
    }
  }
  render() {
    const { size } = this.state
    return (
      <AppWrapper>
        // 可以传入props变量
        <SectionWrapper size={size}>
          <h2 className='title'>我是标题</h2>
          <p className='content'>我是内容, 哈哈哈</p>
          <button onClick={e => this.setState({color: "skyblue"})}>修改颜色</button>
        </SectionWrapper>

        <Home/>

        <div className='footer'>
          <p>免责声明</p>
          <p>版权声明</p>
        </div>
      </AppWrapper>
    )
  }
}

export default App
```

- - -  styled高级特性 

1. 1. 1. 1.  支持样式的继承 （不常用） 

```jsx
const HYButton = styled.button`
   padding: 8px 30px;
   border-radius: 5px;
`
const HYWarnButton = styled(HYButton)`
   backgroud-color: red;
   color: #fff;
`
```

 

1. 1. 1. 1.  设置主题 

```jsx
import { ThemeProvider } from 'style-components'

<ThemeProvider theme={{color: "red", fontSize：“30px”}}>
    <Home />
    <Profie />
</ThemeProvider>
    

const ProfileWrapper = style.div`
   color： ${props => props.theme}
   font-size： ${props => props.fontSize}
`
```

 

- -  emotion 
  -  glamorous 

```jsx
扩展知识：ES6标签模板字符串

使用模板字符串调用函数
function foo(..args){
  console.log(args)
}
foo("Hello World")
foo`Hello World`

const name = “Kobe”
foo`Hello ${name}`   //  [["Hello ",""],"Kobe"]
                     //  第一个元素是数组，是被模块字符串拆分的字符串组合；
                     //  后面的元素是一个个模块字符串传入的内容；
```



#### React中添加class



使用第三方库：classnames



```jsx
import React, { PureComponent } from 'react'
import classNames from 'classnames'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      isbbb: true,
      isccc: true
    }
  }

  render() {
    const { isbbb, isccc } = this.state

    const classList = ["aaa"]
    if (isbbb) classList.push("bbb")
    if (isccc) classList.push("ccc")
    const classname = classList.join(" ")

    return (
      <div>
        // 常规的添加类的写法
        <h2 className={`aaa ${isbbb ? 'bbb': ''} ${isccc ? 'ccc': ''}`}>哈哈哈</h2>
        <h2 className={classname}>呵呵呵</h2>
            
       // 使用classNames库的写法，类似vue的写法
        <h2 className={classNames("aaa", { bbb:isbbb, ccc:isccc })}>嘿嘿嘿</h2>
        <h2 className={classNames(["aaa", { bbb: isbbb, ccc: isccc }])}>嘻嘻嘻</h2>
      </div>
    )
  }
}

export default App
```



#### JavaScript纯函数



定义：



1.  确定的输入，一定会产生确定的输出 
2.  函数在执行过程中，不能产生副作用； 

```jsx
副作用：表示在执行一个函数时，除了返回函数值之外，还对调用函数产生了附加的影响，
       比如修改了全局变量，修改参数或者改变外部的存储
```

 



slice(纯函数)：slice截取数组时不会对原数组进行任何操作,而是生成一个新的数组；



splice(非纯函数)：splice截取数组, 会返回一个新的数组, 也会对原数组进行修改；



优点：



- 可以安心的编写和安心的使用
- 在写的时候保证了函数的纯度，只是单纯实现自己的业务逻辑即可，不需要关心传入的内容是如何获得的或者依赖其他的 外部变量是否已经发生了修改
- 用的时候，你确定你的输入内容不会被任意篡改，并且自己确定的输入，一定会有确定的输出



#### React中纯函数的应用



1. React中就要求我们无论是函数还是class声明一个组件，这个组件都必须像纯函数一样，保护它们的props不被修改：
2. 习redux中，reducer也被要求是一个纯函数



#### redux



定义：状态管理库



核心理念：



1.  Store 

```jsx
// 初始化的数据
const initialState = {
  name: "why",
  counter: 100
}
```

 

1.  action
   所有数据的变化，必须通过派发（dispatch）action来更新； 

```jsx
const store = require("./store")

console.log(store.getState())


// 修改store中的数据: 必须action
const nameAction = { type: "change_name", name: "kobe" }
store.dispatch(nameAction)

console.log(store.getState())

const nameAction2 = { type: "change_name", name: "lilei" }
store.dispatch(nameAction2)
console.log(store.getState())

// 修改counter
const counterAction = { type: "add_number", num: 10 }
store.dispatch(counterAction)
console.log(store.getState())
```

 

1.  reducer
   将state和action联系在一起 

- - reducer是一个纯函数；
  - reducer做的事情就是将传入的state和action结合起来生成 一个新的state；

```jsx
const { createStore } = require("redux")

// 初始化的数据
const initialState = {
  name: "why",
  counter: 100
}


// 定义reducer函数: 纯函数
// 两个参数: 
// 参数一: store中目前保存的state
// 参数二: 本次需要更新的action(dispatch传入的action)
// 返回值: 它的返回值会作为store之后存储的state
function reducer(state = initialState, action) {
  // 有新数据进行更新的时候, 那么返回一个新的state
  if (action.type === "change_name") {
    return { ...state, name: action.name }
  } else if (action.type === "add_number") {
    return { ...state, counter: state.counter + action.num }
  }
  // 没有新数据更新, 那么返回之前的state
  return state
}

// 创建的store
const store = createStore(reducer)
module.exports = store
```

Redux的三大原则: 

1. 1.  单一数据源 

```jsx
 整个应用程序的state被存储在一颗object tree中，并且这个object tree只存储在一个 store 中：
 Redux并没有强制让我们不能创建多个Store，但是那样做并不利于数据的维护；
 单一的数据源可以让整个应用程序的state变得方便维护、追踪、修改；
```

 

1. 1.  State是只读的 

```jsx
 唯一修改State的方法一定是触发action，不要试图在其他地方通过任何的方式来修改State：
 这样就确保了View或网络请求都不能直接修改state，它们只能通过action来描述自己想要如何修改state；
 这样可以保证所有的修改都被集中化处理，并且按照严格的顺序来执行，所以不需要担心race condition（竟态）的问题；同时改变，无法确认最终的状态
```

 

1. 1.  使用纯函数来执行修改 

```jsx
 通过reducer将 旧state和 actions联系在一起，并且返回一个新的State：
 随着应用程序的复杂度增加，我们可以将reducer拆分成多个小的reducers，分别操作不同state tree的一部分；
 但是所有的reducer都应该是纯函数，不能产生任何的副作用；
```

 



#### redux的使用过程



```jsx
◼ 1.创建一个对象，作为我们要保存的状态：
◼ 2.创建Store来存储这个state
 创建store时必须创建reducer；
 我们可以通过 store.getState 来获取当前的state；
◼ 3.通过action来修改state
 通过dispatch来派发action；
 通常action中都会有type属性，也可以携带其他的数据；
◼ 4.修改reducer中的处理代码
 这里一定要记住，reducer是一个纯函数，不需要直接修改state；
 后面我会讲到直接修改state带来的问题；
◼ 5.可以在派发action之前，监听store的变化：



const { createStore } = require("redux")

// 初始化的数据
const initialState = {
  name: "why",
  counter: 100
}


// 定义reducer函数: 纯函数
// 两个参数: 
// 参数一: store中目前保存的state
// 参数二: 本次需要更新的action(dispatch传入的action)
// 返回值: 它的返回值会作为store之后存储的state
function reducer(state = initialState, action) {
  // 有新数据进行更新的时候, 那么返回一个新的state
  if (action.type === "change_name") {
    // 这里一定要记住，reducer是一个纯函数，不需要直接修改state；
    return { ...state, name: action.name }
  } else if (action.type === "add_number") {
    return { ...state, counter: state.counter + action.num }
  }

  // 没有新数据更新, 那么返回之前的state
  return state
}


// 创建的store
const store = createStore(reducer)


module.exports = store



const store = require("./store")
console.log(store.getState())
// 修改store中的数据: 必须action
const nameAction = { type: "change_name", name: "kobe" }
store.dispatch(nameAction)
```



#### Redux结构划分



```jsx
◼ 如果我们将所有的逻辑代码写到一起，那么当redux变得复杂时代码就难以维护。
 接下来，我会对代码进行拆分，将store、reducer、action、constants拆分成一个个文件。
 创建store/index.js文件：
 创建store/reducer.js文件：
 创建store/actionCreators.js文件：
 创建store/constants.js文件：
```



```jsx
actionCreators.js
将派发的action生成过程放到一个actionCreators函数中
将定义的所有actionCreators的函数, 放到一个独立的文件中: actionCreators.js
使用的时候：
const { addNumberAction, changeNameAction } = require("./store/actionCreators")
store.dispatch(changeNameAction("james"))


actionCreators.js
const { ADD_NUMBER, CHANGE_NAME } = require("./constants")
const changeNameAction = (name) => ({
  type: CHANGE_NAME,
  name
})
const addNumberAction = (num) => ({
  type: ADD_NUMBER,
  num
})

module.exports = {
  changeNameAction,
  addNumberAction
}


constants.js
actionCreators和reducer函数中使用字符串常量是一致的, 所以将常量抽取到一个独立constants的文件中

const ADD_NUMBER = "add_number"
const CHANGE_NAME = "change_name"
module.exports = {
  ADD_NUMBER,
  CHANGE_NAME
}

reducer.js
将reducer和默认值(initialState)放到一个独立的reducer.js文件中

const { ADD_NUMBER, CHANGE_NAME } = require("./constants")

// 初始化的数据
const initialState = {
  name: "why",
  counter: 100
}
function reducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.name }
    case ADD_NUMBER:
      return { ...state, counter: state.counter + action.num }
    default:
      return state
  }
}
module.exports = reducer



index.js
const { createStore } = require("redux")
const reducer =  require("./reducer.js")
// 创建的store
const store = createStore(reducer)
module.exports = store
```

#### Redux的工作流程图

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1696041106441-bd344613-e25e-4c2f-b6af-4aee6fe832c9.png)

```jsx
1. 核心：State Action Reducer        Reducer将State和Action结合起来

详细理解：
1. Store作为props传递到组件   （也可以被Subscription订阅，监听变化state的变化）
2. Action通过Dispathes被触发
3. Reducer接收到action，Reducer去更新state
```

**官方图**

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1696051260977-f4672230-e2f7-4b89-a2da-7a720db369bd.png)

#### Redux融入react代码

1. Redux的四个文件
   store/index.js，store/reducer.js，store/actionCreators.js，store/constants.js

2. 需要使用store的jsx文件

   

```jsx
profile.jsx

import React, { PureComponent } from 'react'
// 1. 引入store
import store from "../store"
import { subNumberAction } from '../store/actionCreators'

export class Profile extends PureComponent {
  constructor() {
    super()

    this.state = {
      // 2. 通过store.getState().counter获得store中的值，并定义为state
      counter: store.getState().counter
    }
  }

  componentDidMount() {
    // 3.componentDidMount生命周期 
    //   通过subscribe监听store的变化，并重新设置值
    store.subscribe(() => {
      const state = store.getState()
      this.setState({ counter: state.counter })
    })
  }

  subNumber(num) {
    // 4. 通过store的dispatch触发Action，修改store中state的值
    store.dispatch(subNumberAction(num))
  }

  render() {
    const { counter } = this.state

    return (
      <div>
        <h2>Profile Counter: {counter}</h2>
        <div>
          <button onClick={e => this.subNumber(1)}>-1</button>
          <button onClick={e => this.subNumber(5)}>-5</button>
          <button onClick={e => this.subNumber(8)}>-8</button>
          <button onClick={e => this.subNumber(20)}>-20</button>
          <button onClick={e => this.subNumber(100)}>-100</button>
        </div>
      </div>
    )
  }
}

export default Profile
```

 

#### Redux的逐步优化进阶

1. 每个使用jsx的文件都有类似的操作
    可以采用高阶组件进行组件拦截，统一添加
   使用**react-redux库**

```jsx
  constructor() {
    super()
    // 重复操作
    this.state = {
      counter: store.getState().counter
    }
  }

// 重复操作
  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState()
      this.setState({ counter: state.counter })
    })
  }

  subNumber(num) {
    store.dispatch(subNumberAction(num))
  }
index.js文件

采用context(上下文)将给App组件，其他的组件通过props接收store
import { Provider } from "react-redux"
import store from "./store"

<Provider store={store}>
    <App />
</Provider>

about.jsx文件
需要使用store

connect()是一个高阶组件，将About组件传进去进行拦截
  obj是mapStateToProps以props的形式进行传递
<About {...this.props,{...obj}}>
connect传入的第一个参数，表明需要用那些store（性能优化，不然这么多store，一变化重新得渲染组件）

import { connect } from "react-redux"

const mapStateToProps = (state) => (
  // 这个对象通过高阶组件拦截，映射到props里面，直接使用
  {
  counter: state.counter,
  banners: state.banners,
  recommends: state.recommends
  }
)

const mapDispatchToProps = (dispatch) => (
  // 这个对象通过高阶组件拦截，映射到props里面，直接调用里面的函数
  {
  addNumber(num) {
    dispatch(addNumberAction(num))
  },
  subNumber(num) {
    dispatch(subNumberAction(num))
  }
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(About)
```

#### Redux的异步操作

![img](https://cdn.nlark.com/yuque/0/2023/png/35586778/1696054950016-0257775b-1dd8-4c25-9599-6e8bcd7e2eaf.png)

1. 假设在Action里面进行处理

   

```jsx
actionCreators.js
在then里面return存在问题，因为不是fetchHomeMultidataAction函数里面的return

export const fetchHomeMultidataAction = () => {

    axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
      const banners = res.data.data.banner.list
      const recommends = res.data.data.recommend.list
      return ？
    })
  }
  return ？
}

这个方法，导致最后还是要在jsx组件里面处理，并没有达到redux里面处理
const mapDispatchToProps = (dispatch) => ({
  addNumber(num) {
    dispatch(addNumberAction(num))
  },
  subNumber(num) {
    dispatch(subNumberAction(num))
  }
})
```

1. 正常情况下 store.dispatch(object)，
   想要派发函数 store.dispatch(function)使用redux-thunk的插件

   

```jsx
import { createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"
// 第二个参数应用中间件
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
actionCreators.js
export const fetchHomeMultidataAction = () => {
  // 会自动传入两个参数: dispatch, getState
  return function(dispatch, getState) {
    // 异步操作: 网络请求
    axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
      const banners = res.data.data.banner.list
      const recommends = res.data.data.recommend.list

      两种写法，封装和不封装的区别
      // dispatch({ type: actionTypes.CHANGE_BANNERS, banners })
      // dispatch({ type: actionTypes.CHANGE_RECOMMENDS, recommends })
      dispatch(changeBannersAction(banners))
      dispatch(changeRecommendsAction(recommends))
    })
  }
}
```

#### 打开Redux-develop-tool工具

```jsx
import { createStore, applyMiddleware, compose } from "redux"
// 存在即打开   {trace: true}是开起redux中的Trace（追踪源码的）
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
```

#### Redux模块化

将多个reducer进行合并操作
那么combineReducers是如何实现的呢？ 

 1. 事实上，它也是将我们传入的reducers合并到一个对象中，最终返回一个combination的函数（相当于我们之前的reducer函数了）； 

 2. 在执行combination函数的过程中，它会通过判断前后返回的数据是否相同来决定返回之前的state还是新的state； 

 3. 新的state会触发订阅者发生对应的刷新，而旧的state可以有效的组织订阅者发生刷新；

```jsx
store/index.js
import { createStore, applyMiddleware, compose, combineReducers } from "redux"
import thunk from "redux-thunk"
import counterReducer from "./counter"
import homeReducer from "./home"
import userReducer from "./user"

// 将两个reducer合并在一起
const reducer = combineReducers({
  counter: counterReducer,
  home: homeReducer,
  user: userReducer
})

// combineReducers实现原理(了解)
// 每次都会执行reducer然后返回新的reducer，官方优化了看是否发生变化了，才产生新对象
// function reducer(state = {}, action) {
//   // 返回一个对象, store的state
//   return {
//     counter: counterReducer(state.counter, action),
//     home: homeReducer(state.home, action),
//     user: userReducer(state.user, action)
//   }
// }

// redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
```

#### **Redux Toolkit（官网推荐书写Redux的方法）**

传统的缺点
\1. 并且代码通常分拆在多个文件中（虽然也可以放到一个文件管理，但是代码量过多，不利于管理）；

ReduxTooIkit的优点

1. configureStore：包装createStore以提供简化的配置选项和良好的默认值。它可以自动组合你的 slice reducer，添加你提供 的任何 Redux 中间件，redux-thunk默认包含，并启用 Redux DevTools Extension。

   

```jsx
store/index.js
引入configureStore
import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./features/counter"
import homeReducer from "./features/home"

const store = configureStore({
  reducer: {
    counter: counterReducer,
    home: homeReducer
  }
})

export default store
```

1. createSlice：接受reducer函数的对象、切片名称和初始状态值，并自动生成切片reducer，并带有相应的actions。

   

```jsx
◼ createSlice主要包含如下几个参数：
◼ name：用户标记slice的名词
 在之后的redux-devtool中会显示对应的名词；
◼ initialState：初始化值
 第一次初始化时的值；
◼ reducers：相当于之前的reducer函数
 对象类型，并且可以添加很多的函数；
 函数类似于redux原来reducer中的一个case语句；
 函数的参数：
✓ 参数一：state
✓ 参数二：调用这个action时，传递的action参数；
◼ createSlice返回值是一个对象，包含所有的actions；
import { createSlice } from "@reduxjs/toolkit"
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    counter: 888
  },
  reducers: {
    addNumber(state, { payload }) {
      // 直接赋值等于，不需要浅拷贝，内部做了判断
      state.counter = state.counter + payload
    },
    subNumber(state, { payload }) {
      state.counter = state.counter - payload
    }
  }
})
// 导出action和reducer
export const { addNumber, subNumber } = counterSlice.actions
export default counterSlice.reducer
```

1. createAsyncThunk: 接受一个动作类型字符串和一个返回承诺的函数，并生成一pending/fulfilled/rejected基于该承诺分 派动作类型的 thunk

   

```jsx
第一种写法：
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchHomeMultidataAction = createAsyncThunk(
  "fetch/homemultidata", 
  async (extraInfo, { dispatch, getState }) => {
    // console.log(extraInfo, dispatch, getState)
    // 1.发送网络请求, 获取数据
    const res = await axios.get("http://123.207.32.32:8000/home/multidata")

    // 2.返回结果, 那么action状态会变成fulfilled状态
    return res.data
})

const homeSlice = createSlice({
  name: "home",
  initialState: {
    banners: [],
    recommends: []
  },
  reducers: {
    changeBanners(state, { payload }) {
      state.banners = payload
    },
    changeRecommends(state, { payload }) {
      state.recommends = payload
    }
  },
  // extraReducers的第一种写法
  extraReducers: {
    [fetchHomeMultidataAction.pending](state, action) {
      console.log("fetchHomeMultidataAction pending")
    },
    [fetchHomeMultidataAction.fulfilled](state, { payload }) {
      state.banners = payload.data.banner.list
      state.recommends = payload.data.recommend.list
    },
    [fetchHomeMultidataAction.rejected](state, action) {
      console.log("fetchHomeMultidataAction rejected")
    }
  }
  // extraReducers的第二种写法
  extraReducers: (builder) => {
    // builder.addCase(fetchHomeMultidataAction.pending, (state, action) => {
    //   console.log("fetchHomeMultidataAction pending")
    // }).addCase(fetchHomeMultidataAction.fulfilled, (state, { payload }) => {
    //   state.banners = payload.data.banner.list
    //   state.recommends = payload.data.recommend.list
    // })
  }
})

export const { changeBanners, changeRecommends } = homeSlice.actions
export default homeSlice.reducer
第二种写法
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchHomeMultidataAction = createAsyncThunk(
  "fetch/homemultidata", 
  async (extraInfo, { dispatch, getState }) => {
    // console.log(extraInfo, dispatch, getState)
    // 1.发送网络请求, 获取数据
    const res = await axios.get("http://123.207.32.32:8000/home/multidata")

    // 2.取出数据, 并且在此处直接dispatch操作(可以不做)
    const banners = res.data.data.banner.list
    const recommends = res.data.data.recommend.list
    dispatch(changeBanners(banners))
    dispatch(changeRecommends(recommends))

    // 3.返回结果, 那么action状态会变成fulfilled状态
    return res.data
})

const homeSlice = createSlice({
  name: "home",
  initialState: {
    banners: [],
    recommends: []
  },
  reducers: {
    changeBanners(state, { payload }) {
      state.banners = payload
    },
    changeRecommends(state, { payload }) {
      state.recommends = payload
    }
  },
  // extraReducers: {
  //   [fetchHomeMultidataAction.pending](state, action) {
  //     console.log("fetchHomeMultidataAction pending")
  //   },
  //   [fetchHomeMultidataAction.fulfilled](state, { payload }) {
  //     state.banners = payload.data.banner.list
  //     state.recommends = payload.data.recommend.list
  //   },
  //   [fetchHomeMultidataAction.rejected](state, action) {
  //     console.log("fetchHomeMultidataAction rejected")
  //   }
  // }
  extraReducers: (builder) => {
    // builder.addCase(fetchHomeMultidataAction.pending, (state, action) => {
    //   console.log("fetchHomeMultidataAction pending")
    // }).addCase(fetchHomeMultidataAction.fulfilled, (state, { payload }) => {
    //   state.banners = payload.data.banner.list
    //   state.recommends = payload.data.recommend.list
    // })
  }
})

export const { changeBanners, changeRecommends } = homeSlice.actions
export default homeSlice.reducer
```

1. 使用

   

```jsx
import React, { PureComponent } from 'react'
import { connect } from "react-redux"
import { addNumber } from '../store/features/counter'
import { fetchHomeMultidataAction } from '../store/features/home'


export class Home extends PureComponent {
  componentDidMount() {
    this.props.fetchHomeMultidata()

  addNumber(num) {
    this.props.addNumber(num)
  }

  render() {
    const { counter } = this.props

    return (
      <div>
        <h2>Home Counter: {counter}</h2>
        <button onClick={e => this.addNumber(5)}>+5</button>
        <button onClick={e => this.addNumber(8)}>+8</button>
        <button onClick={e => this.addNumber(18)}>+18</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter.counter
})

const mapDispatchToProps = (dispatch) => ({
  addNumber(num) {
    dispatch(addNumber(num))
  },
  fetchHomeMultidata() {
    // 发送异步请求
    dispatch(fetchHomeMultidataAction({name: "why", age: 18}))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
```

#### **Redux Toolkit的数据不可变性（了解）**

类组件中的state，还是redux中管理的state    ==>   数据的不可变性
经常用的浅拷贝的解决问题
  \1. 过大的对象，进行浅拷贝也会造成性能的浪费

1. 浅拷贝后的对象，在深层改变时，依然会对之前的对象产生影响

```jsx
◼ 事实上Redux Toolkit底层使用了immerjs的一个库来保证数据的不可变性。
◼ 在我们公众号的一片文章中也有专门讲解immutable-js库的底层原理和使用方法：
 https://mp.weixin.qq.com/s/hfeCDCcodBCGS5GpedxCGg
◼ 为了节约内存，又出现了一个新的算法：Persistent Data Structure（持久化数据结构或一致性
数据结构）；
 用一种数据结构来保存数据；
 当数据被修改时，会返回一个对象，但是新的对象会尽可能的利用之前的数据结构而不会
对内存造成浪费；
```

#### 自定义connect函数  

```jsx
// connect的参数:
// 参数一: 函数
// 参数二: 函数
// 返回值: 函数 => 高阶组件

import { PureComponent } from "react";
import store from "../store"

export function connect(mapStateToProps, mapDispatchToProps, store) {
  // 高阶组件: 函数
  return function(WrapperComponent) {
    class NewComponent extends PureComponent {
      constructor(props) {
        super(props)
        // 高阶组件将state通过props形式传入
        this.state = mapStateToProps(store.getState())
      }

      componentDidMount() {
        // 监听state的变化，变化就从新设置值
        this.unsubscribe = this.context.subscribe(() => {
          // this.forceUpdate()
          this.setState(mapStateToProps(store.getState()))
        })
      }

      componentWillUnmount() {
        // 组件卸载的时候取消监听
        this.unsubscribe()
      }

      render() {
        const stateObj = mapStateToProps(this.context.getState())
        // 将对象方法，传入props中
        const dispatchObj = mapDispatchToProps(this.context.dispatch)
        return <WrapperComponent {...this.props} {...stateObj} {...dispatchObj}/>
      }
    }
    return NewComponent
  }
}


使用connect：
const mapStateToProps = (state) => ({
  counter: state.counter.counter,
  banners: state.home.banners,
  recommends: state.home.recommends
})

const mapDispatchToProps = (dispatch) => ({
  subNumber(num) {
    dispatch(subNumber(num))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
```

context处理store
上面的connect函数有一个很大的缺陷：依赖导入的store
我们提供一个Provider，Provider来自于我们创建的Context，让用户将store传入到value中即可；



```jsx
StoreContext.js 定义context
import { createContext } from "react";
export const StoreContext = createContext()

index.js 使用context
import React from 'react';
import ReactDOM from 'react-dom/client';
// import { Provider } from "react-redux"
import { StoreContext } from "./hoc"
import App from './App';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    {/*<Provider store={store}>*/}
      <StoreContext.Provider value={store}>
        <App />
      </StoreContext.Provider>
    {/* </Provider> */}
);
connect.js

import { PureComponent } from "react";
import { StoreContext } from "./StoreContext";
export function connect(mapStateToProps, mapDispatchToProps, store) {
  // 高阶组件: 函数
  return function(WrapperComponent) {
    class NewComponent extends PureComponent {
      constructor(props, context) {
        super(props)
        
        this.state = mapStateToProps(context.getState())
      }

      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() => {
          // this.forceUpdate()
          this.setState(mapStateToProps(this.context.getState()))
        })
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      render() {
        const stateObj = mapStateToProps(this.context.getState())
        const dispatchObj = mapDispatchToProps(this.context.dispatch)
        return <WrapperComponent {...this.props} {...stateObj} {...dispatchObj}/>
      }
    }
    NewComponent.contextType = StoreContext
    return NewComponent
  }
}


jsx使用connect：
const mapStateToProps = (state) => ({
  counter: state.counter.counter,
  banners: state.home.banners,
  recommends: state.home.recommends
})

const mapDispatchToProps = (dispatch) => ({
  subNumber(num) {
    dispatch(subNumber(num))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
```



#### 修改dispath（**Monkey Patching技术**）

在dispatch之前，打印一下本次的action对象，dispatch完成之后可以打印一下最新的store state；
解决方案：
  \1.  首先，每一次的dispatch操作，我们都需要在前面加上这样的逻辑代码；
     ，存在大量重复的代码，会非常麻烦和臃肿

1. 以将代码封装到一个独立的函数中
   调用者（使用者）在使用我的dispatch时，必须使用我另外封装的一个函数dispatchAndLog
   对于调用者来说，很难记住这样的API，更加习惯的方式是直接调用dispatch；

```jsx
function log(store) {
  const next = store.dispatch

  function logAndDispatch(action) {
    console.log("当前派发的action:", action)
    // 真正派发的代码: 使用之前的dispatch进行派发
    next(action)
    console.log("派发之后的结果:", store.getState())
  }

  // monkey patch: 猴补丁 => 篡改现有的代码, 对整体的执行逻辑进行修改
  store.dispatch = logAndDispatch
}

export default log
```

#### redux-thunk(实现传入函数，发请求)

```jsx
function thunk(store) {
  const next = store.dispatch
  function dispatchThunk(action) {
    if (typeof action === "function") {
      // 传进来是函数的时候，执行，并且传入参数
      action(store.dispatch, store.getState)
    } else {
      next(action)
    }
  }
  store.dispatch = dispatchThunk
}

export default thunk
```