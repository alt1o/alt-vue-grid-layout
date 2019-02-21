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
            :is-draggable="getPropsValue(item.isDraggable, isDraggable, defVal.isDraggable)"
            :is-resizable="getPropsValue(item.isResizable, isResizable, defVal.isResizable)"
            :min-h="item.minH || defVal.minH"
            :max-h="item.maxH || defVal.maxH"
            :min-w="item.minW || defVal.minW"
            :max-w="item.maxW || defVal.maxW"
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

    import { deepCopy, isNil } from './utils/util';

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
            margin: {
                type: Array,
                default: () => [10, 10]
            }, // 元素的右边距和下边距
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
            backgroundColor: {
                type: String,
                default: 'rgba(200,200,200,1)'
            }
        },
        data () {
            return {
                layout: [], // 布局源数据
                defVal: {
                    minH: 1,
                    minW: 1,
                    // maxH: Infinity,
                    maxH: 4,
                    maxW: 4,
                    isDraggable: true,
                    isResizable: true
                }
            }
        },
        mounted: function () {
            this.index = this.layout.length;
        },
        methods: {
            getPropsValue(itemValue, globalValue, defaultValue){
                if(!isNil(itemValue)) return itemValue;
                if(!isNil(globalValue)) return globalValue;
                return defaultValue;
            },
            setLayout(layout){
                this.layout = deepCopy(layout);
            },
            // 关闭组件
            closeWidget: function(index) {
                this.layout.splice(index, 1);
            },
            addItem: function(opts) {
                let defOpts = {
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    i: this.index + ''
                }
                let item = Object.assign(defOpts, opts);
                this.index++;
                this.layout.push(item);
            },
            move: function(item){
                this.$emit('move', item);
            },
            resize: function(item, newSize){
                this.$emit('resize', item, newSize);
            },
            moved: function(item){
                this.$emit('moved', item);
            },
            resized: function(item, newSize){
                this.$emit('resized', item, newSize);
            }
        },
    }
</script>
