<template>
    <grid-layout
        :layout.sync="layout"
        :row-height="rowHeight"
        :is-draggable="isDraggable"
        :is-resizable="isResizable"
        :vertical-compact="verticalCompact"
        :use-css-transforms="useCssTransforms"
        :col-num="colNum"
        :margin="margin">
        <grid-item v-for="(item, index) in layout" :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :item="item"
            :draggable="item.draggable"
            :resizable="item.resizable"
            :style="{backgroundColor: backgroundColor}"
            @resize="resize"
            @move="move"
            @resized="resized"
            @moved="moved">
            <button @click="closeWidget(index)">关闭</button>
            <component :is="item.type" :item-info="item"></component>
        </grid-item>
    </grid-layout>
</template>

<script>
    import GridItem from './components/GridItem.vue';
    import GridLayout from './components/GridLayout.vue';

    import Widget from './components/Widget.vue';

    import { deepCopy } from './utils/util';

    export default {
        name: 'app',
        components: {
            // ResponsiveGridLayout,
            GridLayout,
            GridItem,
        },
        // 添加组件类型处理函数
        addWidgetType(type, widget){
            this.components[type] = {
                ...widget,
                extends: Widget
            }
        },
        props: {
            isDraggable: { // 是否可以拖拽
                type: Boolean,
                default: true
            },
            isResizable: { // 是否可以调整大小
                type: Boolean,
                default: true
            },
            rowHeight: { // 每行高度
                type: Number,
                default: 150
            },
            maxRows: { // 最大
                type: Number,
                default: Infinity
            },
            margin: [10, 10], // 元素的右边距和下边距
            verticalCompact: { // 是否自动向上填充
                type: Boolean,
                default: true
            },
            useCssTransforms: { // 是否使用css transforms
                type: Boolean,
                default: true
            },
            colNum: { // 列数
                type: Number,
                default: 12
            },
            dragIgnoreFrom: { // 在这些元素上不会触发拖拽事件
                type: String,
                default: 'a, button'
            },
            dragAllowFrom: { 
                type: String,
                default: 'a, button'
            },
            resizeIgnoreFrom: {
                type: String,
                default: 'a, button'
            },
            backgroundColor: {
                type: String,
                default: 'rgba(255,255,255,1)'
            }
        },
        data () {
            return {
                layout: [], // 布局源数据
            }
        },
        mounted: function () {
            this.index = this.layout.length;
        },
        methods: {
            setLayout(layout){
                this.layout = deepCopy(layout);
            },
            // 关闭组件
            closeWidget: function(index) {
                this.layout.splice(index, 1);
            },
            addItem: function() {
                // let self = this;
                //console.log("### LENGTH: " + this.layout.length);
                let item = {"x":0,"y":0,"w":2,"h":2,"i":this.index+"", whatever: "bbb"};
                this.index++;
                this.layout.push(item);
            },
            move: function(item){
                // console.log("MOVE i=" + item.i + ", X=" + item.x + ", Y=" + item.y);
                this.$emit('move', item);
            },
            resize: function(item, newSize){
                // console.log("RESIZE i=" + item.i + ", H=" + item.h + ", W=" + item.w + ", H(px)=" + newSize.height + ", W(px)=" + newSize.width);
                this.$emit('resize', item, newSize);
            },
            moved: function(item){
                // console.log("### MOVED i=" + item.i + ", X=" + item.x + ", Y=" + item.y);
                this.$emit('moved', item);
            },
            resized: function(item, newSize){
                // console.log("### RESIZED i=" + item.i + ", H=" + item.h + ", W=" + item.w + ", H(px)=" + newSize.height + ", W(px)=" + newSize.width);
                this.$emit('resized', item, newSize);
            }
        },
    }
</script>
