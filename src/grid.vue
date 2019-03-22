<template>
    <div 
        @mousedown="mousedown"
        @mousemove="mousemove"
        @mouseup="mouseup"
        class="alt-grid-container" 
        :class="operatorClass"
        :style="containerStyle">
        <div 
            :style="getCardStyle(placeholder)"
            class="alt-grid-item-drag-placeholder">
        </div>
        <div 
            v-for="(item, index) in layout"
            :key="index"
            :dg-id="index"
            :style="item.style"
            class="alt-grid-item">
            itemitem
            <span class="alt-grid-item-resize-handler"></span>
        </div>
    </div>
</template>

<script>
    import { deepCopy, hasClass, findParentThoughEvtPath } from './utils/util';
    import watchBoxSize from './utils/watch-box-size.js'
    import Coordinate from './utils/coordinate'
    import coorTest from './utils/coordinate.test.js'
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
                cacheComputed: {},
                placeholder: null, // 拖拽的placeholder
                operator: 0, // 当前操作状态，0 - 无操作，1 - 拖拽， 2 - 缩放
                operatedItem: null, // 当前被操作的元素的状态
                containerWidth: 0,
                boxWatchHandler: null,
                coors: null,
                reRenderCount: 0,
                timer: null,
                animation: null,
                animationHandler: null
            }
        },
        mounted: function () {
            this.initCols();
            this.boxWatchHandler = new watchBoxSize(this.$el, () => {
                this.initCols();
            })
        },
        destroyed(){
            this.boxWatchHandler.destroy();
        },
        watch: {
            rowHeight(val, oldVal){
                console.log('row height change: %d -> %d', oldVal, val);
                this.reRenderCount++;
            },
            colNum(){
                console.log('change col number');
                this.initCols();
            },
            cols(){
                console.log('cols change');
                this.cacheComputed = {};
                this.$nextTick(() => {
                    this.layout.forEach((item) => {
                        let style = this.getCardStyle(item);
                        this.$set(item, 'style', style);
                        // item.style = style;
                    })
                })
            },
            reRenderCount(){
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.layout.forEach((item) => {
                        let style = this.getCardStyle(item);
                        this.$set(item, 'style', style);
                        // item.style = style;
                    })
                }, 10);
            },
            margin(){
                this.cacheComputed = {};
                this.$nextTick(() => {
                    this.layout.forEach((item) => {
                        let style = this.getCardStyle(item);
                        this.$set(item, 'style', style);
                        // item.style = style;
                    })
                })
            }
        },
        computed: {
            containerStyle(){
                return {
                    height: this.containerHeight + 'px'
                }
            },
            operatorClass(){
                return this.operator ? 'alt-grid-container-operating' : '';
            }
        },
        methods: {
            // 初始化每个列宽
            initCols(){
                console.log('init cols');
                let containerWidth = this.$el.clientWidth;
                if(this.colNum === this.cols.length &&
                    this.containerWidth && 
                    this.containerWidth === containerWidth){
                    return;
                }
                this.containerWidth = containerWidth;
                let colNum = this.colNum;
                let cols = [];
                // let containerWidth = this.$el.clientWidth;
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
                this.cols = cols;
            },
            // 设置布局layout数组
            setLayout(layout){
                // this.layout = deepCopy(layout);
                // this.layout = layout;
                console.log(deepCopy)
                if(!this.coors){
                    this.coors = new Coordinate();
                }
                this.coors.batchAddItem(layout);
                
                this.layout = this.coors.getAllItems();

                if(/_env=dev/.test(window.location.search)){
                    coorTest(this, this.layout);
                }
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
                if(!item) return {};
                let x = this.computeColsWidth(0, item.x);
                let w = this.getCardWidth(item.x, item.x + item.w);
                let y = item.y * this.rowHeight;
                let h = item.h * this.rowHeight - this.margin[1];
                this.setContainerHeight(y, h);
                return `transform: translate3d(${x}px,${y}px,0);width:${w}px;height:${h}px;`;
                // return {
                //     transform: `translate(${x}px,${y}px)`,
                //     width: w + 'px',
                //     height: h + 'px'
                // }
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
            computeRowsHeight(start, end){
                return (end - start) * this.rowHeight;
            },
            mousedown(evt){
                let target = evt.target;
                let targetCard = findParentThoughEvtPath(evt.path, 'alt-grid-item', 'alt-grid-container');
                if(hasClass(target, this.resizeHandlerClass)){
                    this.operator = 2; // resize
                    targetCard.style.zIndex = 1;
                }
                if(targetCard && !this.operator){
                    this.operator = 1; // 拖拽
                }
                if(!targetCard && !this.operator) return;
                // if(!hasClass(target, 'alt-grid-item')) return;
                let node = this.getNode(targetCard);
                let targetCardStyle = targetCard.style;
                let translate = targetCardStyle.transform.match(/\((\d*)px, (\d*)px/);
                this.operatedItem = {
                    el: targetCard,
                    node: node,
                    startX: evt.clientX,
                    startY: evt.clientY,
                    cacheStyle: {
                        x: parseInt(translate[1]),
                        y: parseInt(translate[2]),
                        w: parseInt(targetCardStyle.width.match(/\d+/)[0]),
                        h: parseInt(targetCardStyle.height.match(/\d+/)[0]),
                    }
                }

                this.placeholder = {
                    x: node.x,
                    y: node.y,
                    w: node.w,
                    h: node.h
                };
                // console.log('down', evt, this.operatedItem);
                // if(hasClass(target, this.resizeHandlerClass)){
                //     this.operator = 2;
                // } else {
                //     this.operator = 1;
                // }
            },
            mousemove(evt){
                if(!this.operator) return;
                console.log('mouse move');
                let ex = evt.clientX;
                let ey = evt.clientY;
                let sx = this.operatedItem.startX;
                let sy = this.operatedItem.startY;
                if(this.operator === 1){
                    this.dragMove(this.operatedItem, sx, sy, ex, ey);
                } else if(this.operator === 2){
                    this.resizeMove(this.operatedItem, sx, sy, ex, ey);
                }
            },
            mouseup(evt){
                console.log('up', evt);
                let item = this.operatedItem;
                if(item){
                    // item.node.x = this.placeholder.x;
                    // item.node.y = this.placeholder.y;
                    // let x = this.computeColsWidth(0, item.node.x);
                    // let y = item.node.y * this.rowHeight;
                    // item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

                    if(this.operator === 1){
                        item.node.x = this.placeholder.x;
                        item.node.y = this.placeholder.y;
                    }else if(this.operator === 2){
                        item.node.w = this.placeholder.w;
                        item.node.h = this.placeholder.h;
                    }
                    item.el.style = this.getCardStyle(item.node);

                    this.coors.removeItem(this.placeholder);
                    this.coors.addItem(this.operatedItem.node);
                }
                
                this.operator = 0;
                this.operatedItem = null;
                this.placeholder = null;
            },
            getNode(target){
                return this.layout[target.getAttribute('dg-id')]
            },
            dragMove(item, sx, sy, ex, ey){
                console.log('drag move');
                let node = this.placeholder;
                let dx = ex - sx;
                let dy = ey - sy;
                let stepX = this.getMoveCols(dx, item.node.x);
                let stepY = this.getMoveRows(dy, item.node.y);
                console.log('calc over step');
                this.coors.moveItemTo(node, {
                    x: item.node.x + stepX,
                    y: item.node.y + stepY
                })
                node.x = item.node.x + stepX;
                node.y = item.node.y + stepY;
                let x = item.cacheStyle.x + dx;
                let y = item.cacheStyle.y + dy;
                item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                this.reRenderCount++;
                console.log('reRenderCount', this.reRenderCount);
                // if(this.reRenderCount === 20) debugger;
            },
            resizeMove(item, sx, sy, ex, ey){
                console.log('resize move');
                let node = this.placeholder;
                let dx = ex - sx;
                let dy = ey - sy;
                let stepX = this.getMoveCols(dx, item.node.x + item.node.w);
                let stepY = this.getMoveRows(dy, item.node.y + item.node.h);
                this.coors.resizeItem(node, {
                    w: item.node.w + stepX,
                    h: item.node.h + stepY
                })
                node.w = item.node.w + stepX;
                node.h = item.node.h + stepY;
                let w = item.cacheStyle.w + dx;
                let h = item.cacheStyle.h + dy;
                item.el.style.width = w + 'px';
                item.el.style.height = h + 'px';
                this.reRenderCount++;
                console.log('reRenderCount', this.reRenderCount);
            },
            getMoveCols(dx, startCol){
                if(startCol <= 0 && dx < 0) return 0;
                console.log('get move cols: %d; startCol: %d', dx, startCol);
                let flag = dx < 0 ? '-' : '+';
                let absDx = Math.abs(dx);
                if(absDx < 15) return 0;
                let i = 0;
                let c = startCol;
                while(absDx > 0){
                    console.log('absDx: %d; col: %d;', absDx, c);
                    absDx -= (this.cols[c - 1] || 0);
                    c--;
                    i++;
                    if(c <= 0) break;
                }
                return parseInt(flag + i);
            },
            getMoveRows(dy, startRow){
                if(startRow <= 0 && dy < 0) return 0;
                console.log('get move rows: %d; startRow: %d', dy, startRow);
                let flag = dy < 0 ? '-' : '+';
                let absDy = Math.abs(dy);
                if(absDy < this.rowHeight/2) return 0;
                let i = 0;
                let row = startRow;
                while(absDy > 0){
                    console.log('absDy: %d; row: %d', absDy, row);
                    absDy -= this.rowHeight;
                    i++;
                    row--;
                    if(row <= 0) break;
                }
                return parseInt(flag + i);
            },
            addItem(item){
                if(this.coors){
                    let distributeItem = this.coors.addItem(item);
                    this.layout.push(distributeItem);
                    this.reRenderCount++;
                }
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
.alt-grid-item-drag-placeholder{
    position: absolute;
    width: 0;
    height: 0;
    background: red;
}
.alt-grid-container-operating{
    user-select: none;
}
</style>
