---
outline: deep
---
<script setup>
import realProject from '../../components/realProject.js'
</script>

#### vite对图片的识别和处理

```js
路径必须是静态的！（使用动态的不生效例如v-bind绑定）
1. 标签的路径(img.)
2. CSS中的路径

如果是静态的路径才会产生这些下面的处理
1. 让模块和路径产生依赖，有依赖才会生成到打包结果
2. 生成到打包结果会加上文件指纹 


对于动态的怎么处理？
1. import imgUrl from './img1.png'
   import imgUr2 from './img2.png'
   import imgUr3 from './img3.png'
导入拿到的是打包路径的结果， imgUrl ==> /assets/1-2ee14cc22.jpg
这种方法太繁琐
2. 动态导入import(`./assets/${val}.jpg`).then(res => {
    path.value = res.default
})
生成的js文件太多，增加网络请求
3. URL处理（也会被vite监听到）
   // 参数1图片路径，参数2图片相对于那个模块
  const url = new URL(`./assets/${val}.jpg`, import.meta.url)
  path.value = url 
打包结果干净


项目中遇到开发过程图片显示正常，打包之后图片消失。
 <img :src="item.imgType === '热式' ? './samall.svg' : `./big.svg`">
```

#### vite图片生产和打包名称一致

```js
1. 通过import导入
   import bigImg from './bigImg.png'
    import smallImg from './smallImg.png'
   生产环境：
    /src/asserts/bigImg.png 
   /src/asserts/smallImg.png
   生产环境：
    /src/asserts/big-414c4ac.png.
    data:img........................   (变成了base64)
   vite的优化，当图片很小打包的时候就不需要进行网络请求了，整一个dataURL就行了

想要开发环境也一致保持 /src/asserts/small-111c4ac.png.
export default defineConfig({
  build: {
   assetsInlineLimit:0   // 大于0KB都要打包处理
  }
})

如果想要生产环境也保持小图base64的格式，怎么处理？
手写一个vite插件
import fs from 'node:fs'
// 插件一个函数而不是对象，方便传值
const MyPlugin: any = (limit = 4096) => {
   return {
      name: 'my-plugin',
      // vite中使用了esbuild，rollop
      // transform属于rollop其中的一个钩子函数
       // 加载一个模块就会运行，将内容和路径给你
      async transform(code, id) {
         if (process.env.NODE_ENV !== 'development') {
            return
         }
         if (!id.ensWith('.png')) {
            return
         }
         const stat = await fs.promise.stat(id)
         if (stat.size > limit) {
            return
         }
         // 转化为base64
         const buffer = await fs.promise.readFile(id)
         const base64 = buffer.toString('base64')
         const dataurl = `data:image/png;base64,${base64}`
         return {
            code: `export default ${dataurl}`
         }
      }
   }
}
export default defineConfig({
    plugins: [
       MyPlugin()
    ])
  ],
})
```

#### 图片预览的处理方式

```js
data url 

src需要的是，统一资源定位符

什么是dataurl?
标准格式字符串  
data:content/type;base64,
固定   类型，例如：  资源数据
          text/plain
          text/html 
          text/css
          application/json
          application/javascript
          image/png
不需要经过网络通信
1. FileReader的优点是兼容性较好，但是将大文件转换为DataURL会消耗更多内存
2. createObjectURL性能好，但是生成的URL只在当前页面有效，并且需要手动管理
（释放）URL占用的资源    URL.revokeObjectURL

```
<Playground :files="realProject.viewImg"/> 
#### selct全选all的循环
1. 采用循环（推荐）
<Playground :files="realProject.arrayLoop"/> 

#### 多线程(new Worker)

<Playground :files="realProject.multithreading"/> 
