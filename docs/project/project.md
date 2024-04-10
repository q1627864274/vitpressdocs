---
outline: deep
---
## 内存泄漏

1. 闭包
2. 定时器，解绑事件
3. vue3中用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏
```javascript
/script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
//script>

// 停止侦听器
const unwatch = watchEffect(() => {})
// ...当该侦听器不再需要时
unwatch()

// 如果是等待条件创建，可以使用同步，加上判定条件
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```
## 框架bug修复
#### element-ui 2.0
##### el-dialog和el-drawer的组件

1. el-dialog和el-drawer的组件，发现在框内按住鼠标选中文字，然后移出弹窗，松开鼠标，发现弹窗关闭

问题初步分析：在内部点击，事件冒泡到了外部遮罩层，触发了关闭事件？
结论：分析错误
在外层事件委托绑定点击事件，发现框内按住鼠标选中文字，然后移出弹窗，在外层松开鼠标，触发的元素不是内层元素，而还是外层
click和mousedown事件的区别：
click：在完整的单击操作完成后触发；也就是说，click 事件在按下并释放鼠标按钮后并且指针仍在同一元素内时触发
mousedown： 事件在按下鼠标按钮的那一刻触发。
所以我们可以用mousedown去得到触发元素，然后通过flag变量去更改

```javascript
1. 通过插件的形式，覆盖原来的组件，使得使用的时候不受影响

main.js中
import PATCH_ElOverlayAutoClose from '@/components/el-overlay-auto-close.js';
Vue.use(PATCH_ElOverlayAutoClose);

el-overlay-auto-close.js文件中
import {Dialog, Drawer} from 'element-ui'
const DiaglogPathed = {
    // 继承组件
    extends: Dialog,
    data() {
        return {
            // 判定触发的元素是否是外部，是外部就关闭，是内部就不关闭
            wrapperMouseDowned: false
        }}
    ,
    mounted() {
       // this.$el是指当前组件实例的根元素
       this.$el.onmousedown = (e) => {
            this.wrapperMouseDowned = e.target.classList.contains('el-dialog__wrapper')
       }

    },
    methods: {
        handleWrapperClick() {
            if (!this.closeOnClickModal || !this.wrapperMouseDowned)      return;
            this.handleClose();
          },
    }
}
const DrawerPathed = {
    extends: Drawer,
    data() {
        return {
            wrapperMouseDowned: false
        }}
    ,
    mounted() {
         this.$el.onmousedown = (e) => {
            this.wrapperMouseDowned = e.target.classList.contains('el-drawer__container')
         }
    },
    methods: {
        handleWrapperClick() {
            if (this.wrapperClosable && this.wrapperMouseDowned) {
              this.closeDrawer();
            }
        },
    }
}
export default {
    install(Vue) {
        Vue.component('el-dialog', DiaglogPathed);
        Vue.component('el-drawer', DrawerPathed);
    }
}
```
##### this.$message连续提示
```javascript
1. 方案一
在点击前，调用element提供的Message.closeAll() 手动关闭所有实例。现象就是连续触发会发生抖动，作为备选方案
2. 方案二，先找dom，dom不存在再调用

再src/utils/message文件下

import {Message} from 'element-ui'

//  使用this.$message({
//                 message: '警告哦，这是一条警告消息',
//                 type: 'warning'
//  });中方法调用适用这个函数
const tipsEvent = (options) => {
    const dom = document.querySelectorAll('.el-message')[0]
    if (dom === undefined){
        Message(options)
    }

}

// this.$message.error('错了哦，这是一条错误消息'); 适用于下面这个函数
// tipsEvent是个函数即可
// const tipsEvent = () => {}
const typeList = ['success', 'warning', 'info', 'error']
typeList.forEach(item => {
  //
    tipsEvent[item] = (options) => {
        const ele = document.querySelectorAll('.el-message')[0]
        if (ele === undefined){
            Message[item](options)
        }
    }
}
)
console.dir(tipsEvent)
export const tips = tipsEvent

在main.js文件下, 注意放在element的注册之后

import {tips} from '@/utils/message.js';
Vue.prototype.$message = tips;
```
## 优化问题
#### h5如何进行首屏优化？

1. 路由懒加载
适用于SPA(单页面应用程序)
路由拆分，优先保证首页加载

```javascript
     使用路由懒加载，当这个组件被请求时才加载
        (import箭头函数返回组件)  () => import('@/views/Home.vue')  ==> 推荐这种加载方式
        (require箭头函数返回组件) reslove => require(['../views/Demo'], resolve)
        (require.ensure())      resolve => require.ensure([], () => resolve(require('./Foo.vue')))
```

2. 服务端渲染SSR（古老的技术）  成本高
纯h5页面，SSR是优化的终极方向
常见的前后端分离，先获得html，js，然后通过js的ajax获得数据，再进行渲染页面上
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683462283773-6da938ab-62b1-4688-a678-63298e0d7701.png#averageHue=%23fcfcfb&clientId=u017ccea1-b761-4&from=paste&height=210&id=u259e37ae&originHeight=420&originWidth=515&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=65699&status=done&style=none&taskId=u7b1c1369-b02b-441c-ad26-e951bb38bae&title=&width=258)
SSR只需要一步，页面已经在服务端那边渲染好了，直接获得即可
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683462374116-93f9d46b-dd06-4bd8-bf5c-8e82f073fb2c.png#averageHue=%23f6f6f6&clientId=u017ccea1-b761-4&from=paste&height=199&id=ud9b6be16&originHeight=398&originWidth=392&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=48739&status=done&style=none&taskId=u55880305-5228-4ad9-acdf-7f9314b4a22&title=&width=196)
3. App预取

App的原生能力+h5+jsbrige   统一将app中h5的体验做到最好
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683462933673-18cf69f8-3c67-438a-a0b1-b23b601cfb50.png#averageHue=%23f5f5f5&clientId=u017ccea1-b761-4&from=paste&height=209&id=ud89255de&originHeight=417&originWidth=1234&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=200334&status=done&style=none&taskId=u1a9bcc2e-a48c-43ec-bbff-5873472c739&title=&width=617)
4. 分页
5. 图片懒加载
6. Hybrid（混合）
提前将html，js，css下载到App内部
在App webview中使用file://协议加载页面文件
再用ajax获取内容并展示(结合App预取，通过ajax提前请求)

#### 后端返回十万条数据，怎么处理？

1. 主动和面试官沟通，这样的设计是十分不合理的
2. js没问题，渲染到dom上是会非常卡顿
解决方式：
1. 自定义nodejs中间层(自己再做一个后端)，获取并拆分这10w条数据，成本非常的高
   前端对接中间层，中间层再对接后端
   自己搭建服务器，写代码，测试，调试，上线监控，申请服务器，申请域名
2. 虚拟列表
   只渲染可视区域的DOM，其他隐藏区域不显示，只用div撑起高度
   随着浏览器滚动，创建和销毁dom（第三方库vue-virtual-scroll-list）
   
   虚拟列表只是无奈的选择，实现复杂效果不一定好，快速滚动的时候，频繁的创建和销毁，在一些低配置上面是否有大的影响，还需要实操测试

#### vue的优化（vue3）

1. v-if和v-show
v-if 创建和销毁组件
v-show 使用css显示和隐藏组件
对于复杂的组件，我们可以才用v-show
2. v-for使用key
key值最好不要使用index
3. computed去缓存
计算复杂的时候，例如消息列表
4. keep-alive缓存组件
频繁切换的组件，如tabs
不要乱用，缓存太多会占内存，并且不好debug
activeed deactived  会触发这两个的生命周期
5. 异步组件
针对体积比较大的组件，如编辑器，复杂表格，复杂表单等
拆包，需要时异步加载，不需要时不加载
减少主包的体积，首页会加载更快
在vue3中的写法引入组件的时候 defineAsyncComponent使用箭头函数
6. 路由懒加载
7. 服务端渲染SSR，成本高

#### 使用vue遇到过那些坑？

1. 内存泄露
全局变量，全局事件，全局定时器  
自定义事件
没有销毁，就会造成内存泄漏
2. vue2响应式的缺陷(vue3不再有)

     data无法新增，删除属性，数组无法通过索引修改值
    需要通过Vue.set	Vue.delete   数组方法push,pop,unshift

3. 路由切换时，scroll到顶部
例如列表页滚动到某个位置，点击进入详情页，在返回列表页，发现组件重新渲染了就scroll到顶部

解决方式：
SPA
在进入详情页之前，记录当前列表页的滚动位置。可以通过监听滚动事件，获取当前滚动的位置，将其存储到Vuex、localStorage或者组件实例的data中。
在返回列表页时，获取记录的滚动位置，并将其应用到列表容器的scrollTop属性中，使列表回到之前的滚动位置。

```javascript
/template>
  /div class="list-container" ref="listContainer" @scroll="handleScroll">
    /!-- 列表内容 -->
  //div>
//template>

/script>
export default {
  data() {
    return {
      scrollTop: 0 // 初始滚动位置为0
    }
  },
  methods: {
    handleScroll() {
      // 监听滚动事件，记录当前滚动位置
      this.scrollTop = this.$refs.listContainer.scrollTop
    },
    scrollToPosition() {
      // 将记录的滚动位置应用到列表容器的scrollTop属性中
      this.$refs.listContainer.scrollTop = this.scrollTop
    }
  },
  mounted() {
    // 进入详情页之前，记录当前滚动位置
    this.handleScroll()
  },
  updated() {
    // 从详情页返回列表页时，回到之前的滚动位置
    this.scrollToPosition()
  }
}
//script>
```
#### 如何统一监听Vue组件报错


1. window.onerror
全局监听所有的js错误
js级别，无法识别Vue组件信息
捕捉一些vue监听不到的错误
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683636131427-fa0ebf84-b568-40bf-9ddc-063f7e52d5a1.png#averageHue=%23312e25&clientId=u78699e00-e2ab-4&from=paste&height=100&id=u0638ecb2&originHeight=200&originWidth=1193&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=115804&status=done&style=none&taskId=u8a78c553-3b63-4fbc-bcc9-559ae8a92bc&title=&width=597)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683636258326-6d88979a-a0c2-42e7-adbd-71c688a0d897.png#averageHue=%23191919&clientId=u78699e00-e2ab-4&from=paste&height=126&id=ub1ff4c3b&originHeight=251&originWidth=1090&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=115899&status=done&style=none&taskId=u3c949dad-17a5-480a-af7c-0b559cd390b&title=&width=545)

2. errorcaptured生命周期
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683636485525-21ffe479-bc36-451b-8fd4-9e784829927d.png#averageHue=%23f8f8f8&clientId=u78699e00-e2ab-4&from=paste&height=123&id=u383f6da6&originHeight=491&originWidth=1573&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=143102&status=done&style=none&taskId=u280496ec-5c5b-4089-9ef3-3654901dd71&title=&width=393)	
3. errorHandler配置   Vue全局错误监听，所有组件的错误都会汇总到这里
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683636641038-a35d4be5-0b3b-42c8-9d31-33498f925946.png#averageHue=%23f4f4f4&clientId=u78699e00-e2ab-4&from=paste&height=140&id=u7c2ff4f5&originHeight=561&originWidth=1440&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=182017&status=done&style=none&taskId=u69f25719-6bcb-4bb4-8b7a-635ecb4359a&title=&width=360)
 ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683636696919-c774b168-6d1b-4d38-a660-af4939082bc0.png#averageHue=%231d1d1b&clientId=u78699e00-e2ab-4&from=paste&height=268&id=u79751a54&originHeight=535&originWidth=1104&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=269540&status=done&style=none&taskId=u7c030ded-5e4a-4d8e-b7d6-fa17306b3c0&title=&width=552)
4. 异步报错vue那两个监听不了，window.onerror能监听到
#### 如果一个h5很慢，如何排查性能问题？

1. 加载慢(访问慢?)
2. 操作慢(流程慢?)
Frist Paint(FP)  输入url到渲然，内容有变化
Frist  Content  Paint(FCP)  第一次有内容的渲染
DomContentLoaded(DCL)  第一次dom的加载
LargestContentfull Paint(LCP)  页面最大的内容渲染
Load(L)

3. Light
#### 项目上线，白屏，什么问题？
npm run build, 生成的 index.js 有 hash 的，index.sdfbnqoweobc.js，每次构建生成的 js 不一样
如果浏览器有白屏，说明 index.html src 引用了上一个版本的js，这是一个缓存问题
解决方案修改 http 缓存的头部，让 index.html 保持不缓存
我还可以使用 service worker，代理全部前端资源请求，手动js配置缓存，具体开发没有了解过
#### 

#### vite 环境变量
在 package.json 运行命令中，输入 --mode=x
可以在代码中，通过 import.meta.env.MODE 拿到环境变量
比如，通过环境变量，切换请求接口地址：
比如下方代码，两个运行命令：
dev 对应接口地址 http://baidu.com 
dev2 对应的接口地址 http://sina.cn
```json
{
  "name": "fuck",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --mode=http://baidu.com",
    "dev2": "vite --mode=http://sina.cn",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.2.0"
  }
}
```
我们封装的接口，如果请求  fetch(import.meta.env.MODE+'/'+path) 就可以运行不同命令，访问不同服务器
环境变量，和我们项目上线，有关系

- 配置 --mode=dev/qa/master 可以配置 开发/测试/线上 环境服务器地址
- 不同环境，对接不同的服务器 



#### **高量级任务执行优化**

2023/7/12 huawei

```js
/!DOCTYPE html>
/html lang="en">
/head>
    /meta charset="UTF-8">
    /meta http-equiv="X-UA-Compatible" content="IE=edge">
    /meta name="viewport" content="width=device-width, initial-scale=1.0">
    /title>Document//title>
//head>
/body>
    /div>你好啊//div>
    /button>点击我//button>
    /script>
       const btn = document.querySelector('button')
       const div = document.querySelector('div')
       
       function executeForThreeSeconds() {
        const startTime = new Date().getTime();
        
        while (true) {
            const currentTime = new Date().getTime();
            if (currentTime - startTime >= 3000) {
            break;
            }
        }
        console.log('等待循环执行结束')
        }
       function runTask(task){
        requestIdleCallback((idle) => {
            if (idle.timeRemaining() > 0){
                task()
            }else{
                runTask()
            }
        })
       }
       function runTask2(task){
        let start = Date.now()
        requestAnimationFrame(() => {
            let end = Date.now() 
            console.log('end - start', end - start)
            if (end - start / 16.6){
                task()
            }else{
                runTask2()
            }
        })
       }
       btn.addEventListener('click', function(){
            // 直接执行，发现会卡顿3秒之后，渲染才会改变，因为这个任务是同步的任务
            //    div.innerHTML = '我被改变了'
            //    executeForThreeSeconds()

        
           // 把执行的任务，放在微任务队列中
           // 还是会卡顿3秒才渲染，因为微任务需要全部清空，才能做其他例如渲染，渲染帧是16ms一次，但是微任务队列有3秒，必须等微任务执行完成之后才
           // 会进行渲染的操作
            // div.innerHTML = '我被改变了'
            // Promise.resolve().then(() => {
            //     executeForThreeSeconds()
            // })

            // 把执行的任务，放在宏任务里面
            // 不会阻塞，如果是连续的触发可能存在卡顿
          
            // 事件循环是一个死循环，取出宏任务的第一个任务
            //  执行任务
            //  判断是否到达渲染时机   到达即渲染
            // 为什么不会阻塞？ 每次只是执行一个宏任务，执行完成之后，就渲染
            // 为什么还会卡顿呢？ 不同的浏览器判断渲染的时机不同
            // 谷歌和Eege浏览器，认为队列还有这么多任务需要执行，分配一些时间给宏任务，所以渲染时机就会往后延
            // div.innerHTML = '我被改变了'
            // setTimeout(() =>{
            //     executeForThreeSeconds()
            // })

            // 使用requestAnimationFrame()方法
            // requestAnimationFrame: 是一个在浏览器环境下用于执行动画的方法。它接受一个回调函数作为参数，并在浏览器下一次重绘之前调用该回调函数。
            // 会被阻塞，在下一次重绘之前，会被执行该任务
            // div.innerHTML = '我被改变了'
            // requestAnimationFrame(() =>{
            //     executeForThreeSeconds()
            // })

            // 手动控制任务的执行时机 结合requestAnimationFrame()方法 最优选项
            // 就是执行渲染之前判断，运行这个任务合适吗  16.6ms一帧，还剩多少时间，判断这一帧还有没时间，时间大于0就运行任务
            // div.innerHTML = '我被改变了'
            // runTask(executeForThreeSeconds)


            // requestIdleCallback这个兼容性采用结合requestAnimationFrame，根据16.6判断是否来执行该任务, 不行有问题！
            div.innerHTML = '我被改变了'
            runTask2(executeForThreeSeconds)
       })  
    //script>
//body>
//html>

```

#### 工具函数的优化

2023/7/18  huawei

1. 调用函数（函数中避免反复创建对象）

   ```js
   // 每次调用该函数都会产生一个正则表达式对象/\s/g
   function removeSpace(str) {
      return str.replace(/\s/g, '')
   }
   // 问题点：创建正则表达式对象需要一定的时间和内存，因此频繁创建正则表达式对象可能会对性能产生一些影响，尤其是在大量调用的情况下。
   
   解决措施
   
   1. 可以将正则表达式对象的创建移出函数，改为在函数外部创建
   const regex = /\s/g;
   function removeSpace(str) {
      return str.replace(regex, '');
   }
   
   2. 使用立即执行函数+闭包
      每次通过removeSpace()调用，regex就是一个，不会反复创建
   let removeSpace = (function(){
       let regex = /\s/g;
       return function(str){
           return str.replace(regex, '');
       }
   })()
    
   ```

   
## 项目问题
#### 计时器问题

##### 交通灯问题

```js
1. 使用定时器去解决
/!DOCTYPE html>
/html>

/head>
   /title>交通灯//title>
   /style>
      .traffic-light {
         width: 50px;
         height: 150px;
         background-color: black;
         padding: 10px;
         border-radius: 10px;
         position: relative;
         transform: rotateZ(-90deg);
         margin-left: 100px
      }

      .light {
         width: 30px;
         height: 30px;
         border-radius: 50%;
         margin: 10px auto;
         transition: background-color 0.5s;
      }

      #red {
         background-color: grey;
      }

      #yellow {
         background-color: grey;
      }

      #green {
         background-color: grey;
      }

      .red div:nth-child(1) {
         background-color: red !important;
      }

      .yellow div:nth-child(2) {
         background-color: yellow !important;
      }

      .green div:nth-child(3) {
         background-color: green !important;
      }
   //style>
//head>

/body>
   /div class="traffic-light">
      /div id="red" class="light">//div>
      /div id="yellow" class="light">//div>
      /div id="green" class="light">//div>
   //div>
   /p>时间: /span class="time">0//span> 秒//p>

   /script>
      let redTime = 5; // 红灯时间
      let yellowTime = 2; // 黄灯时间
      let greenTime = 3; // 绿灯时间

      function startTimer(duration, callback) {
         let time = duration;
         document.querySelector('.time').textContent = time;
         let timer = setInterval(() => {
            time--;
            document.querySelector('.time').textContent = time;
            if (time /= 0) {
               clearInterval(timer);
               callback();
            }
         }, 1000);
      }

      function changeLight() {
         document.getElementById('red').style.backgroundColor = "red";
         startTimer(redTime, () => {
            document.getElementById('red').style.backgroundColor = "grey";
            document.getElementById('yellow').style.backgroundColor = "yellow";
            startTimer(yellowTime, () => {
               document.getElementById('yellow').style.backgroundColor = "grey";
               document.getElementById('green').style.backgroundColor = "green";
               startTimer(greenTime, () => {
                  document.getElementById('green').style.backgroundColor = "grey";
                  changeLight(); // 重新开始循环
               });
            });
         });
      }

      changeLight(); // 开始灯光切换循环
   //script>
//body>

//html>
```

```js
2. 采用问询的方法
/!DOCTYPE html>
/html>

/head>
   /title>交通灯//title>
   /style>
      .traffic-light {
         width: 50px;
         height: 150px;
         background-color: black;
         padding: 10px;
         border-radius: 10px;
         position: relative;
         transform: rotateZ(-90deg);
         margin-left: 100px
      }

      .light {
         width: 30px;
         height: 30px;
         border-radius: 50%;
         margin: 10px auto;
         transition: background-color 0.5s;
      }

      #red {
         background-color: grey;
      }

      #yellow {
         background-color: grey;
      }

      #green {
         background-color: grey;
      }

      .red div:nth-child(1) {
         background-color: red !important;
      }

      .yellow div:nth-child(2) {
         background-color: yellow !important;
      }

      .green div:nth-child(3) {
         background-color: green !important;
      }
   //style>
//head>

/body>
   /div class="traffic-light">
      /div id="red" class="light">//div>
      /div id="yellow" class="light">//div>
      /div id="green" class="light">//div>
   //div>
   /p>时间: /span class="time">0//span> 秒//p>

   /script>
      class TrafficLight {
         constructor(lights) {
            this._lights = lights
            this._currentIndex = 0 // 当前灯的下标
            this._time = Date.now()  // 切换到当前灯的时间

         }
         _update(){
            let disTime = this._disTime() // 经过了多久(秒)
            const total = this._lights.reduce((acc, cur) => acc + cur.lasts, 0)
            disTime = disTime % total // 有可能几圈，取余只算一圈的，不超过总时长的时间
            this._time += total * Math.floor(disTime / total) // 更新当前灯的时间，转了多少圈

            // 一圈之类在那个灯
            while(1) {
               disTime -= this.currentLight.lasts
               if (disTime / 0) break   // 还没有到切换灯的时候
               else {
                  this._time += this.currentLight.lasts * 1000   // 更新切换灯的时间
                  this._currentIndex = (this._currentIndex + 1) % this._lights.length
               }
            }
         }
         get currentLight () {
            return this._lights[this._currentIndex]
         }
         _disTime(){
            return (Date.now() - this._time) / 1000
         }
         getCurrentLight(){
            this._update()
            return {
               color:this.currentLight.color,
               remian:this.currentLight.lasts - this._disTime()
            }
         }
      }
      const light = new TrafficLight([
         {
            color: 'red',
            lasts: 3,
         },
         {
            color: 'yellow',
            lasts: 2,
         },
         {
            color: 'green',
            lasts: 3,
         },
      ])
      const trafficLight = document.querySelector('.traffic-light')
      const time = document.querySelector('.time')
      function update(){
         const current =  light.getCurrentLight()
         trafficLight.className = `traffic-light ${current.color}`
         time.textContent = Math.ceil(current.remian)
      }
      function raf() {
         requestAnimationFrame(() => {
            raf()
            update()
         })
      }
      raf()
   //script>
//body>

//html>
```



#### 登录相关问题

##### JWT(jsonWebToken)

```js
前端  ----------  后端（信息+秘钥 = 签名）
      (信息+签名)

JWT对（信息+签名）有标准化的格式

JWT分为3部分：
1.header 2.payload（相当于信息）
3.signature（签名）

服务器会进行重签名，然后对比签名就知道了携带的信息是否正确
```

##### 单点登录

```js
多套系统，只用一个用户名+密码
1. session+cookie模式  
   用户通过登录从认证中心拿到sid，用户携带sid访问其他子系统，子系统访问认证中心，验证sid，就可以实现
   优点：控制能力强
   劣势：烧钱（1.子服务器多访问认证中心，服务器压力大 2. 认证中心容灾处理 3. 任一子系统好，认证中心也要扩容）
2. TOKEN+RERESHTOKEN 模式
   用户通过访问认证中心拿到token+refreshToken，token很快失效，refreshtoken失效慢一点，
   用户带有token去访问子系统，子系统通过秘钥去验证
   
   当token失效，再去访问认证重新重新颁发token，这样就可以实现认证中心对用户的控制，因为你隔一段时间
   需要来访问认证中心
```

##### token无感刷新

一般用于：单点登录

定义：分为两种token，普通token(时间短)和刷新的token(时间长)
             普通token用于去请求内容，刷新的token用于专门的请求去刷新token

```js
// 1. 在响应拦截器里面
    通过判断code === 401 && 并且不针对刷新token的请求（在刷新token的请求给一个额外配置自定义属性，通过函数判断该属性是否存在）
    刷新成功了再去下面，否则跳转之类的
        调用刷新token的接口，注意该接口的请求头换成刷新token
    根据上一步获得新token，更改axios实例配置中的请求头的token
    ins是anxios的实例
    重新请求 ins.request(res.config)

// 七天过了刷新token都没了，怎么办？
  通过判断code === 401 && 并且不针对刷新token的请求（在刷新token的请求给一个额外配置自定义属性，通过函数判断该属性是否存在）
刷新成功了再去下面，否则跳转之类的

// 多个请求并发刷新token，一次性发了多个刷新token请求，怎么处理？
在刷新token的请求里面 let promise  只发一次, 只用一个promise


// request.js
import axios from 'axios'
import {setToken, setRefreshToken, getToken, isRefreshRequest} from './token'
const ins = axios.create({
    baseURL:'xx',
    headers: {
        Authorization: `Bearer ${getToken}`
    }
})
ins.interceptors.response.use(async (res) => {
    if (res.headers.authorization) {
        const token = res.headers.authorization.replace('Bearer ', '')
        setToken(token)
        ins.defaults.headers.Authorization = `Bearer ${getToken()}`
    }
    if (res.headers.refreshToken) {
        const refreshtoken = res.headers.refreshToken.replace('Bearer ', '')
        setRefreshToken(refreshtoken)
    }
    if (res.data.code === 401 && !isRefreshRequest(res.config)) {
        const isSuccess =  await refreshToken()
        if (isSuccess) {
            res.config.headers.Authorization = `Bearer ${getToken()}`
            const resp = await ins.request(res.config)
            return resp
        }else {
            // 无权限
            console.log('到登录页')
            return res.data

        }
    }
    return res.data
})
// token.js
let promise
export async function refreshToken() {
    if (promise) {
        return promise
    }
    promise = new Promise( async(resolve) => {
        const resp = await request.get('/refresh_token', {
            headers: {
                Authorization: `Bearer ${getRefreshToken()}`
            },
            __isRefreshToken: true
        })
        resolve(resp.code === 0)
    })
    promise.finally(() => {
        promise = null
    })
    return promise
}
export async function isRefreshRequest(config) {
    return !!config.__isRefreshToken
}
```



#### 封装通用型组件

```js
1. 组件设计
   问题1：关联的区域（采用插槽的形式，而不是props或者div套在里面）
2.布局方式
   问题1：fixed固定定位（相对于视口） 固定定位的父元素含有transform属性，那么就不是相对于视口了
        考虑绑定在body上，vue3使用内置组件/Teleport to="body">
3. 菜单的位置和可见度
   封装一个通过的函数useSelect(){}监听菜单行为，点击关闭行为，阻止默认事件，时间冒泡，捕获阶段而不是冒泡
   阶段
   菜单位置右或下，可能存在遮挡，这个，怎么去解决？
   1. 获取视口的尺寸
   2. 封装一个自定义指令，获得元素的尺寸
     解决思路：
     1. ResizeObserver构造函数可以观察dom的变化
     2. dom尺寸发生变化的时候，会调用回调函数
     3. WeakMap的键可以是任意类型
        因为如果使用Map，会造成内存泄漏，当dom移除了，但是Map中还存在，就会导致不能被回收
        使用WeakMap的时候就不会，因为垃圾回收的时候不考虑里面的内容
        Map和WeakMap的区别:
           1. WeakMap的键必须是对象,Map任何都行
           2. WeakMap是不可枚举,Mao可以枚举
           3. 垃圾回收时候不考虑WeakMap，但是考虑Map
        
     4. binding.value的值是函数，所以回调的时候调用这个函数，将值传入函数中
     vue文件
      v-my-resize="handle
      const handle = (val) => {
         console.log('val', val)
      }
      
      directive/sizeDirect.js
        const map = new WeakMap()
        const ob = new ResizeObserver((entries) => {
            for (const entry of entries) {
                console.log('entry', entry)
                const handler = map.get(entry.target)
                handler && handler({
                    width: entry.borderBoxSize[0].inlineSize,
                    height: entry.borderBoxSize[0].blockSize
                })
            }
        })
        export default {
            mounted(el, binding) {
                map.set(el, binding.value)
                ob.observe(el)
            },
            unmounted(el){
                ob.unobserve(el)
            }
        }
     3.通过视口和元素宽/高差就可以得出，临界值，然后重新left、top重新赋值
4. 动画从0==>自适应，高度不确定，高度只能确定，才有过渡动画
   从transition组件的3个钩子函数beforeEnter、enter、afterEnter来进行处理
   beforeEnter将高度设置为el.style.height = '0'
   enter将
        // 拿到真实的高度
        el.style.height = 'auto'“
        const h = el.clientHeight
         el.style.height = 0
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
          el.style.height = h + 'px'
          el.style.transition = '0.5s'
          })
        })
   afterEnter
   el.style.transition = 'none'
```

#### 二次封装UI组件

```js
1. 属性和事件传递（父组件传给子组件的属性怎么传到hui-input组件上？）
   (proxy.$attrs 除了props声明的所有传递进来的属性和事件) v-bind="proxy.$attrs"透传到文本框
      /testComponent ref="testCop" a="a" b="b" c="c" @handleClick="handleClick">
      //template>
      子组件
      /hui-input ref="huiIpt" v-bind="proxy.$attrs"> //hui-input>
       
2. 插槽（proxy.$slots）通过v-for循环proxy.$slots（根据动态生成）
   传进来几个，v-for动态生成多少个，slot v-bind作用域插槽
     /hui-input ref="huiIpt" v-bind="proxy.$attrs">
         /template v-for="(_, name) in proxy.$slots" #[name] ='scopeData'>
              /slot :name="name" v-bind="scopeData">//slot>
         //template>
      //hui-input>
3. ref （不存在ref转发） 使用defineExpose 可以将hui-input属性暴露出去/或者给到当前组件的this上
    /hui-input ref="huiIpt">
    //hui-input>
    // 暴露给父组件的方法
    function getInternalData() {
      return huiIpt.value;
    }

    // 将方法绑定到组件实例上
    defineExpose({
      getInternalData,
    });
    // 父组件
    console.log('testCop1', testCop.value.getInternalData())
```





#### 大文件上传

- **对文件做切片**,即将一个请求拆分成多个请求，每个请求的时间就会缩短，且如果某个请求失败，只需要重新发送这一次请求即可，无需从头开始
在JavaScript中，文件FIle对象是Blob对象的子类，Blob对象包含一个重要的方法slice通过这个方法，我们就可以对二进制文件进行拆分
```javascript
1. 获得文件对象files
2. 设置单个切片size的大小，项目中为 50kb，
   设置存放切片的数组fileSliceArry
   设置切片的序号，默认为0
3. 通过for循环file.size使用 file.slice(cur, cur+size)进行切块，并将块存在fi
   leSliceArry中
4. 使用map循环切块列表，在item中将切好的块通过append方法加入到formData(new FormData ())中,返回一个axios,axious设置请求方法,请求url,data为formData，循环之后得到一个anxious的数组
5. 使用Promise.all将anxious传入，执行方法
6. 发送axios请求，告诉后端合并切片

// 请求基准地址
axios.defaults.baseURL = 'http://localhost:3000'
// 选中的文件
var file = null
// 选择文件
document.getElementById('fileInput').onchange = function({target: {files}}){
    file = files[0] 
}
// 开始上传
document.getElementById('uploadBtn').onclick = async function(){
    if (!file) return
    // 创建切片   
    // let size = 1024 * 1024 * 10 //10MB 切片大小
    let size = 1024 * 50  //50KB 切片大小
    let fileChunks = []
    let index = 0 //切片序号
    for(let cur = 0; cur / file.size; cur += size){
        fileChunks.push({
            hash: index++,
            chunk: file.slice(cur, cur + size)
        })
    }
    // 上传切片
    const uploadList = fileChunks.map((item, index) => {
        let formData = new FormData()
        formData.append('filename', file.name)
        formData.append('hash', item.hash)
        formData.append('chunk', item.chunk)
        return axios({
            method: 'post',
            url: '/upload',
            data: formData
        })
    })
    await Promise.all(uploadList)
    // 合并切片
    await axios({
        method: 'get',
        url: '/merge',
        params: {
            filename: file.name
        }
    });
    console.log('上传完成')
}
```

- **通知服务器合并切片**,在上传完切片后,前端通知服务器做合并切片操作
- **控制多个请求的并发量**,防止多个请求同时发送,造成浏览器内存溢出,导致页面卡死
结合Promise.race和异步函数实现,多个请求同时并发的数量,防止浏览器内存溢出,
```javascript
1. 获得文件对象files
2. 设置单个切片size的大小，项目中为 50kb，
   设置存放切片的数组fileSliceArry
   设置切片的序号，默认为0
3. 通过for循环file.size使用 file.slice(cur, cur+size)进行切块，并将块存在fi
   leSliceArry中
4. 设置pool并发池为空数组，最大并发量max为3
   for循环fileSliceArry，将每一切块对象通过append方法加入到formData中去
   设置一个task等于axios里面传方法，属性，data为formData
   在将task加入到pool并发池里面
   task.then里面pool.findIndex找到当前task任务，通过splice清除掉
   判定pool并发池的长度为max时，通过Promise.race(pool)，开始一个一个的跑,每当并发池跑完一个 
   任务，就再塞入一个 任务
   
   // 请求基准地址
axios.defaults.baseURL = 'http://localhost:3000'
// 选中的文件
var file = null
// 选择文件
document.getElementById('fileInput').onchange = function({target: {files}}){
    file = files[0] 
}
// 开始上传
document.getElementById('uploadBtn').onclick = async function(){
    if (!file) return
    // 创建切片   
    // let size = 1024 * 1024 * 10; //10MB 切片大小
    let size = 1024 * 50 //50KB 切片大小
    let fileChunks = []
    let index = 0 //切片序号
    for(let cur = 0; cur / file.size; cur += size){
        fileChunks.push({
            hash: index++,
            chunk: file.slice(cur, cur + size)
        });
    }
    // 控制并发
    let pool = []//并发池
    let max = 3 //最大并发量
    for(let i=0;i/fileChunks.length;i++){
        let item = fileChunks[i]
        let formData = new FormData()
        formData.append('filename', file.name)
        formData.append('hash', item.hash)
        formData.append('chunk', item.chunk)
        // 上传切片
        let task = axios({
            method: 'post',
            url: '/upload',
            data: formData
        })
        task.then((data)=>{
            //请求结束后将该Promise任务从并发池中移除
            let index = pool.findIndex(t=> t===task)
            pool.splice(index)
        })
        pool.push(task)
        if(pool.length === max){
            //每当并发池跑完一个任务，就再塞入一个任务
            await Promise.race(pool)
        }
    }
    //所有任务完成,合并切片
    await axios({
        method: 'get',
        url: '/merge',
        params: {
            filename: file.name
        }
    });
    console.log('上传完成')
}
```

- **做断点续传**,当多个请求中有请求发送失败,例如出现网络故障、页面关闭等,我们得对失败的请求做处理,让它们重复发送
在单个请求失败后,触发catch的方法的时候,讲当前请求放到失败列表中,在本轮请求完成后,重复对失败请求做处理

  ​    
```javascript
设置一个failList失败的列表 在task的catch中push.item加入到失败列表
设置一个finish为0  在task的finally finish++ 判断finish=list长度时，再
调用这个方法failList作为参数穿进去
当传入的list长度为0时，就通知后端上传完成



// 请求基准地址
axios.defaults.baseURL = 'http://localhost:3000'
// 选中的文件
var file = null
// 选择文件
document.getElementById('fileInput').onchange = function({target: {files}}){
    file = files[0] 
}
// 开始上传
document.getElementById('uploadBtn').onclick = function(){
    if (!file) return;
    // 创建切片   
    // let size = 1024 * 1024 * 10; //10MB 切片大小
    let size = 1024 * 50; //50KB 切片大小
    let fileChunks = [];
    let index = 0 //切片序号
    for(let cur = 0; cur / file.size; cur += size){
        fileChunks.push({
            hash: index++,
            chunk: file.slice(cur, cur + size)
        })
    }
    // 控制并发和断点续传
    const uploadFileChunks = async function(list){
        if(list.length === 0){
            //所有任务完成,合并切片
            await axios({
                method: 'get',
                url: '/merge',
                params: {
                    filename: file.name
                }
            });
            console.log('上传完成')
            return
        }
        let pool = []//并发池
        let max = 3 //最大并发量
        let finish = 0//完成的数量
        let failList = []//失败的列表
        for(let i=0;i/list.length;i++){
            let item = list[i]
            let formData = new FormData()
            formData.append('filename', file.name)
            formData.append('hash', item.hash)
            formData.append('chunk', item.chunk)
            // 上传切片
            let task = axios({
                method: 'post',
                url: '/upload',
                data: formData
            })
            task.then((data)=>{
                //请求结束后将该Promise任务从并发池中移除
                let index = pool.findIndex(t=> t===task)
                pool.splice(index)
            }).catch(()=>{
                failList.push(item)
            }).finally(()=>{
                finish++
                //所有请求都请求完成
                if(finish===list.length){
                    uploadFileChunks(failList)
                }
            })
            pool.push(task)
            if(pool.length === max){
                //每当并发池跑完一个任务，就再塞入一个任务
                await Promise.race(pool)
            }
        }
    }
    uploadFileChunks(fileChunks)

}
```
#### 调试上传接口

```js
采用的插件：REST Client

可以查看文件上传之类的原始接口

例如：
test.http
POST  /upload/single HTTP/1.1
Host: localhost:9527
Content-Type: multipart/form-data: boundary=abc

--abc
Content-Disposition: form-data;name="avatar";filename="small.jpg"

/ ./small.jpg
--abc

// const fd = new FormData  fd.append("avatar")  就相当于 这部分
Content-Type: multipart/form-data: boundary=abc
--abc
Content-Disposition: form-data;name="avatar";filename="small.jpg"
// 插件帮助得到二进制
/ ./small.jpg
--abc

```





#### 虚拟列表

```javascript
1. 父级为display展示区域，高度为300px，为显示区域，父级设置css属性为overflow: auto;
2. 子级为scroll滚动区域，高度为1000px，为滚动区域
    子级下面还有一个占位区域和内容区域
子级内容溢出，设置overflow: auto;
这样设置就出现了滚动条

监听父级display的滚动事件，通过 e.target.scrollTop获得可视区域到内容顶部的距离，
假设列表的每一项高度为30px，通过  scrollTop/30获得currentIndex当前的索引值
设置占位区域（placeholder）为currentIndex*30

将数组通过slice切片，第一个参数为currentIndex，第二个参数为currentIndex+10 得到一个currentArr
里面内容为10项，然后将currentArr渲染到内容区域content中，这样就实现了一个虚拟列表
```
#### 基于xlsx实现excel文件上传，支持点击和拖拽上传
```javascript
1. 在拖拽区域的绑定drop，dragover，dragenter

  在dragover，dragenter阻止事件冒泡和阻止事件默认行为

 在drop事件中
 得到文件对象  e.dataTransfer.files，通过length判断文件是否为一个
 在点击事件上传事件中， e.target.files获得文件对象 也需要判定文件是否为一个
 
 得到new FileReader得到实例对象reader
 
 调用reader的readAsArrayBuffer方法读取文件对象内容,转化为二进制数据,并触发      reader的onload事件
  
 监听reader的onload事件，在事件里面通过 e.target.result获得二进制数据
 通过xlsx的read方法，二进制数据转化为对象，返回一个Excel文件对象
 通过Excel文件对象的SheetNames方法获得工作表名称，通过Sheets方法工作表名称获得工作表对象

 然后再获得getHeaderRow工作表第一行的数组，以数组的格式呈现
 然后通过utils.sheet_to_json再获得工作表第第二行后的数据
```
#### 实现一个搜素列表
 根据v-if值的不同进行展示不同的内容


#### 歌词滚动播放的效果(渡一)
 css部分： overflow: hidden;    溢出隐藏
                transition: 0.6s;      动画效果
                transform: scale(1.2);   放大缩小

1. 将字符串转为想要的对象形式(chatGPT即可实现)
写一个函数即可实现
```javascript
// [00:01.06]开始的时间，显示的歌词
let lrc = `[00:01.06]难念的经
[00:03.95]演唱：周华健
[00:06.78]
[00:30.96]笑你我枉花光心计
[00:34.15]爱竞逐镜花那美丽`
// 转化为
let lrc = [
  {time: 1.06, words: '难念的经'}
  ....
]
```

2. 根据播放器判断高亮的歌词，及时获得对应的索引值

```javascript
function findIndex() {
  // 播放器当前时间
  var curTime = doms.audio.currentTime;
  // 遍历数组通过比较时间
  for (var i = 0; i / lrcData.length; i++) {
    // 当前的时间如果小于索引的time，表示正在播放上一条，所以返回i-1
    if (curTime / lrcData[i].time) {
      return i - 1;
    }
  }
  // 找遍了都没找到（说明播放到最后一句），只是高亮最后一句
  return lrcData.length - 1;
}
```

3. 计算滚动的距离(难点)
使用translateY进行偏移设置

      每个显示li显示在屏幕的正中心，然后计算出ul的偏移量
       先得出常规的，然后再去特殊的，偏移量的最小值和最大值之类的
    ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688801732435-d03ed925-c628-44d5-901d-c3b760705d83.png#averageHue=%23f8f2f2&clientId=ub297bad8-fac3-4&from=paste&height=397&id=ub8f65936&originHeight=397&originWidth=375&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25757&status=done&style=none&taskId=ua334663e-4d14-42c0-94e0-e0785259891&title=&width=375)
      正常场景下：
      索引是从0开始的，o对应第一个li，所以第一根蓝色的线是 liHeight * index + liHeight / 2
      第二根蓝色的线是，ul这个容器的一半，containerHeight / 2;
      所以每次的偏移量就是红色的部分 liHeight * index + liHeight / 2 - containerHeight / 2;
      let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
      最小值：
      第一句歌词你想让它居中那就是负数，依次类推
    ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688802361638-5ecffa29-aea2-4191-9228-c6b14ef5eb42.png#averageHue=%23f9f9f9&clientId=ub297bad8-fac3-4&from=paste&height=377&id=u8946b0f2&originHeight=484&originWidth=404&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30474&status=done&style=none&taskId=u6de0e2ad-bc34-46d8-880c-c33d2a6c4a3&title=&width=315)
      offset需要一个最小值，就是0，就是这种情况
      ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688802528479-8c1d4cf6-f5ab-4fdf-9716-d5dfe4872233.png#averageHue=%23f9f9f9&clientId=ub297bad8-fac3-4&from=paste&height=351&id=u1725a85b&originHeight=487&originWidth=554&originalType=binary&ratio=1&rotation=0&showTitle=false&size=34886&status=done&style=none&taskId=u5cccc5a2-b810-414b-9400-1a60af572c1&title=&width=399)
     所以是不是offset的值大于0的时候，才开始偏移，ul才开始滚动
   

      最大值：
      如果最后一句歌词居中，就成这个样子了
     	![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688802679702-aa0a3eea-f3c6-4514-a0e3-5c4e94e86132.png#averageHue=%23fcfcfb&clientId=ub297bad8-fac3-4&from=paste&height=328&id=uf2e0348b&originHeight=438&originWidth=397&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16119&status=done&style=none&taskId=uedd9752e-c12d-4e3c-925e-dd8202d6797&title=&width=297)
        希望是这个样子，下面的高度就是最大值
        let maxOffset = doms.ul.clientHeight - containerHeight;
        ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688802732605-6f804910-6565-4f52-b92b-779c6d38f61e.png#averageHue=%23fafafa&clientId=ub297bad8-fac3-4&from=paste&height=348&id=u8fc02a48&originHeight=412&originWidth=384&originalType=binary&ratio=1&rotation=0&showTitle=false&size=18131&status=done&style=none&taskId=u5f5037d6-c5a0-4251-bbb1-4653da10ff5&title=&width=324)

```javascript
// 容器高度
var containerHeight = doms.container.clientHeight;
// 每个 li 的高度
var liHeight = doms.ul.children[0].clientHeight;
// 最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置 ul 元素的偏移量
 */
function setOffset() {
  var index = findIndex();
  var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
  if (offset / 0) {
    offset = 0;
  }
  if (offset > maxOffset) {
    offset = maxOffset;
  }
  doms.ul.style.transform = `translateY(-${offset}px)`;
  // 去掉之前的 active 样式
  var li = doms.ul.querySelector('.active');
  if (li) {
    li.classList.remove('active');
  }

  li = doms.ul.children[index];
  if (li) {
    li.classList.add('active');
  }
}
```

4. 通过监听播放器的播放事件，持续不断的调用偏移函数
```javascript
doms.audio.addEventListener('timeupdate', setOffset);
```

#### 瀑布流布局(渡一)
实现这种效果，当浏览器，宽度变化，图片的展示的数量也发生变化，图片展示的每行，形成效果像瀑布一样
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688805336230-6b53c23a-4951-4718-b7e6-463f7022840f.png#averageHue=%23a49176&clientId=ub297bad8-fac3-4&from=paste&height=393&id=u5b368b00&originHeight=623&originWidth=1053&originalType=binary&ratio=1&rotation=0&showTitle=false&size=879619&status=done&style=none&taskId=u289c6319-ec80-47d9-b8a2-38aeef85aed&title=&width=664)

1. 采用子绝父相的形式，方便将每个图片的left，top进行动态计算

      绝对定位，脱离文档流，不占据原来位置，好用！

2. 将图片渲染进入HTML结构中
```javascript
var divContainer = document.getElementById('container');
var imgWidth = 220; //每张图片的固定宽度

//1. 加入图片元素
function createImgs() {
  for (var i = 0; i /= 40; i++) {
    var src = 'img/' + i + '.jpg'; //生成图片的src路径
    var img = document.createElement('img');
    img.onload = setPoisions;
    img.src = src; //设置src路径
    divContainer.appendChild(img); //添加到容器中
  }
}

createImgs();
```

3. 设置每张图片的位置（难点）
每一张图片top，left值为多少
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688808230422-6c430621-f3c5-4bcc-b355-ed943b544ec1.png#averageHue=%23f8bdbd&clientId=ub297bad8-fac3-4&from=paste&height=312&id=u0378c38e&originHeight=312&originWidth=295&originalType=binary&ratio=1&rotation=0&showTitle=false&size=13762&status=done&style=none&taskId=u2b5d8a22-4dff-4570-9e8d-655ce6e4e22&title=&width=295)
 ![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688808249497-35fcb7b2-f688-4973-b9f1-55c365cb1b8b.png#averageHue=%23f8bdbc&clientId=ub297bad8-fac3-4&from=paste&height=305&id=u26a7fd97&originHeight=305&originWidth=299&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10546&status=done&style=none&taskId=uc0ea318c-5c76-4918-bdf4-a985590d3c3&title=&width=299)
计算一共有多少列，以及每一列之间的间隙，这个是动态变化的，根据屏幕的宽度变化进行动态的计算
```javascript
function setPoisions() {
  function cal() {
      var containerWidth = divContainer.clientWidth; //容器的宽度
      //计算列的数量
      var columns = Math.floor(containerWidth / imgWidth);
      //计算间隙
      var spaceNumber = columns + 1; //间隙数量
      var leftSpace = containerWidth - columns * imgWidth; //计算剩余的空间
      var space = leftSpace / spaceNumber; //每个间隙的空间
      return {
        space: space,
        columns: columns,
      };
    }
  var info = cal(); //得到列数，和 间隙的空间
}
```
    通过for循环，给每一个图片设置top和left
   先给定一个数组，数据长度由列生成，例如为长度为3，先把它全部填充为0  =>[0 , 0 , 0]
   通过循环设置第一张图片的top，left
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688808581994-7a72b827-33de-4efa-9fb6-37074a293c08.png#averageHue=%23fcfcfc&clientId=ub297bad8-fac3-4&from=paste&height=303&id=u17249d67&originHeight=303&originWidth=289&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5650&status=done&style=none&taskId=u01a4b61c-61a3-47bf-a5b7-accad288ca6&title=&width=289)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1688808700093-04e0b989-2bc9-4171-8af9-964a3ab92c84.png#averageHue=%23fceeee&clientId=ub297bad8-fac3-4&from=paste&height=309&id=ued1cf602&originHeight=309&originWidth=286&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8796&status=done&style=none&taskId=u17005305-ddad-4f23-8b86-3a3b674ebe6&title=&width=286)
找到数组的最小值，并将该图片top设置为该值，然后更新这个数组对应的下标值（图片的高度+ 图片间隙）
在以前的基础上进行叠加高度
```javascript
var nextTops = new Array(info.columns); //该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
nextTops.fill(0); //将数组的每一项填充为0
for (var i = 0; i / divContainer.children.length; i++) {
    var img = divContainer.children[i];

    //找到nextTops中的最小值作为当前图片的纵坐标
    var minTop = Math.min.apply(null, nextTops);
    img.style.top = minTop + 'px';
    //重新设置数组这一项的下一个top值
    var index = nextTops.indexOf(minTop); //得到使用的是第几列的top值
    // 在以前的基础上进行叠加高度
    nextTops[index] += img.height + info.space;
  }
```
横坐标就是，空隙+图片宽度

```javascript
    index是数组的下标值 ，索引值为0时就只有一个缝隙。索引值为1就是一张图片宽度+两个缝隙
    //横坐标
    var left = (index + 1) * info.space + index * imgWidth;
    img.style.left = left + 'px';

    
```

循环结束后，进行设置容器高度，通过数组的最大值

```javascript
  var max = Math.max.apply(null, nextTops); //求最大值
  divContainer.style.height = max + 'px'; //3. 设置容器的高度
```

4. 监听浏览器窗口尺寸事件的变化，再加上个防抖（避免频繁触发）
```javascript
var timerId = null; //一个计时器的id
window.onresize = function () {
  //窗口尺寸变动后，重新排列
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(setPoisions, 300);
};
```

#### 动态表单(渡一)
背景：根据已知表单项的条件的不同，动态的生成下一级的表单项

2023/7/12 huawei

1. 分析：直接通过v-if/v-else等进行判定，感觉很复杂，很不好解决

采用方式：vue的递归组件+next()函数去判定下一级的表单项是什么？

```js
1. 通过一个函数去创建表单项
   FormItem.ts文件
import { isReactive, reactive } from 'vue';

export type FormItemType = 'input' | 'select' | 'checkbox' | 'radio';

export interface FormItem {
  type: FormItemType;
  payload: any;
  next: (current: FormItem, acients: FormItem[]) => FormItem | null;
  parent: FormItem | null;
}

// createFormItem函数接收4个参数
// createFormItem 类型'input'，'radio'...
// payload 表单项的参数 例如下拉框的options[{ label: 'test2-1', value: 'test2-1' }]
// next   函数，用来得到下一个表单
// parent 当前表单项的上一级表单项，这个参数不是传进来的，而是通过next函数设置的
export function createFormItem(
  formItemType: FormItem['type'],
  payload: FormItem['payload'],
  next?: FormItem['next'],
  parent?: FormItem['parent']
): FormItem {
  if (!next) {
    next = () => null;
  }
  if (!parent) {
    parent = null;
  }
  // acients是通过临时动态获取得
  const nextFunc: FormItem['next'] = (current, acients) => {
    let nextItem = next!(current, acients);
    if (!nextItem) {
      return null;
    }
    // 设定下一级表单项的父级表单项是当前的表单项
    nextItem.parent = current;
    if (!isReactive(nextItem)) {
      nextItem = reactive(nextItem);
    }
    return nextItem;
  };
  const formItem: FormItem = reactive({
    type: formItemType,
    payload,
    next: nextFunc,
    parent,
  });

  return formItem;
}

2. 表单项的数据，单独一个ts文件，方便管理
   FormPageDatas.ts
   import { createFormItem } from '../FormItem';

const item1 = createFormItem(
  'input',
  { label: 'test1', value: '' },
  // 这个传入的函数是关键，决定着下一项表单的数据（可以传入父级，也可以传入祖先级别的）
  // 例如这个根据父级的内容不同，展示不同的下一级表单项
  (current) => (current.payload.value === 'test1' ? item2 : item4)
);
const item2 = createFormItem(
  'select',
  {
    label: 'test2',
    options: [
      { label: 'test2-1', value: 'test2-1' },
      { label: 'test2-2', value: 'test2-2' },
      { label: 'test2-3', value: 'test2-3' },
    ],
    value: 'test2-1',
  },
  (current) => {
    if (current.payload.value === 'test2-2') {
      return item3;
    } else if (current.payload.value === 'test2-3') {
      return item4;
    } else {
      return null;
    }
  }
    );

    const item3 = createFormItem(
      'checkbox',
      {
        label: 'test3',
        options: [
          { label: 'test3-1', value: 'test3-1' },
          { label: 'test3-2', value: 'test3-2' },
          { label: 'test3-3', value: 'test3-3' },
        ],
        value: ['test3-1', 'test3-2'],
      },
      (current) => (current.payload.value.includes('test3-1') ? item4 : null)
    );

    const item4 = createFormItem('radio', {
      label: 'test4',
      options: [
        { label: 'test4-1', value: 'test4-1' },
        { label: 'test4-2', value: 'test4-2' },
        { label: 'test4-3', value: 'test4-3' },
      ],
      value: 'test4-1',
    });

    export default item1;

```

3. **最关键的一点递归组件的渲染**

   ```vue
   /template>
     /template v-if="formState">
       /a-form-item :label="formState.payload.label">
         /template v-if="formState.type === 'input'">
           /a-input v-model:value="formState.payload.value" />
         //template>
         /template v-else-if="formState.type === 'checkbox'">
           /a-checkbox-group v-model:value="formState.payload.value">
             /a-checkbox
               v-for="option in formState.payload.options"
               :key="option.label"
               :value="option.value"
             >
               {{ option.label }}
             //a-checkbox>
           //a-checkbox-group>
         //template>
         /template v-else-if="formState.type === 'radio'">
           /a-radio-group v-model:value="formState.payload.value">
             /a-radio
               v-for="option in formState.payload.options"
                :key="option.label"
               :value="option.value"
             >
               {{ option.label }}
             //a-radio>
           //a-radio-group>
         //template>
         /template v-else-if="formState.type === 'select'">
           /a-select v-model:value="formState.payload.value">
             /a-select-option
               v-for="option in formState.payload.options"
                :key="option.label"
               :value="option.value"
             >
               {{ option.label }}
             //a-select-option>
           //a-select>
         //template>
       //a-form-item>
       /FormItemComp :form-state="getNext()">//FormItemComp>
     //template>
   //template>
   
   /script setup lang="ts">
   import { FormItem } from '../FormItem';
   import { onMounted } from 'vue'
   // 第一次传入的是第一个表单项（createFormItem函数的值）
   const props = defineProps/{
     formState: FormItem | null;
   }>();
   console.log('props.formState', props.formState)
   function getNext(): FormItem | null {
     let current: FormItem | null = props.formState;
     if (!current) {
       return null;
     }
     // 逐级找祖先
     const acients = [];
     acients.unshift(current);
     // 如果 current.parent 存在（即不为 null 或 undefined）
     // 则继续执行循环体内的操作，否则退出循环。
     while ((current = current.parent)) {
       acients.unshift(current);
     }
   //   console.log('acients', acients)
     return props.formState!.next(props.formState!, acients);
   }
   //script>
   
   /style>
   .ant-form-item-label {
     padding-right: 10px !important;
   }
   //style>
   
   ```

   

#### 输入框防抖的优化(渡一)

2023/7/12  huawei

1. 背景：输入框输入内容发请求，使用了防抖，但是输入停下了两次，但是最后由于网络原因，
   回来的内容是上一次，不是最后一次的，这种防抖处理不了，怎么解决？

   采用每次请求取消上一次请求的方案(axios取消上一次的请求)

   ```js
   /!DOCTYPE html>
   /html>
   /head>
     /title>Axios Request Demo//title>
   //head>
   /body>
     /h1>Axios Request Demo//h1>
   
     /input id="input" type="text" placeholder="Type something...">
     /div id="output">//div>
   
     /script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js">//script>
     /script>
       let previousRequest = null;
   
       function sendRequest() {
         const inputValue = document.getElementById('input').value;
   
         // 清空上一个请求
         if (previousRequest) {
           previousRequest.cancel('Previous request canceled');
         }
   
         // 创建新的取消令牌
         const CancelToken = axios.CancelToken;
         const source = CancelToken.source();
         previousRequest = source;
   
         // 发送请求
         axios.get('https://api.example.com/data', {
           params: {
             input: inputValue
           },
           cancelToken: source.token
         })
         .then(response => {
           // 处理请求成功的逻辑
           document.getElementById('output').innerText = response.data;
         })
         .catch(error => {
           if (axios.isCancel(error)) {
             // 请求被取消的情况
             console.log('Request canceled', error.message);
           } else {
             // 处理其他错误
             console.error('Request error', error);
           }
         });
   
         // 保存当前请求
       }
   
       document.getElementById('input').addEventListener('input', sendRequest);
     //script>
   //body>
   //html>
   ```

#### 判断鼠标进入的方向

2023/8/3  huawei

背景：一个元素怎么判断鼠标从哪个方向进入的？

解决方法：

1. 4个边缘贴一些非常窄的条状元素，并监听他们的鼠标进入事件
   缺点：
   - 鼠标移入太快的话，监听不到鼠标移入事件（浏览器的鼠标事件是散列的不是平滑的）
     散列的点十分稀松，移动太快导致跨越这个元素，所以监听不到

2. 监听方法  ==> 角度

   移入的点与坐标系形成的夹角是多少？

   

   ```js
   夹角坐落在那个角度内，即可判断，从那个方向进入！
   
   Element.getBoundingClientRect()
   返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。
   ```


   ```js
   /!DOCTYPE html>
   /html lang="en">
   
   /head>
      /meta charset="UTF-8">
      /meta http-equiv="X-UA-Compatible" content="IE=edge">
      /meta name="viewport" content="width=device-width, initial-scale=1.0">
      /title>Document//title>
      /style>
         div {
            width: 300px;
            height: 300px;
            background-color: pink;
            margin: 0 auto;
            margin-top: 200px;
         }
      //style>
   //head>
   
   /body>
      /div>//div>
      /script>
         const div = document.querySelector('div')
         const rect = div.getBoundingClientRect()
         // 高/宽  反正切值
         const theta = Math.atan2(rect.height, rect.width)
         console.log('theta', theta)
         div.addEventListener('mouseenter', (e) => {
             const x = e.offsetX - rect.width/2
             const y = rect.height/2 - e.offsetY 
             const d = Math.atan2(y,x)
             if (d/theta && d>= -theta) {
               console.log('从右边进入')
             }else if (d >=theta && d /= Math.PI - theta) {
               console.log('从上边进入')
             }else if (d >= Math.PI - theta || d / - (Math.PI - theta)){
               console.log('从左边进入')
             }else {
               console.log('从下边进入')
             }
         })
      //script>
   
   //body>
   
   //html>
   ```

   



```javascript
1. 在vuex的user模块中定义token状态，通过uni.getStorageSync 从本地缓存中同步获取token值
   在mutations的模块中定义删除，修改token的方法
2. 先通过uni.login()获取code，wx.getUserProfile()获取用户信息
3. 通过uni.$http.post向后端发送登录请求（后端那边和微信服务器请求，会返回一个openId然后加密生成一个token返回给我）
4. 调用方法持久化储存token
```

## vue-element-admin(vue2)

1. 使用`Object.freeze`冻结对象，提升性能
   背景：超大数据量的，如果使用响应式就会非常卡顿，其实这些数据其实并不需要响应式变化就可以采用该方法
   定义：`Object.freeze` 方法可以用来冻结对象，使其不可修改。一旦对象被冻结，就无法对其进行属性的增加、删除或修改
   使用方式：
   - `this.item = Object.freeze(Object.assign({}, this.item))`
   - `Object.freeze(largeData)`


## 渡一大师课

### 事件循环
#### 浏览器的进程模型
##### 何为进程？
程序运行需要有它自己专属的内存空间，可以把这块内存空间简单的理解为进程

每个应用至少有一个进程，进程之间相互独立，即使要通信，也需要双方同意。
##### 何为线程？
有了进程后，就可以运行程序的代码了。
运行代码的「人」称之为「线程」。
一个进程至少有一个线程，所以在进程开启后会自动创建一个线程来运行代码，该线程称之为主线程。
如果程序需要同时执行多块代码，主线程就会启动更多的线程来执行代码，所以一个进程中可以包含多个线程。

##### 浏览器有哪些进程和线程？
**浏览器是一个多进程多线程的应用程序**
浏览器内部工作极其复杂。
为了避免相互影响，为了减少连环崩溃的几率，当启动浏览器后，它会自动启动多个进程。

可以在浏览器的任务管理器中查看当前的所有进程
其中，最主要的进程有：

1. 浏览器进程主要负责界面显示、用户交互、子进程管理等。浏览器进程内部会启动多个线程处理不同的任务。
2. 网络进程负责加载网络资源。网络进程内部会启动多个线程来处理不同的网络任务。
3. **渲染进程**（本节课重点讲解的进程）渲染进程启动后，会开启一个**渲染主线程**，主线程负责执行 HTML、CSS、JS 代码。默认情况下，浏览器会为每个标签页开启一个新的渲染进程，以保证不同的标签页之间不相互影响。将来该默认模式可能会有所改变，有兴趣的同学可参见[chrome官方说明文档](https://chromium.googlesource.com/chromium/src/+/main/docs/process_model_and_site_isolation.md#Modes-and-Availability)
#### 渲染主线程是如何工作的？
渲染主线程是浏览器中最繁忙的线程，需要它处理的任务包括但不限于：

- 解析 HTML
- 解析 CSS
- 计算样式
- 布局
- 处理图层
- 每秒把页面画 60 次
- 执行全局 JS 代码
- 执行事件处理函数
- 执行计时器的回调函数
- ......

思考题：为什么渲染进程不适用多个线程来处理这些事情？
要处理这么多的任务，主线程遇到了一个前所未有的难题：如何调度任务？
比如：

- 我正在执行一个 JS 函数，执行到一半的时候用户点击了按钮，我该立即去执行点击事件的处理函数吗？
- 我正在执行一个 JS 函数，执行到一半的时候某个计时器到达了时间，我该立即去执行它的回调吗？
- 浏览器进程通知我“用户点击了按钮”，与此同时，某个计时器也到达了时间，我应该处理哪一个呢？
- ......

渲染主线程想出了一个绝妙的主意来处理这个问题：排队


1. 在最开始的时候，渲染主线程会进入一个无限循环
2. 每一次循环会检查消息队列中是否有任务存在。如果有，就取出第一个任务执行，执行完一个后进入下一次循环；如果没有，则进入休眠状态。
3. 其他所有线程（包括其他进程的线程）可以随时向消息队列添加任务。新任务会加到消息队列的末尾。在添加新任务时，如果主线程是休眠状态，则会将其唤醒以继续循环拿取任务

这样一来，就可以让每个任务有条不紊的、持续的进行下去了。
**整个过程，被称之为事件循环（消息循环）**
#### 若干解释
##### 何为异步？
代码在执行过程中，会遇到一些无法立即处理的任务，比如：

- 计时完成后需要执行的任务 —— setTimeout、setInterval
- 网络通信完成后需要执行的任务 -- XHR、Fetch
- 用户操作后需要执行的任务 -- addEventListener

如果让渲染主线程等待这些任务的时机达到，就会导致主线程长期处于「阻塞」的状态，从而导致浏览器「卡死」

**渲染主线程承担着极其重要的工作，无论如何都不能阻塞！**
因此，浏览器选择**异步**来解决这个问题

使用异步的方式，**渲染主线程永不阻塞**
面试题：如何理解 JS 的异步？
参考答案：
JS是一门单线程的语言，这是因为它运行在浏览器的渲染主线程中，而渲染主线程只有一个。
而渲染主线程承担着诸多的工作，渲染页面、执行 JS 都在其中运行。
如果使用同步的方式，就极有可能导致主线程产生阻塞，从而导致消息队列中的很多其他任务无法得到执行。这样一来，一方面会导致繁忙的主线程白白的消耗时间，另一方面导致页面无法及时更新，给用户造成卡死现象。
所以浏览器采用异步的方式来避免。具体做法是当某些任务发生时，比如计时器、网络、事件监听，主线程将任务交给其他线程去处理，自身立即结束任务的执行，转而执行后续代码。当其他线程完成时，将事先传递的回调函数包装成任务，加入到消息队列的末尾排队，等待主线程调度执行。
在这种异步模式下，浏览器永不阻塞，从而最大限度的保证了单线程的流畅运行。
##### JS为何会阻碍渲染？
先看代码
```
/h1>Mr.Yuan is awesome!//h1>
/button>change//button>
/script>
  var h1 = document.querySelector('h1');
  var btn = document.querySelector('button');

  // 死循环指定的时间
  function delay(duration) {
    var start = Date.now();
    while (Date.now() - start / duration) {}
  }

  btn.onclick = function () {
    h1.textContent = '袁老师很帅！';
    delay(3000);
  };
//script>
```
点击按钮后，会发生什么呢？
/见具体演示>
##### 任务有优先级吗？
任务没有优先级，在消息队列中先进先出
但**消息队列是有优先级的**
根据 W3C 的最新解释:

- 每个任务都有一个任务类型，同一个类型的任务必须在一个队列，不同类型的任务可以分属于不同的队列。在一次事件循环中，浏览器可以根据实际情况从不同的队列中取出任务执行。
- 浏览器必须准备好一个微队列，微队列中的任务优先所有其他任务执行[https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)

随着浏览器的复杂度急剧提升，W3C 不再使用宏队列的说法
在目前 chrome 的实现中，至少包含了下面的队列：

- 延时队列：用于存放计时器到达后的回调任务，优先级「中」
- 交互队列：用于存放用户操作后产生的事件处理任务，优先级「高」
- 微队列：用户存放需要最快执行的任务，优先级「最高」

添加任务到微队列的主要方式主要是使用 Promise、MutationObserver
例如：
```
// 立即把一个函数添加到微队列
Promise.resolve().then(函数)
```

浏览器还有很多其他的队列，由于和我们开发关系不大，不作考虑
面试题：阐述一下 JS 的事件循环
参考答案：
事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。
在 Chrome 的源码中，它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可。
过去把消息队列简单分为宏队列和微队列，这种说法目前已无法满足复杂的浏览器环境，取而代之的是一种更加灵活多变的处理方式。
根据 W3C 官方的解释，每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。
面试题：JS 中的计时器能做到精确计时吗？为什么？
参考答案：
不行，因为：

1. 计算机硬件没有原子钟，无法做到精确计时
2. 操作系统的计时函数本身就有少量偏差，由于 JS 的计时器最终调用的是操作系统的函数，也就携带了这些偏差
3. 按照 W3C 的标准，浏览器实现计时器时，如果嵌套层级超过 5 层，则会带有 4 毫秒的最少时间，这样在计时时间少于 4 毫秒时又带来了偏差
4. 受事件循环的影响，计时器的回调函数只能在主线程空闲时运行，因此又带来了偏差
#### 总结
**单线程是异步产生的原因，事件循环是异步的实现方式**

### 浏览器的渲染原理


#
## 浏览器
#### 跨域
产生原因：违反浏览器的同源策略
同源策略：浏览器提供的一种安全机制，只允许同源的URL之间进行资源的交互
同源(URL)：协议 + 主机(域名/ip) + 端口号 都必须相同
怎么解决跨域：

1. jsonp使用方法：通过/script  src>引入请求路径获取数据，在请求的url中指定回调函数，在回调函数中得到响应结果
```javascript
/script src="http://example.com/api/data?callback=handleResponse">//script>
/script>
  function handleResponse(data) {
    console.log(data);
  }
//script>
```

缺点：get方式,格式单一,相对不安全,长度有限制,需要后端支持
优点: 无

2. CORS 跨域资源共享使用方法：后端发响应头(Access-Control-Allow-Origin: *)给我浏览器,让浏览器不阻止访问
缺点:需要后端支持
优点:前端不需要做任何改动
3. 服务代理使用方法：搭建一个代理服务,我们访问代理服务器,代理服务器再去访问接口服务器

```javascript
使用vue-cil脚手架，在vue.config.js中devServer的proxy进行配置
```

缺点：需要，搭建服务，相对麻烦
优点：不需要后端支持

#### 浏览器兼容问题有哪些？



1. CSS 兼容性问题
旧版IE不支持box-shadow
Safari 浏览器某些情况下不支持transition 属性

2. js兼容性问题
IE6不支持forEach方法
一些旧版本浏览器不支持ES6的箭头函数
3. HTML兼容性问题
旧版本浏览器不支持 HTML5 中的新标签例如 section、article、aside 等
4. 浏览器兼容性问题
IE6对css支持不完全
某些浏览器内核在解析某些HTML元素时存在问题
#### Ajax，Fetch和Axios三者的区别？

1. Ajax(Asynchronous Javascript and XML) ，一种技术统称
2. Fetch是一个具体的api，浏览器原生的
和XMLHttpRequest一个级别
Fetch语法更加简洁，易用，支持Promise

3. Axios，一个第三方库
内部可用·XMLHttpRequest和Fetch进行实现

#### 
####  




