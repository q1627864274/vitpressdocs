---
outline: deep
---
<script setup>
import vueContext from '../../components/vuemd.js'
</script>
#### 路由的传参方式有哪些？
#### Vue中怎么获得dom更新后的结果？

1. 生命周期updated这个钩子函数
2. nextTick方法，nextTick方法
```javascript
    // 实现原理？ 
    // 它的源码src/core/util/next-tick.ts也就100来行~~它内部做了一个宏微任务的优雅降级
    // 它首先判断当前浏览器环境支不支持 promise , 如果不支持，再判断是否支持 mutationObserver,
    // 如果还是不支持，继续判断，setImmediate支不支持，最后setTimeout兜底
```
#### 自定义指令的运用场景

1. 按钮权限控制
2. 输入框自动聚焦
3. 图片懒加载当图片出现在用户视口时才进行加载，以提升页面加载速度。
```javascript
Vue.directive('lazy', {
  inserted: function (el, binding) {
    const img = new Image()
    img.src = binding.value
    img.onload = function () {
      el.src = binding.value
    }
  }
})
  ///img v-lazy="'https://example.com/img.jpg'">

// const img = new Image()：创建一个新的 Image 对象，用于预加载图片。
// img.src = binding.value：将指令绑定值 binding.value（即图片的真实路径）赋给预加载的图片对象的 src 属性。
// img.onload = function () {...}：设置图片对象的 onload 事件处理函数，在图片加载完成时触发。
// el.src = binding.value：将指令绑定值 binding.value 赋给元素的 src 属性，实现图片加载。
```

4. 图片加载失败给默认图片

#### 组件缓存keep-alive

2023/7/28  huawei
定义：只有那些无状态或静态的组件，才适合使用///keep-alive>进行性能优化。
           那些需要频繁刷新数据或包含用户个性化信息的组件不适合被缓存，因为这可能导致显示错误的数据。
           

1.  利用用`///keep-alive>`对组件进行缓存，保留组件之前的行为
      场景：
             ///keep-alive>包裹路由出口///router-view>

```javascript
///template>
  ///div>
    ///keep-alive :include="['Home']">
      ///router-view>////router-view>
    ////keep-alive>
  ////div>
////template>
```

2.  ///keep-alive>包裹动态组件///component>

```javascript
      ///keep-alive>
        ///component :is="nowCom">////component>
      ////keep-alive>
```
参数：
   1. include ：那些组件可以缓存
   2. exclude：那些组件不会被缓存
   3. max：组件最大的缓存数量，超过这个值，则最久没有被访问的缓存实例将被销毁 

注意点：
1. 被///keep-alive>包裹的组件，激活的时候会触发activated这个钩子函数，组件停用时会触发deactivated这个
    钩子函数


#### 为什么 v -for 循环的 key 值不建议使用 index？

1. 不稳定，当数组的顺序发生变化时，也会导致重新的渲染

#### Vue的响应式和渲染原理？

1. 响应式原理
data数据的修改和读取，会触发Object.defineProperty/Proxy里面的setter和getter
调用setter函数(数据劫持)，会异步的触发render函数(性能优化，防止次次渲染)

      调用get 函数调用后，会进入 watch/deps 队列（依赖收集），没有收集到依赖则不会进行重新渲染
       (这是一种性能优化)

2. 渲染原理
render 函数调用后，生成虚拟 dom 树，虚拟节点叫 VNode，应用 diff 算法，对比新旧节点，找出变更 —— 只对比同级节点，该新增新增，该删除删除，该修改修改，如果 tag 不相同，直接替换，children 需要对比 key，事件和样式都需要单独处理—— diff 算法完成后，触发生命周期（updated/mounted）和 watch，最后丢到页面上展示（patch）

#### Vue的响应式原理里面的生命周期
**(created 创建实例，mounted 首次渲染)** 修改属性，defineProperty, 调用 set，**（beforeUpdate）**触发 render，调用 get，依赖收集,render 调用，生成 VNode，应用 diff，同级比较，tag 不同，直接替换，children 需要对比 key，事件样式单独处理，触发 watch，**（updated）**页面 repatch，组件销毁**（mounted）**
#### Vue为什么需要虚拟dom？

1. 虚拟dom它不是真正的dom，是一个用来描述dom的对象
根据新旧虚拟dom的对比，解决dom操作增量更新问题，性能提升（只渲染更新的部分）
#### Vue的diff算法是什么？

1. 渲染函数生成的虚拟dom数
diff算法的本质是比较两棵树的差异
#### vue中组件的传值有什么方法？

1. props和$emit

vue3中组合式api传递，defineProps与defineEmits

```javascript
defineProps的传递
// parent.vue
///template>
  ///div>
    ///h2>父子通信////h2>
    ///my-child :count="0" message="hello world">////my-child>
  ////div>
////template>
///script setup>
import MyChild from '@/child.vue'
////script>

  
// child.vue
///template>
  ///div>
    ///h2>hi child, {{ count }}, {{ message }}////h2>
  ////div>
////template>
///script setup>
import { defineProps } from 'vue'
const state = defineProps({   // defineProps -> 底层 -> reactive响应式处理的
  count: {
    type: Number
  },
  message: {
    type: String
  }
});
console.log( state.count, state.message );
////script>
```


//defineEmits是用来完成子父通信的
// parent.vue
///template>
  ///div>
    ///h2>子父通信////h2>
    ///my-child @custom-click="handleClick">////my-child>
  ////div>
////template>
///script setup>
import MyChild from '@/child.vue'
let handleClick = (data) => {
  console.log(data);
}
////script>

// child.vue
///script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['custom-click']);
setTimeout(()=>{
  emit('custom-click', '子组件的数据');
}, 2000)
////script>
```

2. v-model 和 .sync
3. provide/inject（依赖注入）
父组件可以通过**provide**选项向子孙组件传递数据，子孙组件可以通过**inject**选项声明接收这些数据。

vue3中的依赖注入，更好的传递响应式数据，传递修改响应式数据的方法
readonly使得子组件无法修改父组件的数据，符合单向数据流的思想

​```javascript
// 父组件
///template>
  ///div>
    ///my-inject>////my-inject>
  ////div>
////template>
///script setup>
import MyInject from '@/inject.vue'
import { provide, ref, readonly } from 'vue'
//传递响应式数据
let count = ref(0);
let changeCount = () => {
  count.value = 1;
}
provide('count', readonly(count))
provide('changeCount', changeCount)

setTimeout(()=>{
  count.value = 1;
}, 2000)
////script>


// 子组件
///template>
  ///div>
    ///div>{{ count }}////div>
  ////div>
////template>

///script setup>
import { inject } from 'vue'
let count = inject('count')
let changeCount = inject('changeCount')
setTimeout(()=>{
  changeCount();
}, 2000);

////script>
```

4. $attars和$listers
**$attrs**包含父组件传递给子组件但未在子组件中声明为**props**的特性
而**$listeners**包含父组件监听的子组件事件
5. vuex
6. 作用域插槽
7. 组件上的ref
#### 自定义全局属性
```javascript
# vue2中
  将实例挂载到 Vue 原型上
1. Vue.prototype.$global = globalVueInstance

# vue3中
// main.js
1. app.config.globalProperties.$http = http;

2. 通过使用 createApp 的 provide/inject API
app.provide('$get', get)

inject: ['$get'],
created(){
  console.log(this.$get())
}
```
#### vue中computed和watch的区别？

1. computed的计算结果会被缓存起来，避免重复计算的场景
watch不会
2. computed不支持异步的程序(因为是return的同步的)
watch支持异步的程序，适合一些复杂的操作，例如发送网络请求等
3. watch可以使用深度监听一个数组或对象的变化
但是computed无法实现
4. watch适合：一个值去影响多个值的应用
computed：多个值去影响一个值的应用
#### watch和watchEffect的区别？
  watch在vue2和vue3中都存在
  watchEffect是vue3新增的API

1. watch可以访问新值和旧值，watchEffect不能访问
2. watch需要指明监听的属性，watchEffect不需要指明，在监视的回调
中用到了那个响应式属性，就会自动监听
3. watch是惰性执行的，只有值发生变化才会执行（需要立即执行一次，需要配置），watchEffect在每次主动会执行一次，值变化也会执行
#### Vue3中的watch副作用是什么？
**数据副作用**：修改属性的时候，我们的目的是修改属性，
属性被修改 —— 正作用 effect，
但是属性的修改导致了视图的更新 —— 副作用 side effect
#### vue3使用watch对对象的监听类型有几种

1. 监听整个对象，对象下的属性值发生变化就触发(嵌套的也会触发)，会隐式的创建depp，相比较vue2**不需要加deep**

```javascript
import { reactive, watch, ref } from "vue";

const state = reactive({
  count: 0,
  person: {
    name: "Alice",
    age: 30,
  },
});

// 监听 state.person 对象
watch(
  state,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)    // 对象的新旧值是没有变化的
    console.log("person has been replaced!");
  }
);

setTimeout(() => {
 // 修改name的值
  state.person.name = "Bob";
 // 修改count的值
  state.count++;
}, 2000);
```

2. 监听对象的某个属性值，属性值里面不嵌套，使用**返回该属性的 getter 函数**

```javascript
import { reactive, watch, ref } from "vue";

const state = reactive({
  count: 0,
  person: {
    name: "Alice",
    age: 30,
  },
});

watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
    console.log("person has been replaced!");
  }
);

setTimeout(() => {
 // 修改name的值
  // state.person.name = "Bob";
 // 修改count的值
  state.count++;
}, 2000);
```

3. 监听对象的某个属性值，属性值里面嵌套，嵌套里面的属性发生改变，触发watch，需要使用**deep**
```javascript
import { reactive, watch, ref } from "vue";

const state = reactive({
  count: 0,
  person: {
    name: "Alice",
    age: 30,
  },
});

watch(
  () => state.person,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
    console.log("person has been replaced!");
  },
  { deep: true }
);

setTimeout(() => {
 // 修改name的值
  state.person.name = "Bob";
 // 修改count的值
  // state.count++;
}, 2000);
```

4. 扩展，监听多个数据源并根据响应值做出改变
```javascript
const x = ref(0)
const y = ref(0)
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```


#### 
#### vue2和vue3的watch不同点

1. 监听对象的时候，
vue2需要开启深度监听，监听对象的每个属性
vue3不需要，默认开启了

```javascript

// vue2
   watch:{
        // 默认情况下，watch只能监听到简单类型的数据变化,如果监听的是复杂类型，只会监听地址是否发生改变，不会监听对象内部属性的变化。
        person:{
            deep:true, // 表示深度监听，监听这个对象的每一个属性
                      // ==> 复杂数据类型中任何一个属性变化了，就会执行handler
            immediate:true, // 一开始就立即执行一次
            // 当我们深度监听的时候，newVal和oldVal都是一个对象
            // 它们会指向同一个引用，oldVal在深度监听的时候，无效，可以只写一个参数newVal
            handler(newVal, oldVal){
                console.log(newVal)
                console.log(oldVal)
                console.log(newVal === oldVal)
            }
        }
    }

// vue3 


const obj = reactive({ count: 0 })
watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```
#### watchEffect的缺陷

1. watchEffect**在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
   运行watchEffect回调函数收集依赖，是同步的过程，这就相当于没有收集到依赖，所以造成这个现象
   没有收集到依赖导致数据变化函数不会运行

**

```javascript
import { reactive, watchEffect } from "vue";

const obj = reactive({ count: 0 });

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(obj.count);
}

watchEffect(() => {
  fetchData();
}); 
// 2秒后改变count的值
setTimeout(() => {
  obj.count++;
}, 2000);

// 发现2秒之后，并不会触发监听
```
#### watch监听数组套对象中的属性变化（vue3中的闭包）

```js
 const options = ref([
   {
      num: 1,
      type: '',
      id: '',
      range: '10',
      scale: '10-100',
      min: '10',
      max: '100',
      status: false,
   },
   {
      num: 2,
      type: '',
      id: '',
      range: '',
      scale: '',
      min: '',
      max: '',
      status: false
   },
])
const updateMinMax = (scale, option) => {
  if (scale) {
    const [min, max] = scale.split('-');
    option.min = min;
    option.max = max;
  } else {
    option.min = '';
    option.max = '';
  }
};

options.value.forEach((option) => {
  watch(() => option.scale, (newScale) => {
    updateMinMax(newScale, option);
  });
});

//  option使用闭包，允许你访问定义它时的作用域中的变量，尽管 watch 的回调函数在未来的某个时刻执行（当 scale 属性变化时），它依然能够记住并访问到那个作用域中的 option 变量
```



#### 侦听器监听怎么获得dom更新后的结果
   用户创建的侦听器回调，都会在 Vue 组件更新**之前**被调用，访问的 DOM 将是被 Vue 更新之前的状态（vue的响应式原理）

1. 添加flush: 'post'

```javascript
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

2. 使用watchPostEffect()

```javascript
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

#### watch和watchEffect的扩展

1. watch选项的扩展
**flush 选项的 post 相当于生命周期的 updated，pre 相当于 beforeUpdate

**

```javascript
///script setup>
import { ref, watch, computed } from "vue";
const count = ref(0);
const show = computed(() => count.value % 2 === 0);
const pRef = ref(null);
watch(pRef, (val) => {
  if (val) {
    console.log("直接监听 pRef", val);
  }
});

watch(
  show,
  () => {
    if (show) {
      console.log("监听 show", pRef.value);
    }
  },
  {
    flush: "post", // post 相当于 updated，pre 相当于 beforeUpdate
  }
);
////script>

///template>
  ///div>
    ///h1>watch flush////h1>
    ///p v-if="show" ref="pRef">{{ count }}////p>
    ///button @click="count++">count++////button>
  ////div>
////template>

```

        watch 函数有第三个参数，即 (newValue,oldValue,onCleanup)=>void 的 onCleanup 函数
       下一次变化时处理上一次的副作用
    
       onCleanup：会在更新前触发和卸载前触发
                          用于清除上一次的行为（清除上一次的ajax，清除上一次的定时器）
```javascript
///script setup>
import { ref, watch } from "vue";
const count = ref(0);
watch(count, (val, _, onCleanup) => {
  const to = setTimeout(() => {
    // 实质上等同于 debounce
    console.log("watch count timeout", val);
  }, 1000);
  onCleanup(() => {
    clearTimeout(to);
  });
});
////script>
///template>
  ///div>
    ///h1>watch cleanup////h1>
    ///p>{{ count }}////p>
    ///button @click="count++">count++////button>
  ////div>
////template>

```

2. watchEffect 无依赖时，可以作为生命周期的 mounted 和 unMounted 使用 组件卸载生命周期

```javascript
App.vue
///script setup>
import Child from "./Child.vue";
import { ref } from "vue";
const show = ref(false);
////script>
///template>
  ///Child v-if="show" />
  ///button @click="show = !show">切换显示////button>
////template>

Child.vue
///script setup>
import { watchEffect } from "vue";
watchEffect((onCleanup) => {
  // 注意，此处不要引用任何响应式变量
  console.log("相当于 mounted");
  onCleanup(() => {
    console.log("相当于 unMounted");
  });
});
////script>
///template>子组件////template>

```


#### vue3的reactive响应式丢失	
因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该**响应式对象的相同引用

**
```javascript
被覆盖掉，响应式丢失
let state = reactive({ count: 0 })
// 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
state = reactive({ count: 1 })


const state = reactive({ count: 0 })
// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count
// 不影响原始的 state
n++

// count 也和 state.count 失去了响应性连接
let { count } = state
// 不会影响原始的 state
count++
```
#### ref的作用，声明响应式变量，获得原生dom元素

1. 声明响应式变量    let count = ref(0); 
```javascript
///script setup>
import { ref } from 'vue';
let count = ref(0); 
count.value += 1;  
////scirpt>
///template>
  ///div>
    {{ count }}
  ////div>
////template>
```

2. 获得原生的dom元素
let elem = ref();
///h2 ref="elem">setup属性方式////h2>
```javascript
///template>
  ///div>
    ///h2 ref="elem">setup属性方式////h2>
  ////div>
////template>
///script setup>
import { ref } from 'vue';
let elem = ref();
setTimeout(()=>{
  console.log( elem.value );   //拿到对应的原生DOM元素
}, 1000)
////script>
```
#### ref声明的响应式变量，为什么要通过.value进行获取

1. 通过ref(xx)得到是一个对象，对象里面是{value:0}
2. 为什么要返回一个对象，涉及到js底层，基本数据类型和引用数据类型的处理方式不同
将基本类型赋值给变量a
a再赋值给变量b
当b修改了，a是没有变化，两个变量之间是无法做到监控的
```javascript
/* let a = 1;
let b = a;
b += 3;
a  ->  1 
```
     引用数据类型则是地址的引用
     可以起到相互的监听
```javascript
let c = [1,2,3];
let d = c;
d.push(4);
c -> [1,2,3,4] */
```
#### ref和reactive的区别
这两个都可以声明响应式变量
  1.  **ref** 可以定义任何类型的值作为参数，而 **reactive** 只能接收对象类型的参数。

2. **ref** 返回一个包装后的对象，需要通过 **.value** 属性来访问实际的值。
**reactive** 返回一个响应式对象，可以直接访问其中的属性。

```javascript
vue3中
let suggestList = reactive([]);
  suggestList = result;
这种方法不行
原因：reactive 函数用于创建响应式的对象，它返回的是一个代理对象(例如选项式的data选项，也是在内部交给了reactive函数将其编程响应式对象)
原来是引用响应式代理，更换为不是，所以就丢失了响应性

你应该直接操作这个代理对象，而不是将它覆盖	

为什么下面的可以
let suggestList = ref([]);
suggestList.value = result;
通过.value是进行更新ref封装的值，而非更改这个变量对ref对象本身的引用。这意味着无论何时result的内容变化，只要你通过suggestList.value赋值，suggestList始终保持响应式

```
通过toRefs()方法把reactive的代码转换成ref形式。

#### vue3中生命周期函数，选项式和组合式的区别

1. 组合式中是没有beforeCreate和created这两个生命周期
因为本身在组合式中默认就在created当中，直接定义完响应式数据后就可以直接拿到响应式数据，所以不需要再有beforeCreate和created这两个钩子
2. 组合式的可以写多个，并且不会被覆盖

 方便不同的场景进行组合函数
```javascript
下面onMounted都可以执行
///script>
import { onMounted, ref } from 'vue';
let count = ref(0);
onMounted(()=>{
  console.log( person.value );
});
onMounted(()=>{
  console.log( count.value );
});
onMounted(()=>{
  console.log( message.value );
});
////script>
```
#### ///router-view>页面上怎么实现通过点击button按钮路由跳转

1. 在按钮上绑定点击事件，通过编程式进行跳转
2. 使用///router-view>的custon 加上插槽v-slot进行跳转
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35586778/1683280151673-e187695f-04ce-4033-a090-9c810879fd14.png#averageHue=%23ebe6da&clientId=u5c898a8e-1390-4&from=paste&height=188&id=uc3058c6e&originHeight=235&originWidth=1070&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=187290&status=done&style=none&taskId=u26f0a5db-f508-408e-99e7-38762ff258e&title=&width=856)
#### Vue的hash和history，跳转路由之后，点击浏览器返回，这两种有什么不同？
#### Vue3路由传参的方式有几种？

1. query方式(显式)
1. 通过///router-view>的to 路径+?key=value&key=value进行传递
    通过$route.query进行获取
2. 通过name的方式
    需要在路由表中添加name属性
    通过///router-view>的 :to = { name:'bar', query: { username: 'xiaobai'} }进行传递
    通过$route.query进行获取
2. params方式(显式)
1. 动态路由方式
    需要在路由表的path路径上使用:id  在to上面写上对应的值
   通过$route.params进行获得值
3. params方式(隐式)
 1. 通过name的方式，但是 query换成params
      通过params的方式进行获取
    url上是没有，传递的参数的并且刷新之后$route.params也获取不到了
#### Vue2路由传参的方式有几种？
声明式跳转传参
编程式跳转传参

      - 以字符串的形式传参this.$router.push('/register?name=淞&age=2')
通过$route.query接受
      - 以path对象的形式传参
通过$route.query接受
      - 以name的形式传参 
通过$route.query接受
通过$route.params接受
```
this.$router.push({
    path:'/register',
    query:{
        name:'淞',
        age:'18'
    }
})
```

```
this.$router.push({
    name:'list',
    query:{
        id:666
    }
})

this.$router.push({
    name:'list',
    params:{
        id:666
    }
})
刷新会消失
```

#### vue3 route对象和router对象的区别

1. route  (获取路由信息)  $route.params
**只针对当前的路由**
router 调用路由方法   $router.push()
**针对所有的路由**



#### Vue3 路由守卫有哪些？运用场景？

1. 全局前置守卫    router.beforeEach
2. 全局解析守卫    router.beforeResolve
3. 全局后置钩子    router.afterEach
4. 路由独享的守卫  beforeEnter   

```javascript
  {
    path: 'foo/:id',
    name: 'foo',
    component: Foo,
    meta: { auth: true },
    beforeEnter(to, from, next){
      if(to.meta.auth){
        next('/');
      }
      else{
        next();
      }
    } 
},
```

5. 组件内的守卫
- beforeRouteEnter
- beforeRouteUpdate
- beforeRouteLeave



#### 为什么使用router.addRoutes动态添加路由，需要把404放在最后？

2023/7/25   huawei

```js
1. 由于Vue Router匹配路由时是按照路由配置的先后顺序进行的
2. 如果404页面的路由配置在静态路由最后面，
   而后面的所有页面的路由配置都是动态添加的，那么这些动态添加的路由实际上都会被先匹配到404页面，而不会展示其    原本的页面内容。
```



#### Vuex中action的return promise写法

2023/7/25   huawei

```js
1. 为什么return promise？
方便使用.then，.catch链式调用,更优雅的进行正确或错误的处理

对象结构 + return promise   =  优雅的写法
login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
            const { data } = response
            commit('SET_TOKEN', data.token)
            setToken(data.token)
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
},
```



#### vue3 Vuex的状态持久化，这么做？
 1. 采用传统方法在修改state的地方都进行持久化的处理
 2. 采用插件** vuex-persist**库 
#### vue3中vuex和pina的区别？pina的优势有些？

2023/7/24 huawei

定义：Vuex中的数据只在内存中保存，并不会被永久存储在浏览器中，因此当用户刷新页面或关闭浏览器时，Vuex的数据会丢失，重新变成初始状态

1. pina的action即可写同步也可写异步的代码，vuex需要分开
2. pina没有module模块，相比vuex书写更为方便
3. pina对vue3的兼容更好，对ts的支持更好
#### Vue3 中组合式api怎么定义组件，获得路由，使用vuex

1. 定义组件
```javascript
import { defineComponent } from 'vue';
defineComponent({
  name: 'CompositionView'
});
```

2. 获得路由
```javascript
import { useRoute, useRouter } from 'vue-router'
const route = useRoute();
const router = useRouter();
console.log( route.meta );
console.log( router.getRoutes() );
```

3. 使用vuex
```javascript
import { useStore } from 'vuex'
console.log( store.state.count );
console.log( store.state.message.msg );
```

#### Vue中style的scoped属性

2023/7/17 huawei

1. 只会应用于当前组件的根元素及其子组件，无法直接影响**动态生成的通知组件**
   要想更改动态生成的dom结构
   - 使用全局样式
   - 自定义主题: 覆盖element-ui样式的文件



#### Vue中:key的巧用

2023/7/24  huawei

1. different router the same component vue
   例如创建和编辑的页面，使用的是同一个component,默认情况下当这两个页面切换时并不会触发vue的created或者mounted钩子

   ```js
   1. 通过watch $route的变化来做处理(麻烦，官网建议)
   2.  router-view上加上一个唯一的key，保证路由切换时都会重新渲染触发钩子（好的写法）
   ///router-view :key="key">////router-view>
   computed: {
       key() {
           return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
       }
    }
   ```

2. 国际化组件不立即刷新



#### Vue中的*v-on*="$listeners"的用法

定义：将父组件中的所有监听器传递给子组件
           当你希望子组件在必要时将事件传递给其父组件，而无需明确指定每个事件时

```js
///!-- ParentComponent.vue -->
///template>
  ///div>
    ///h2>父组件////h2>
    ///button @click="handleClick">点击我！////button>
    ///ChildComponent v-on="$listeners" />
  ////div>
////template>

///script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent,
  },
  methods: {
    handleClick() {
      console.log('父组件中的点击事件被触发！');
    },
  },
};
////script>


///!-- ChildComponent.vue -->
///template>
  ///div>
    ///h3>子组件////h3>
    ///button @click="handleClick">触发父组件点击事件////button>
  ////div>
////template>

///script>
export default {
  methods: {
    handleClick() {
      console.log('子组件中的点击事件被触发！');
      this.$emit('click'); // 触发名为 "click" 的自定义事件
    },
  },
};
////script>

//  当你在子组件中点击"触发父组件点击事件"按钮时，handleClick方法会被触发，控制台会打印出"子组件中的点击事件被触发！"，同时通过this.$emit('click')语句，子组件会触发一个名为"click"的自定义事件。
```

#### Transition和TransitionGroup的用法

2023/8/10  huawei

- Transition
  - 定义：会在一个元素或组件进入和离开 DOM 时应用动画
- TransitionGroup
  - 定义：会在一个 `v-for` 列表中的元素或组件被插入，移动，或移除时应用动画

#### Vue3的component响应式

```js
import Product from "./views/ProductQuery.vue"
componentToRender.value = Product
// 控制台会警告，Vue组件本身已经是响应式的，再次使它们变为响应式是多余的，并且可能会导致性能问题。

提供的解决方案：
markRaw：这个函数可以用来标记一个组件，以便Vue不尝试将其变为响应式。它告诉Vue将组件视为一个普通对象，不应该追踪它的响应性变化
shallowRef：与ref不同，ref会使其值深度响应式，shallowRef只追踪对象顶层的响应性。这是一种告诉Vue的方式，即对象应该是响应式的，但其嵌套属性的变化不应该触发更新。

在你的Vue代码中，你应该避免将组件传递到响应式系统中
```

#### 组件循环依赖问题

```js
子组件里面用父组件，父组件里面用子组件（本质：两个JS模块相互依赖的问题，形成环状结构的问题）

A.js
import B from B.js
console.log(’A模块‘, B)
export default ’A‘

B.js
import A from A.js
console.log(’B模块‘, A)
export default ’B‘

main.js
import A.js

// 打印结果，发现console.log(’B模块‘, A)  ==>  undefined
// 因为运行顺序是A 然后 B 其中打印的时候A还未运行完，所以undefined， B运行完再进入A中，就能找到B


组件也会存在这种问题：
解决方案：
1. 在生命周期，beforeCreate 中去引入组件
   this.$options.components.ProductInfo = require('./B.vue').default
2. 使用组件注册的时候使用动态导入
   components: {
       B: () => import('./B.vue')
   }
3. 使用全局注册组件，依赖就断开了

```

#### vue3的proxy效率高于vue2的defineProperty

```js
1. vue2的defineProperty是对属性的监听，所以需要深度遍历每一个属性, 
    缺点，新增属性无法响应（根本原因新增未受到监听）
   vue3的proxy直接监听整个对象，对象套对象不会立即运行，只有取的时候才会运行 增加属性，也能监听到
2.  defineProperty本身就是一个基本操作不能对一些动作拦截（例如：针对数组 拦截不到）所以vue2中间夹了一    层重新定义了原型上的push、shift等方法
   vue3可以直接拦截数组push，leng属性也能拦截到
   
   
   // 简单模拟vue的运行
     function _isObject(v) {
         return typeof v === 'Object' && v != null
      }
      // vue2的源码中定义了一个observe函数
      function observe(obj) {
         for (const k in obj) {
            let v = obj[k]
            Object.defineProperty(obj, k, {
               get() {
                  console.log(k, '读取')
                  return v
               },
               set(val) {
                  if (val !== v) {
                     console.log(k, '更改')
                     v = val
                  }
               }
            })
            if (_isObject) {
               observe(v)
            }
         }
      }
      observe(obj)
      obj.c.b = 3


      // vue3直接监听整个对象，加属性，也能监听到
      const proxy = new Proxy(obj, {
         get(target, k) {
            let v = target[k]
            console.log(k, '读取1')
            return v
         },
         set(target, k, value) {
            let v = target[k]
            if (value !== v) {
               target[k] = value
               console.log('k', '更改1')
            }
         },
         defineProperty() {

         }
      })
      proxy.a
      // vue3监听的是对象，而不是一个个属性，所以不存在新增属性丢失响应式的问题
      function observe(obj) {
         const proxy = new Proxy(obj, {
            get(target, k) {
               let v = target[k]
               // 一开始不会运行，只有取的时候才会，运行
               if (_isObject) {
                  observe(v)
               }
               console.log(k, '读取1')
               return v
            },
            set(target, k, value) {
               let v = target[k]
               if (value !== v) {
                  target[k] = value
                  console.log('k', '更改1')
               }
            },
            defineProperty() {

            }
         })
      }
```

#### vue响应式的本质

```js
错误理解：数据变化，界面刷新

正确理解：
  函数和数据关联（数据变化，运行函数）
  
  函数（被监控的函数）
  vue2：watcher
  vue3：effect
  例如：render（模板渲染）
       watchEffect
       computed
       watch
       
  数据：
       响应式数据
       必须在函数中用到
       
       
例子1：
///template>
   ///h4>{{ count }}////h4>
   ///h4>双倍{{ doubleTestNum }}////h4>
////template>
///script setup>
import { ref } from 'vue'
const props = defineProps({
   count: Number
})
const doubleCount = ref(props.count * 2)

count为什么变化？
产生关联, 只要其中的任何一个数据发生变化，render函数就会运行
function render () {
   props.count
   doubleCount.value
}
doubleCount为什么不变化？
ref不是被监控的函数
props.count变化不会重新运行函数，所以doubleCount
不会变化
const doubleCount = ref(props.count * 2)


例子2：
const doubleCount = ref(0)
watchEffect(() => {
   console.log('watchEffect')
   doubleCount.value = props.count * 2
})
props.count，doubleCount.value都会一起变化？
watchEffect与props.count产生了关联，导致doubleCount.value重新赋值
所以render与props.count产生关联，所以页面的doubleCount.value有变化


例子3：
doubleCount不会变化，因为count不是响应式了，相当于传进去了0
function useDouble(count) {
   const doubleCount = ref (count * 2)
   watchEffect(() => {
      console.log('watchEffect')
      doubleCount.value = count * 2
   })
   return doubleCount
}
const doubleCount = useDouble(props.count)

改进措施，将pros传进去
function useDouble(props) {
   const doubleCount = ref (props.count * 2)
   watchEffect(() => {
      console.log('watchEffect')
      doubleCount.value = props.count * 2
   })
   return doubleCount
}
const doubleCount = useDouble(props)

例子4：
可以，因为computed是被监控的函数
const doubleCount = computed(() => props.count * 2)

```



#### 组件上用v-model的缺点以及改进

```js
///!-- 父组件 -->
///template>
  ///CustomInput v-model="inputValue" />
////template>

///!-- 子组件 -->
///template>
  ///input v-model="modelValue.key"/>
////template>

问题点：子组件通过v-model直接修改了父组件的值，违背了单项数据流

解决方案1：子组件，将v-model换成:modelValue 绑定相应事件抛出emit 事件'update:modelValue'
         （笨拙，代码太多）
解决方案2:利用computed计算属性
        利用set和get
         ///!-- 子组件 -->
         ///template>
            ///input v-model="key"/>
         ////template>
        const key = computed({
            get(){
               return props.modelValue.key
            },
            set(val) {
               emit('update:modelValue', {
                  ...props.modelValue,
                  key:val
               })
            }
        })
        (缺点：每个都要写一次好麻烦)

解决方案3：将整个属性弄成computed属性 , 但是发现set无法触发，所以采用proxy代理整个对象

const emit = defineEmits(['update:modelValue'])
const model = computed({
    get(){
        const proxt = new Proxy(props.modelValue, {
            get(target, key){
                return Reflect.get(target, key)
            },
            set(target, key), value) {
                emit('updated:modelValue', {
                    ...target,
                    [key]: value
                })
                return true
            }
        })
        return proxy
    },
    set(val){
       emit('updated:modelValue', {
           ...target,
           [key]: value
       })                   
    }
})
// 最后可以做成hook，参数为pros,modelValue,emit 每个组件都能这么使用
```

#### vue插槽的本质

```js
插槽是传给组件的对象，key是插槽名，value是函数,返回值就是插槽内容
{
    default: function(){},
    slot1: function(){},
    slot2: function({msg}){},
}

// 下面是简单实例
    ///testComponent>
         ///p> default slot ////p>
         ///template #slot1>
            ///p> slot1 ////p>
         ////template>
         ///template #slot2 = "{msg}">
            ///p> slot2: {{msg}} ////p>
         ////template>
      ////testComponent>

testcomponent.vue 最终都会转化成 testcomponent.js
import {createElementVNode} from 'vue'
export default {
   setup(props, {slots}){
      const defaultVnodesSlots = slots.default()
      const defaultVnodesSlot1 = slots.slot1()
      const defaultVnodesSlot2 = slots.slot2({
         msg: 'helli'
      })
      return () => {
         return createElementVNode('div', null, [...defaultVnodesSlots,...defaultVnodesSlot1,...defaultVnodesSlot2])
      }
   }
}
```

#### setup语法糖的作用

```js
本质：vue3 api中expose的使用

两个相同的组件，一个用setup书写，一个用setup语法糖的形式书写
通过ref获取他们的组件实例，发现setup上有很多属性，setup语法糖什么都没有，
通过编译结果得知，是expose造成的，

setup语法糖形式，能够组件单项数据流，即不通过父组件去改变子组件的值，
当然如果有需要，可以通过
defineExpose（只参与编译，不参加运行，所以不需要导入）
类似defineProps（只参与编译，不参加运行，所以不需要导入）
```

#### Vue3的v-memo

<Playground :files="vueContext.memo"/> 


