<template>
    <grid-layout
        :layout.sync="layout"
        :row-height="rowHeight"
        :is-draggable="isDraggable"
        :is-resizable="isResizable"
        :vertical-compact="verticalCompact"
        :use-css-transforms="useCssTransforms"
        :col-num="colNum"
        :placeholder-class="placeholderClass"
        :margin="margin">
        <grid-item v-for="(item, index) in layout" :key="item.i" :class="[gridItemClass, item.gridItemClass]"
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
            :resize-handler-class="resizeHandlerClass"
            @resize="resize"
            @move="move"
            @resized="resized"
            @moved="moved">
            <button 
                v-if="getPropsValue(item.isShowOriginCloseBtn, isShowOriginCloseBtn, defVal.isShowOriginCloseBtn)"
                @click="closeWidget(index)" 
                :class="[closeHandlerClass, item.closeHandlerClass]">关闭</button>
            <component :is="item.type" :injected-props="getPropsForInject(index, item)"></component>
        </grid-item>
    </grid-layout>
</template>

<script>
    import GridItem from './components/GridItem.vue';
    import GridLayout from './components/GridLayout.vue';

    import WidgetRender from './components/Widget.render.vue';
    import WidgetTemplate from './components/Widget.template.vue';
    import WidgetComponent from './components/Widget.vuecomponent.vue';

    import { deepCopy, isNil, getVariType, getVue } from './utils/util';
    // import Vue from 'vue';
    let Vue = getVue();

    export default {
        name: 'app',
        components: {
            // ResponsiveGridLayout,
            GridLayout,
            GridItem,
        },
        addWidgetType(){
            let args0 = arguments[0];
            let type = getVariType(args0);
            if(type === 'string'){
                this._addWidgetType(...arguments);
            } else if(type === 'object'){
                for(let key in args0){
                    args0.hasOwnProperty(key) && this._addWidgetType(key, args0[key]);
                }
            }
        },
        // 添加组件类型处理函数
        _addWidgetType(type, widget){
            let parentWidget = widget.template ? WidgetTemplate : WidgetRender;
            if(widget.super == Vue){
                this.components[type] = widget.extend(WidgetComponent);
                return;
            }
            this.components[type] = {
                ...widget,
                extends: parentWidget
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
            backgroundColor: { // 背景颜色
                type: String,
                default: 'rgba(200,200,200,1)'
            },
            gridItemClass: { // 每一个卡片的class
                type: String,
                default: ''
            },
            closeHandlerClass: { // 关闭按钮的class
                type: String,
                default: ''
            },
            resizeHandlerClass: { // 设置大小按钮的class
                type: String,
                default: ''
            },
            placeholderClass: { // 拖拽时 placeholder 的class
                type: String,
                default: ''
            },
            isShowOriginCloseBtn: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                layout: [], // 布局源数据
                defVal: {
                    minH: 1, // 默认每个卡片的最小高度
                    minW: 1, // 默认每个卡片的最小宽度
                    maxH: Infinity, // 默认每个卡片的最大高度
                    maxW: Infinity, // 默认每个卡片的最大宽度
                    isDraggable: true, // 默认每个卡片是否支持拖拽
                    isResizable: true, // 默认每个卡片是否支持设置大小
                    isShowOriginCloseBtn: true // 是否显示默认的关闭按钮
                }
            }
        },
        mounted: function () {
            this.index = this.layout.length;
        },
        methods: {
            getPropsForInject(index, item){
                return {
                    index: index,
                    card: item,
                    close: this.closeWidgetFormItem.bind(this, index, item)
                }
            },
            // 从卡片内部关闭自身
            closeWidgetFormItem(index){
                this.closeWidget(index)
            },
            getPropsValue(itemValue, globalValue, defaultValue){
                if(!isNil(itemValue)) return itemValue;
                if(!isNil(globalValue)) return globalValue;
                return defaultValue;
            },
            // 设置布局layout数组
            setLayout(layout){
                this.layout = deepCopy(layout);
                // this.layout = layout;
            },
            // 获取布局layout数组数据
            getLayout(){
                return deepCopy(this.layout);
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
