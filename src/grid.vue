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
            class="alt-grid-item-drag-placeholder"
            :class="placeholderClass">
        </div>
        <div 
            ref="cards"
            v-for="(item, index) in layout"
            :key="index"
            :dg-id="item._id"
            :style="item.style"
            class="alt-grid-item"
            :class="[gridItemClass, gridItemClass, item.gridItemClass]">
            <button 
                v-if="getFirstSetValue(item.isShowOriginCloseBtn, isShowOriginCloseBtn, true)"
                :class="[closeHandlerClass, item.closeHandlerClass]" 
                @click="closeWidget(item._id)">关闭</button>
            <component :ref="item._id" :is="item.type" :injected-props="getPropsForInject(index, item)"></component>
            <span 
                v-if="getFirstSetValue(item.isResizable, isResizable, true)"
                class="alt-grid-item-resize-handler"
                :class="[resizeHandlerClass, item.resizeHandlerClass]"></span>
        </div>
    </div>
</template>

<script>
    import {
        hasClass,
        findParentThoughEvtPath,
        getFirstSetValue,
        getVue,
        getVariType,
        getIndexOfArrayByAttr
    } from './utils/util';
    import watchBoxSize from './utils/watch-box-size.js'
    import Coordinate from './utils/coordinate'
    import coorTest from './utils/coordinate.test.js'
 
    import WidgetRender from './components/Widget.render.vue';
    import WidgetTemplate from './components/Widget.template.vue';
    import WidgetComponent from './components/Widget.vuecomponent.vue';

    import altStoreFactory from './store.js'

    let Vue = getVue();

    export default {
        name: 'app',
        altStore: altStoreFactory(),
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
                default: 'alt-g-i-r-h-default-style'
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
                // console.log('row height change: %d -> %d', oldVal, val);
                // this.reRenderCount++;
                this.$altStore.commit('log', {
                    type: 'rowHeight',
                    action: {
                        oldVal: oldVal,
                        newVal: val
                    }
                })
            },
            colNum(val){
                // console.log('change col number');
                if(this.coors){
                    this.coors.setMaxWidth = parseInt(val);
                }
                this.initCols();
            },
            cols(){
                // console.log('cols change');
                this.cacheComputed = {};
                this.reRenderStyle();
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
                this.reRenderStyle();
            },
            backgroundColor(newVal, oldVal){
                // this.reRenderCount++;
                this.$altStore.commit('log', {
                    type: 'backgroundColor',
                    action: { oldVal,newVal }
                })
            },
            'reRenderCountTest.total'(){
                // console.log('reRenderCountTest.total');
                this.reRenderStyle();
            }
        },
        computed: {
            reRenderCountTest(){
                return this.$altStore.state.counter;
            },
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
            reRenderStyle(){
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.layout.forEach((item, index) => {
                        let card = this.$refs.cards[index];
                        let oldStyle = {
                            style: card.style,
                            w: card.style.width,
                            h: card.style.height,
                            transform: card.style.transform
                        };
                        if(oldStyle.transform){
                            oldStyle.transform = oldStyle.transform.replace(/\s/g, '');
                        }

                        let styleRaw = this.getCardStyle(item, true);

                        this.$set(item, 'style', styleRaw.style);
                        // item.style = style;
                        let status = this.getCardRectChangeStatus(oldStyle, styleRaw, ['w', 'h', 'transform']);
                        if(status === 'none') return;
                        this.dispatchEvent(index. status, {
                            w: item.w,
                            h: item.h,
                            x: item.x,
                            y: item.y
                        })

                        // console.log('create Style:', styleRaw, oldStyle, index);
                    })
                }, 10);
            },
            getCardRectChangeStatus(arg1, arg2, range){
                let keys = range || Object.keys(arg1);
                for(let i = 0, l = keys.length; i < l; i++){
                    let key = keys[i];
                    if(arg1[key] === arg2[key]){
                        if(key === 'w' || key === 'h'){
                            return 'move';
                        }
                        if(key === 'transform'){
                            return 'resize';
                        }
                    }
                }
                return 'none';
            },
            dispatchEvent(dragId, type, pos){
                this.$refs[dragId] && this.$refs[dragId][0].$emit(type, pos);
            },
            getFirstSetValue(){
                return getFirstSetValue(...arguments);
            },
            getPropsForInject(index, item){
                return {
                    id: item._id,
                    card: item,
                    close: this.closeWidget.bind(this, item._id)
                }
            },
            // 初始化每个列宽
            initCols(){
                // // // console.log('init cols');
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
                // // console.log(deepCopy)
                if(!this.coors){
                    this.coors = new Coordinate({
                        maxWidth: this.colNum
                    });
                }
                this.coors.clear();
                this.coors.batchAddItem(layout);
                
                let layoutOverCalc = this.coors.getAllItems();

                layoutOverCalc.forEach((item) => {
                    let style = this.getCardStyle(item);
                    this.$set(item, 'style', style);
                    // item.style = style;
                });

                this.layout = layoutOverCalc;

                this.$altStore.commit('log', {
                    type: 'setLayout'
                })

                this.$altStore.commit('addHistory', {
                    type: 'setLayout',
                    value: JSON.parse(JSON.stringify(this.layout))
                })

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
            getCardStyle(item, raw){
                if(!item) return {};
                let x = this.computeColsWidth(0, item.x);
                let w = this.getCardWidth(item.x, item.x + item.w);
                let y = item.y * this.rowHeight;
                let h = item.h * this.rowHeight - this.margin[1];
                this.setContainerHeight(y, h);
                let transform = `transform:translate3d(${x}px,${y}px,0);`;
                let style = `${transform}width:${w}px;height:${h}px;background-color:${this.backgroundColor};`;
                if(raw){
                    return { style, x, y, w, h, transform };
                }
                return style;
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
                if(!targetCard) return;
                let dragId = this.getDragId(targetCard);
                let node = this.getNodeByDragId(dragId);
                if(hasClass(target, this.resizeHandlerClass)){
                    if(!getFirstSetValue(
                        node.isResizable, 
                        this.isResizable, 
                        this.defVal.isResizable)){
                        return;
                    }
                    this.operator = 2; // resize
                    targetCard.style.zIndex = 1;
                }
                if(targetCard && !this.operator){
                    if(!getFirstSetValue(
                        node.isDraggable, 
                        this.isDraggable, 
                        this.defVal.isDraggable)){
                        return;
                    }
                    this.operator = 1; // 拖拽
                }
                if(!targetCard && !this.operator) return;
                // if(!hasClass(target, 'alt-grid-item')) return;
                
                let targetCardStyle = targetCard.style;
                let translate = targetCardStyle.transform.match(/\(([-.\d]*)px, ([-.\d]*)px/);
                this.operatedItem = {
                    el: targetCard,
                    node: node,
                    dragId: dragId,
                    linkEmit: this.$refs[dragId] ? this.$refs[dragId][0].$emit : function(){},
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
                // console.log('mouse move');
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
            mouseup(){
                // console.log('up', evt);
                let item = this.operatedItem;
                if(item){
                    // item.node.x = this.placeholder.x;
                    // item.node.y = this.placeholder.y;
                    // let x = this.computeColsWidth(0, item.node.x);
                    // let y = item.node.y * this.rowHeight;
                    // item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                    // let x = this.placeholder.x;
                    // let y = this.placeholder.y;
                    // let w = this.placeholder.w;
                    // let h = this.placeholder.h;
                    // let node = item.node;
                    this.applyChange();
                    
                    this.$set(item.node, 'style', this.getCardStyle(item.node));

                    this.coors.removeItem(this.placeholder);
                    this.coors.addItem(this.operatedItem.node);
                }

                this.clearDragEnv();

                this.$altStore.commit('addHistory', {
                    type: 'move or resize',
                    value: JSON.parse(JSON.stringify(this.layout))
                })
            },
            applyChange(){
                let x = this.placeholder.x;
                let y = this.placeholder.y;
                let w = this.placeholder.w;
                let h = this.placeholder.h;
                let dragId = this.operatedItem.dragId;
                let node = this.operatedItem.node;
                if(this.operator === 1){
                    if(node.x === x && node.y === y) return;
                    node.x = x;
                    node.y = y;
                    this.dispatchEvent(dragId, 'moved', {
                        x: x,
                        y: y,
                        w: node.w,
                        h: node.h
                    })
                }else if(this.operator === 2){
                    if(node.w === w && node.h === h)  return;
                    node.w = this.placeholder.w;
                    node.h = this.placeholder.h;
                    this.dispatchEvent(dragId, 'resized', {
                        x: node.x,
                        y: node.y,
                        w: w,
                        h: h
                    })
                }
            },
            clearDragEnv(){
                this.operator = 0;
                this.operatedItem = null;
                this.placeholder = null;
            },
            getNodeByDragId(dragId){
                let index = getIndexOfArrayByAttr(this.layout, dragId, '_id');
                if(index === -1) return null;
                return this.layout[index];
            },
            getDragId(target){
                return target.getAttribute('dg-id');
            },
            dragMove(item, sx, sy, ex, ey){
                // console.log('drag move');
                let node = this.placeholder;
                let dx = ex - sx;
                let dy = ey - sy;
                let stepX = this.getMoveCols(dx, item.node.x);
                let stepY = this.getMoveRows(dy, item.node.y);
                // console.log('calc over step');
                this.coors.moveItemTo(node, {
                    x: item.node.x + stepX,
                    y: item.node.y + stepY
                })
                node.x = item.node.x + stepX;
                node.y = item.node.y + stepY;
                let x = item.cacheStyle.x + dx;
                let y = item.cacheStyle.y + dy;
                item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                // this.reRenderCount++;
                this.$altStore.commit('log', {
                    type: 'move'
                })
                // console.log('reRenderCount', this.reRenderCount);
            },
            resizeMove(item, sx, sy, ex, ey){
                // console.log('resize move');
                let node = this.placeholder;
                let dx = ex - sx;
                let dy = ey - sy;
                let stepX = this.getMoveCols(dx, item.node.x + item.node.w);
                let stepY = this.getMoveRows(dy, item.node.y + item.node.h);
                let size = this.getItemLegalSize(item.node, {
                    w: item.node.w + stepX,
                    h: item.node.h + stepY
                })
                // console.log('resize', size.w, size.h)
                this.coors.resizeItem(node, {
                    w: size.w,
                    h: size.h
                })
                node.w = size.w;
                node.h = size.h;
                let w = item.cacheStyle.w + dx;
                let h = item.cacheStyle.h + dy;
                item.el.style.width = w + 'px';
                item.el.style.height = h + 'px';
                // this.reRenderCount++;
                this.$altStore.commit('log', {
                    type: 'resize'
                })
                // console.log('reRenderCount', this.reRenderCount);
            },
            getMoveCols(dx, startCol){
                if(startCol <= 0 && dx < 0) return 0;
                // console.log('get move cols: %d; startCol: %d', dx, startCol);
                let flag = dx < 0 ? '-' : '+';
                let absDx = Math.abs(dx);
                if(absDx < 15) return 0;
                let i = 0;
                let c = startCol;
                while(absDx > 0){
                    if(flag === '-'){
                        c--;
                        absDx -= (this.cols[c] || 0);
                        i++;
                        if(c <= 0) break;
                    }else{
                        c++;
                        absDx -= (this.cols[c] || 0);
                        i++;
                        if(c >= this.cols.length) break;
                    }
                    
                }
                return parseInt(flag + i);
            },
            getMoveRows(dy, startRow){
                if(startRow <= 0 && dy < 0) return 0;
                // console.log('get move rows: %d; startRow: %d', dy, startRow);
                let flag = dy < 0 ? '-' : '+';
                let absDy = Math.abs(dy);
                if(absDy < this.rowHeight/2) return 0;
                let i = 0;
                let row = startRow;
                while(absDy > 0){
                    // console.log('absDy: %d; row: %d', absDy, row);
                    if(flag === '-'){
                        absDy -= this.rowHeight;
                        i++;
                        row--;
                        if(row <= 0) break;
                    } else {
                        absDy -= this.rowHeight;
                        i++;
                        row++;
                    }
                }
                return parseInt(flag + i);
            },
            addItem(item){
                if(this.coors){
                    let distributeItem = this.coors.addItem(item);
                    this.layout.push(distributeItem);
                    this.reRenderCount++;
                    this.$altStore.commit('addHistory', {
                        type: 'addItem',
                        value: JSON.parse(JSON.stringify(this.layout))
                    });
                    return distributeItem._id;
                }
            },
            deleteItem(id){
                return this.closeWidget(id);
            },
            getAllItems(){
                return this.layout;
            },
            getItemLegalSize(item, size){
                
                let minH = getFirstSetValue(item.minH, this.defVal.minH);
                let minW = getFirstSetValue(item.minW, this.defVal.minW);
                let maxH = getFirstSetValue(item.maxH, this.defVal.maxH);
                let maxW = getFirstSetValue(item.maxW, this.defVal.maxW);
                let h = size.h;
                let w = size.w;
                // console.log('resize %d,%d -> %d, %d; max: %d, %d', item.w, item.h, size.w, size.h, maxW, maxH, item);
                if(size.h <= minH){
                    h = minH;
                }
                if(size.h >= maxH){
                    h = maxH;
                }
                if(size.w <= minW){
                    w = minW;
                }
                if(size.w >= maxW){
                    w = maxW;
                }
                return {
                    h: h,
                    w: w
                }
            },
            closeWidget(_id){
                let index = getIndexOfArrayByAttr(this.layout, _id, '_id');
                if(index === -1) return false;
                let item = this.layout[index];
                // console.log(this.layout, this.layout.indexOf(item));
                this.coors.removeItem(item);
                this.coors.moveAllItemUp();
                this.layout.splice(index, 1);
                this.reRenderCount++;
                this.clearDragEnv();
                this.$altStore.commit('addHistory', {
                    type: 'deleteItem',
                    value: JSON.parse(JSON.stringify(this.layout))
                });
            },
            go(num){
                let historyItem = this.$altStore.state.historyStack.go(num);
                let layoutCopy = historyItem.value;
                if(!layoutCopy.length) return;
                // for(let i = 0, l = layoutCopy.length; i < l; i++){
                //     let temp = layoutCopy[i];
                //     if(!this.layout[i]){
                //         this.$set(this.layout, i, temp);
                //     }else{
                //         this.layout[i].x = temp.x;
                //         this.layout[i].y = temp.y;
                //         this.layout[i].w = temp.w;
                //         this.layout[i].h = temp.h;
                //     }
                // }
                this.layout = layoutCopy;
                this.coors.clear();
                this.coors.batchAddItem(this.layout, true);

                this.$altStore.commit('log', {
                    type: 'go',
                    value: num
                })
            }
        }
    }
</script>

<style>
.alt-grid-container{
    position: relative;
    /* border: 1px solid red; */
    /* box-sizing: border-box; */
}
.alt-grid-container .alt-grid-item{
    position: absolute;
    background: gray;
    cursor: move;
}
.alt-grid-container.alt-grid-container-operating .alt-grid-item{
    transition-duration: 100ms;
}
.alt-grid-container .alt-grid-item:hover .alt-grid-item-resize-handler{
    display: block;
}
.alt-grid-container .alt-grid-item-resize-handler{
    display: none;
    position: absolute;
    
    right: 1px;
    bottom: 1px;
    
    cursor: se-resize;
}
/*
    alt-grid-item-resize-handler-default-style -> alt-g-i-r-h-default-style
*/
.alt-grid-container .alt-g-i-r-h-default-style{
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid #000;
    border-bottom: 5px solid #000;
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
