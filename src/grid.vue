<template>
    <div 
        @mousedown="mousedown"
        @mousemove="mousemove"
        @mouseup="mouseup"
        class="alt-grid-container" 
        :style="containerStyle">
        <div 
            v-for="(item, index) in layout"
            :key="index"
            :style="getCardStyle(item)"
            class="alt-grid-item">
            itemitem
            <span class="alt-grid-item-resize-handler"></span>
        </div>
    </div>
</template>

<script>
    import { deepCopy, hasClass } from './utils/util';

    export default {
        name: 'app',
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
                default: 'alt-grid-item-resize-handler'
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
                },
                containerHeight: 0, // 容器高度
                cols: [],
                cacheComputed: {}
            }
        },
        mounted: function () {
            this.initCols();
        },
        watch: {
            rowHeight(val){
                this.cell.height = val;
            }
        },
        computed: {
            containerStyle(){
                return {
                    height: this.containerHeight + 'px'
                }
            }
        },
        methods: {
            // 初始化每个列宽
            initCols(){
                let colNum = this.colNum;
                let cols = this.cols;
                let containerWidth = this.$el.offsetWidth;
                let remainder = containerWidth % colNum; // 余数
                let quotient = Math.floor(containerWidth / colNum); // 商数
                for(let i = 0; i < colNum; i++){
                    if(remainder){
                        cols[i] = quotient + 1;
                        remainder--;
                    }else{
                        cols[i] = quotient;
                    }
                }
            },
            // 设置布局layout数组
            setLayout(layout){
                this.layout = deepCopy(layout);
                // this.layout = layout;
            },
            // 设置总容器高度
            setContainerHeight(y, h){
                let containerHeight = this.containerHeight;
                let height = y + h;
                if(height > containerHeight){
                    this.containerHeight = height;
                }
            },
            // 获取卡片大小和位移
            getCardStyle(item){
                let x = this.computeColsWidth(0, item.x);
                let w = this.getCardWidth(item.x, item.x + item.w);
                let y = item.y * (this.rowHeight + this.margin[1]);
                let h = item.h * (this.rowHeight + this.margin[1]) - this.margin[1];
                this.setContainerHeight(y, h);
                return {
                    transform: `translate(${x}px,${y}px)`,
                    width: w + 'px',
                    height: h + 'px'
                }
            },
            // 计算卡片的宽度
            getCardWidth(start, end){
                let width = this.computeColsWidth(start, end);
                if(end !== (this.cols.length)){
                    width -= this.margin[0];
                }
                return width;
            },
            // 计算某几列的宽度
            computeColsWidth(start, end){
                let key = start + ';' + end;
                if(this.cacheComputed[key]) return this.cacheComputed[key];
                let cols = this.cols;
                let width = 0;
                for(let i = start; i < end; i++){
                    width += cols[i];
                }
                this.cacheComputed[key] = width;
                return width;
            },
            mousedown(evt){
                console.log('down', evt);
                if(hasClass(evt.target, this.resizeHandlerClass)){
                    this.operater = 2
                } else {
                    this.operater = 1;
                }
            },
            mousemove(evt){
                if(this.operater){
                    console.log('move', evt);
                }
            },
            mouseup(evt){
                console.log('up', evt);
                this.operater = 0
            }
        }
    }
</script>

<style>
.alt-grid-container{
    position: relative;
    border: 1px solid red;
    box-sizing: border-box;
}
.alt-grid-container .alt-grid-item{
    position: absolute;
    background: gray;
}
.alt-grid-container .alt-grid-item:hover .alt-grid-item-resize-handler{
    display: block;
}
.alt-grid-container .alt-grid-item-resize-handler{
    display: none;
    position: absolute;
    width: 0;
    height: 0;
    right: 1px;
    bottom: 1px;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid #000;
    border-bottom: 5px solid #000;
    cursor: se-resize;
}
</style>
