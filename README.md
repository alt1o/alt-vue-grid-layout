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
- | - | - 
isDraggable | Boolean类型，是否支持拖拽布局，true - 支持，false - 不支持 | true
isResizable | Boolean类型，是否支持拖拽控制元素大小，true - 支持，false - 不支持 | true
margin | Array类型，如 [3, 3]，设置可拖拽模块左侧和下侧间距，最小值为[2, 2]，表示没有间距 | [10, 10]
verticalCompact | Boolean类型，设置垂直方向是否自动忽略空白向上填充 | true
useCssTransforms | Boolean类型，是否使用css的transform属性 | true
colNum | Number类型，栅格列数 | 12
rowHeight | Number类型，每一行的高度 | 150
maxRows | Number类型，设置布局设计器最大行数 | Infinity
dragIgnoreFrom | String类型，css-like，匹配的元素上不会触发拖拽事件 | 'a, button'
dragAllowFrom | String类型，css-like，匹配的元素上会触发拖拽事件 | 'a, button'
resizeIgnoreFrom | String类型，css-like，匹配的元素上不会触发resize事件 | 'a, button'
backgroundColor | String类型，css-like，设置所有卡片的背景颜色和透明度 | 'rgba(255,255,255,0.5)'
