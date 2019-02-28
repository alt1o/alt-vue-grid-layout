# vue拖拽布局设计器

**基于大神作品的二次开发[https://github.com/jbaysolutions/vue-grid-layout/](https://github.com/jbaysolutions/vue-grid-layout/)**

## 使用方法
```html
<div>
    <grid ref="grid"></grid>
</div>
```
```js
import VueGrid from 'alt-vue-grid-layout'
 
let Grid = VueGrid.createGrid()
let layout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0"},
    {"x":2,"y":0,"w":2,"h":4,"i":"1"},
    {"x":4,"y":0,"w":2,"h":5,"i":"2"},
    {"x":6,"y":0,"w":2,"h":3,"i":"3"},
    {"x":8,"y":0,"w":2,"h":3,"i":"4"}
]
 
new Vue({
    components: {
        Grid
    },
    mounted(){
        this.$refs.grid.setLayout(layout)
    }
}
```

## 全局配置属性
属性 | 说明 | 默认值
-- | -- | --
isDraggable | Boolean类型，是否支持拖拽布局，true - 支持，false - 不支持 | true
isResizable | Boolean类型，是否支持拖拽控制元素大小，true - 支持，false - 不支持 | true
margin | Array类型，如 [3, 3]，设置可拖拽模块左侧和下侧间距，最小值为[2, 2]，表示没有间距 | [10, 10]
verticalCompact | Boolean类型，设置垂直方向是否自动忽略空白向上填充 | true
useCssTransforms | Boolean类型，是否使用css的transform属性 | true
colNum | Number类型，栅格列数 | 12
rowHeight | Number类型，每一行的高度 | 150
maxRows | Number类型，设置布局设计器最大行数 | Infinity
backgroundColor | String类型，css-like，设置所有卡片的背景颜色和透明度 | 'rgba(255,255,255,0.5)'
gridItemClass | String类型，统一设置卡片的自定义class | ''
closeHandlerClass | String类型，统一设置关闭按钮的class | ''
resizeHandlerClass | String类型，统一设置 拖拽大小的class | ''
placeholderClass | String类型，统一设置占位符的class | ''
isShowOriginCloseBtn | Boolean类型，统一设置是否显示自带的关闭按钮，可以使用注册组件的this.close()来关闭组件 | true

## 方法

* `addWidgetType`注册组件类型
    1. 注册单个组件: addWidgetType(name, widget)
        * 参数:
            * {String} name
            * {Object} widget
        * 用法:
            通过layout中每一项的type类型，从注册的组件中渲染对应组件
        * 示例:
            ```javascript
            import VueGrid from 'alt-vue-grid-layout'
            import Type1 from './Type1.vue';
 
            let Grid = VueGrid.createGrid()

            Grid.addWidgetType('type1', Type1)
            let layout = [
                {x:0, y:0, w:2, h:2, i:"0", type:"Type1"}
            ]

            ```
    2. 批量注册组件: addWidgetType(typeMap)
        * 参数: 
            * {Object} typeMap
        * 用法:
            通过layout中每一项的type类型，从注册的组件中渲染对应组件
        * 示例:
            ```javascript
            import VueGrid from 'alt-vue-grid-layout'
            import Type1 from './Type1.vue';
            import Type2 from './Type2.vue';
 
            let Grid = VueGrid.createGrid()

            Grid.addWidgetType({
                type1: Type1,
                type2: Type2
            })
            let layout = [
                {x:0, y:0, w:2, h:2, i:"0", type:"Type1"},
                {x:0, y:0, w:2, h:2, i:"0", type:"Type2"}
            ]

            ```

## 实例方法

* setLayout(layout)
    * 参数:
        * {array} layout
            * {String} i
            * {Number} x
            * {Number} y
            * {Number} w
            * {Number} h
            * {Number} minH 可选，设置卡片最小高度
            * {Number} maxH 可选，设置卡片最大高度
            * {Number} minW 可选，设置卡片最小宽度
            * {Number} maxW 可选，设置卡片最大宽度
            * {Boolean} isDraggable 可选，设置卡片是否可拖拽位置
            * {Boolean} isResizable 可选，设置卡片是否可拖拽大小
            * {Boolean} isShowOriginCloseBtn 可选，设置卡片是否显示自带的关闭按钮
            * {String} gridItemClass 可选，单个卡片的class
            * {String} closeHandlerClass 可选，单个卡片关闭按钮的class
            * {String} resizeHandlerClass 可选，单个卡片拖拽大小的class
    * 用法:
        设置布局数组，卡片内部可以通过`this.close()`来关闭卡片

## 事件

* move(item) 移动任意卡片
    * 参数:
        * {Object} item 被移动的元素
* moved(item) 移动结束触发
    * 参数:
        * {Object} item 被移动的元素
* resize(item, newSize) 拖动设置大小
    * 参数:
        * {Object} item 被改变大小的元素
        * {Object} newSize 改变后的像素大小，{width: 20px, height: 30px}
* resized(item, newSize) 拖动设置大小
    * 参数:
        * {Object} item 被改变大小的元素
        * {Object} newSize 改变后的像素大小，{width: 20px, height: 30px}


## 组件
组件是一个Object，类vue对象结构，暂时不支持vue子类，如
```javascript
let type1 = {
    mounted(){
        console.log('mounted')
    }
}

```
组件内部支持vue的生命周期
### 组件事件
组件内部可以通过this.$on('eventName', fn)来监听事件
* move(item) 移动当前卡片
    * 参数:
        * {Object} item 当前元素
* moved(item) 移动结束触发
    * 参数:
        * {Object} item 当前元素
* resize(item, newSize) 拖动设置大小
    * 参数:
        * {Object} item 当前元素
        * {Object} newSize 改变后的像素大小，{width: 20px, height: 30px}
* resized(item, newSize) 拖动设置大小
    * 参数:
        * {Object} item 当前元素
        * {Object} newSize 改变后的像素大小，{width: 20px, height: 30px}

### 组件方法
组件内部可以通过`this.close()`来关闭当前组件

### 组件公共属性
组件内部可以通过`this.itemInfo`获取layout中当前组件的参数