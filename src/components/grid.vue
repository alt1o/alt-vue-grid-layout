<template>
    <div 
        class="alt-grid-container"
        :class="operatorClass"
        :style="containerStyle">
        <div 
            :style="getCardStyleForPlaceholder(placeholder)"
            class="alt-grid-item-drag-placeholder"
            :class="placeholderClass">
        </div>
        <div 
            ref="cards"
            v-for="(item, index) in innerLayout"
            :key="item._id"
            :dg-id="item._id"
            :style="item._alt_style"
            class="alt-grid-item"
            :class="[canDragClass(item.isDraggable), gridItemClass, item.gridItemClass]">
            <button 
                v-if="getFirstSetValue(item.isShowOriginCloseBtn, isShowOriginCloseBtn, true)"
                :class="[closeHandlerClass, item.closeHandlerClass]" 
                @click="closeWidget(item._id)">关闭</button>
            <slot :alt-card-props="getPropsForInject(index, item)"></slot>
            <span 
                v-if="getFirstSetValue(item.isResizable, isResizable, true)"
                class="alt-grid-item-resize-handler"
                :class="[resizeHandlerClass, item.resizeHandlerClass]"></span>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
    // import elementResizeDetectorMaker from 'element-resize-detector'
    import {
        hasClass,
        findParentThoughEvtPath,
        getFirstSetValue,
        getIndexOfArrayByAttr,
        normalizeEvent,
        isDragIgnoreFrom
    } from '../utils/util';

    import watchBoxSize from '../utils/watch-box-size.js'
    import Coordinate from '../utils/coordinate'
    import coorTest from '../utils/coordinate.test.js'

    import props from './props.js'

    export default {
        name: 'alt-grid-layout',
        props: props,
        data () {
            return {
                innerLayout: [], // 布局源数据
                defVal: {
                    minH: 1, // 默认每个卡片的最小高度
                    minW: 1, // 默认每个卡片的最小宽度
                    maxH: Infinity, // 默认每个卡片的最大高度
                    maxW: Infinity, // 默认每个卡片的最大宽度
                    isDraggable: true, // 默认每个卡片是否支持拖拽
                    isResizable: true, // 默认每个卡片是否支持设置大小
                    isShowOriginCloseBtn: true, // 是否显示默认的关闭按钮
                    dragIgnoreFrom: 'a, input, button, textarea'
                },
                containerHeight: 0, // 容器高度
                cols: [],
                cacheComputed: {},
                placeholder: null, // 拖拽的placeholder
                preOperator: 0, // 防止点击事件是触发拖动样式，先赋值给preOperator，如果用户继续执行move，则将preOperator赋值给operator
                operator: 0, // 当前操作状态，0 - 无操作，1 - 拖拽， 2 - 缩放
                operatedItem: null, // 当前被操作的元素的状态
                containerWidth: 0,
                boxWatchHandler: null,
                coors: null,
                timer: null,
                animation: null,
                animationHandler: null,
                eventHandler: {
                    mousedown: null,
                    mousemove: null,
                    mouseup: null
                }
            }
        },
        mounted: function () {
            this.initCols();
            if(this.width === false){
                this.boxWatchHandler = new watchBoxSize(this.$el, () => {
                    this.initCols();
                })
            }
            
            // 绑定拖拽事件
            this.bindEvents();

            this.setLayout(this.layout);
            
        },
        destroyed(){
            this.boxWatchHandler.destroy();
            // this.erd.uninstall(this.$el);
            this.unbindEvents();
            clearTimeout(this.timer);
        },
        watch: {
            layout(val){
                this.setLayout(val);
            },
            rowHeight(){
                this.reRenderStyle({
                    triggerEventEnd: true,
                    onlyReRender: true
                });
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
                if(this.operator) return;
                this.reRenderStyle({
                    triggerEventEnd: true,
                    onlyReRender: true
                });
            },
            margin(){
                this.cacheComputed = {};
                this.reRenderStyle();
            },
            backgroundColor(){
                // this.reRenderStyle();
                this.forceReRenderStyle();
            }
        },
        computed: {
            containerStyle(){
                return {
                    height: this.containerHeight + 'px'
                }
            },
            operatorClass(){
                if(!this.operator) return '';
                if(this.operator === 1){
                    return 'alt-grid-container-operating alt-move';
                }else if(this.operator === 2){
                    return 'alt-grid-container-operating alt-resize';
                }
                return '';
            }
        },
        methods: {
            bindEvents(){
                this.eventHandler.mousedown = this.mousedown.bind(this);
                this.eventHandler.mousemove = this.mousemove.bind(this);
                this.eventHandler.mouseup = this.mouseup.bind(this);
                this.$el.addEventListener('mousedown', this.eventHandler.mousedown);
                document.addEventListener('mousemove', this.eventHandler.mousemove);
                document.addEventListener('mouseup', this.eventHandler.mouseup)
            },
            unbindEvents(){
                this.$el.removeEventListener('mousedown', this.eventHandler.mousedown);
                document.removeEventListener('mousemove', this.eventHandler.mousemove);
                document.removeEventListener('mouseup', this.eventHandler.mouseup);
            },
            canDragClass(isDraggable){
                return getFirstSetValue(isDraggable, this.isDraggable, true) ? 'can-drag' : '';
            },
            forceReRenderStyle(){
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.innerLayout.forEach((item) => {
                        let style = this.getCardStyle(item);
                        this.$set(item, '_alt_style', style);
                        // item.style = style;
                    })
                }, 10);
            },
            reRenderStyle(options = {}){
                let ignoreId = options.ignoreId;
                let triggerEventEnd = options.triggerEventEnd;
                let onlyReRender = options.onlyReRender;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.containerHeight = 0;
                    this.innerLayout.forEach((item, index) => {
                        if(item._id === ignoreId) return;
                        let card = this.$refs.cards[index];
                        let oldStyle = {
                            style: card.style,
                            width: card.style.width,
                            height: card.style.height,
                            transform: card.style.transform
                        };
                        if(oldStyle.transform){
                            oldStyle.transform = oldStyle.transform.replace(/\s/g, '');
                        }

                        let styleRaw = this.getCardStyle(item, true);

                        this.$set(item, '_alt_style', styleRaw.style);
                        // item.style = style;
                        let status = this.getCardRectChangeStatus(oldStyle, styleRaw, ['width', 'height', 'transform'], {
                            triggerEventEnd: triggerEventEnd
                        });
                        if(status === 'none') return;
                        this.dispatchEvent(item._id, status, {
                            w: item.w,
                            h: item.h,
                            x: item.x,
                            y: item.y,
                            layout: this.innerLayout,
                            onlyReRender: onlyReRender
                        })

                        // console.log('create Style:', styleRaw, oldStyle, index);
                    })
                }, 10);
            },
            getCardRectChangeStatus(arg1, arg2, range, options = {}){
                let triggerEventEnd = options.triggerEventEnd;
                let keys = range || Object.keys(arg1);
                for(let i = 0, l = keys.length; i < l; i++){
                    let key = keys[i];
                    
                    if(arg1[key] !== arg2[key]){
                        if(key === 'width' || key === 'height'){
                            if(triggerEventEnd){
                                return 'resized';
                            }
                            return 'resize';
                        }
                        if(key === 'transform'){
                            if(triggerEventEnd){
                                return 'moved';
                            }
                            return 'move';
                        }
                    }
                }
                return 'none';
            },
            dispatchEvent(dragId, type, pos){
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.$refs[dragId] && this.$refs[dragId][0].$emit(type, pos);
                    })
                })
                
            },
            getFirstSetValue(){
                return getFirstSetValue(...arguments);
            },
            getPropsForInject(index, item){
                return {
                    id: item._id,
                    card: item,
                    layout: this.innerLayout,
                    close: this.closeWidget.bind(this, item._id)
                }
            },
            // 初始化每个列宽
            initCols(){
                // // // console.log('init cols');
                let containerWidth = 0;
                if(this.width === false){
                    containerWidth = this.$el.clientWidth;
                }else{
                    containerWidth = this.width > 0 ? this.width : 0;
                }
                // let containerWidth = this.$el.clientWidth;
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
            setLayout(layout = []){
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
                    this.$set(item, '_alt_style', style);
                    // item.style = style;
                });

                this.innerLayout = layoutOverCalc;

                if(/_env=altdev/.test(window.location.search)){
                    coorTest(this, this.innerLayout);
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
                let x = this.computeColsWidth(0, item.x) + 'px';
                let w = this.getCardWidth(item.x, item.x + item.w) + 'px';
                let y = item.y * this.rowHeight;
                let yPx = y + 'px';
                let h = item.h * this.rowHeight - this.margin[1];
                let hPx = h + 'px';
                this.setContainerHeight(y, h);
                let transform = `translate3d(${x},${yPx},0px)`;
                let style = `transform:${transform};width:${w};height:${hPx};background-color:${this.backgroundColor};`;
                if(raw){
                    return { 
                        style,
                        x,
                        y,
                        width: w, 
                        height: h, 
                        transform
                    };
                }
                return style;
                // return {
                //     transform: `translate(${x}px,${y}px)`,
                //     width: w + 'px',
                //     height: h + 'px'
                // }
            },
            getCardStyleForRealTime(item){
                if(!item) return;
                let w = item.w;
                let x = item.x;
                if(x < 0){
                    x = 0;
                }else if((x + w) > this.containerWidth){
                    x = this.containerWidth - w;
                }
                let y = item.y;
                if(y < 0){
                    y = 0;
                }
                let transform = `transform:translate3d(${x}px,${y}px,0);`;
                let style = `${transform}width:${w}px;height:${item.h}px;background-color:${this.backgroundColor};z-index:1;`;
                return style;
            },
            getCardStyleForPlaceholder(item){
                if(!item) return {};
                let x = this.computeColsWidth(0, item.x);
                let w = this.getCardWidth(item.x, item.x + item.w);
                let y = item.y * this.rowHeight;
                let h = item.h * this.rowHeight - this.margin[1];
                this.setContainerHeight(y, h);
                let transform = `transform:translate3d(${x}px,${y}px,0);`;
                let style = `${transform}width:${w}px;height:${h}px;`;
                return style;
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
            mousedown(event){
                this.mousedownTimeStamp = new Date().getTime();
                let evt = normalizeEvent(event);
                let srcElement = evt.srcElement;
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
                    this.preOperator = 2; // resize
                }
                if(targetCard && !this.preOperator){
                    if(!getFirstSetValue(
                        node.isDraggable, 
                        this.isDraggable, 
                        this.defVal.isDraggable)){
                        return;
                    }
                    let dragIgnoreFrom = getFirstSetValue(
                            node.dragIgnoreFrom,
                            this.defVal.dragIgnoreFrom);
                    if(isDragIgnoreFrom(target, targetCard, dragIgnoreFrom)) return;

                    this.preOperator = 1; // 拖拽
                }
                
                
                if(!targetCard && !this.preOperator) return;
                // if(!hasClass(target, 'alt-grid-item')) return;
                
                let targetCardStyle = targetCard.style;
                let translate = targetCardStyle.transform.match(/\(([-.\d]*)px, ([-.\d]*)px/);
                this.operatedItem = {
                    srcElement: srcElement,
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
                    _id: '__placeHolder__',
                    x: node.x,
                    y: node.y,
                    w: node.w,
                    h: node.h
                };
                this.coors.replace(node._id, this.placeholder);
                // this.coors.remove(node._id);
                // this.coors.add(this.placeholder);
                // console.log('down', evt, this.operatedItem);
                // if(hasClass(target, this.resizeHandlerClass)){
                //     this.operator = 2;
                // } else {
                //     this.operator = 1;
                // }
            },
            mousemove(evt){
                if(!this.preOperator) return;
                this.operator = this.preOperator;
                // console.log('mouse move');
                this.operatedItem.el.classList.add('operated-item');
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
                let time = new Date().getTime();
                if(time - this.mousedownTimeStamp < 10){
                    this.operatedItem && this.operatedItem.srcElement && this.operatedItem.srcElement.click();
                }
                let operatedItem = this.operatedItem;
                if(operatedItem){
                    this.applyChange();
                    
                    this.$set(operatedItem.node, '_alt_style', this.getCardStyle(operatedItem.node));
                    // item.node[] = this.getCardStyle(item.node);

                    this.coors.replace(this.placeholder._id, operatedItem.node);
                    // this.coors.remove(this.placeholder._id);
                    // this.coors.add(operatedItem.node);
                }

                this.clearDragEnv();
                this.$emit('update:layout', this.innerLayout);
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
                        h: node.h,
                        layout: this.innerLayout
                    })
                }else if(this.operator === 2){
                    if(node.w === w && node.h === h)  return;
                    node.w = this.placeholder.w;
                    node.h = this.placeholder.h;
                    node.x = this.placeholder.x;
                    node.y = this.placeholder.y;
                    this.dispatchEvent(dragId, 'resized', {
                        x: x,
                        y: y,
                        w: w,
                        h: h,
                        layout: this.innerLayout
                    })
                }
            },
            clearDragEnv(){
                this.preOperator = 0;
                this.operator = 0;
                this.operatedItem = null;
                this.placeholder = null;
            },
            getNodeByDragId(dragId){
                let index = getIndexOfArrayByAttr(this.innerLayout, dragId, '_id');
                if(index === -1) return null;
                return this.innerLayout[index];
            },
            getDragId(target){
                return target.getAttribute('dg-id');
            },
            dragMove(operatedItem, sx, sy, ex, ey){
                // console.log('drag move');
                let placeholder = this.placeholder;
                let cacheStyle = operatedItem.cacheStyle;
                let dx = ex - sx;
                let dy = ey - sy;
                let startCol = dx > 0 ? operatedItem.node.x + operatedItem.node.w : operatedItem.node.x;
                let stepX = this.getMoveCols(dx, startCol);
                let stepY = this.getMoveRows(dy, operatedItem.node.y);
                // console.log('calc over step');
                let targetX = operatedItem.node.x + stepX;
                let targetY = operatedItem.node.y + stepY;

                this.coors.getItemById(placeholder._id).moveTo(targetX, targetY);
                
                
                let x = cacheStyle.x + dx;
                let y = cacheStyle.y + dy;
                operatedItem.node['_alt_style'] = this.getCardStyleForRealTime({
                    x: x,
                    y: y,
                    w: cacheStyle.w,
                    h: cacheStyle.h
                })
                // this.coors.moveAllItemUp();
                this.reRenderStyle({
                    ignoreId: operatedItem.dragId
                });
                this.dispatchEvent(operatedItem.dragId, 'move', {
                    x: this.placeholder.x,
                    y: this.placeholder.y,
                    w: this.placeholder.w,
                    h: this.placeholder.h,
                    layout: this.innerLayout
                })
            },
            resizeMove(operatedItem, sx, sy, ex, ey){
                let placeholder = this.placeholder;
                let node = operatedItem.node;
                let cacheStyle = operatedItem.cacheStyle;
                let dx = ex - sx;
                let dy = ey - sy;
                let stepX = this.getMoveCols(dx, node.x + node.w);
                let stepY = this.getMoveRows(dy, node.y + node.h);
                let size = this.getItemLegalSize(node, {
                    w: node.w + stepX,
                    h: node.h + stepY
                });
                this.coors.getItemById(placeholder._id).resizeTo(size.w, size.h);

                let pixiesSize = this.getItemLegalSizeInPixies(node, {
                    width: cacheStyle.w + dx,
                    height: cacheStyle.h + dy
                })
                
                if(cacheStyle.x + pixiesSize.width > this.containerWidth){
                    pixiesSize.width = this.containerWidth - cacheStyle.x;
                }
                operatedItem.node['_alt_style'] = this.getCardStyleForRealTime({
                    x: cacheStyle.x,
                    y: cacheStyle.y,
                    w: pixiesSize.width,
                    h: pixiesSize.height
                })
                this.reRenderStyle({
                    ignoreId: operatedItem.dragId
                });
                this.dispatchEvent(operatedItem.dragId, 'resize', {
                    x: this.placeholder.x,
                    y: this.placeholder.y,
                    w: this.placeholder.w,
                    h: this.placeholder.h,
                    layout: this.innerLayout
                })
            },
            getItemLegalSizeInPixies(node, size){
                let pixiesLimit = this.getPixiesLimit(node);
                let width = size.width;
                let height = size.height;

                if(width > pixiesLimit.maxWidth){
                    width = pixiesLimit.maxWidth;
                }else if(width < pixiesLimit.minWidth - 10){
                    width = pixiesLimit.minWidth - 10;
                }

                if(height > pixiesLimit.maxHeight){
                    height = pixiesLimit.maxHeight;
                }else if(height < pixiesLimit.minHeight - 10){
                    height = pixiesLimit.minHeight - 10;
                }

                return {
                    width: width,
                    height: height
                }
            },
            getPixiesLimit(node){
                let pixiesLimit = {
                    minWidth: 0,
                    minHeight: 0,
                    maxWidth: Infinity,
                    maxHeight: Infinity
                }

                let minW = getFirstSetValue(node.minW, this.defVal.minW);
                let minH = getFirstSetValue(node.minH, this.defVal.minH);

                if(minW && minW > 0){
                    pixiesLimit.minWidth = this.getCardWidth(node.x, node.x + minW);
                }

                if(minH && minH > 0){
                    pixiesLimit.minHeight = minH * this.rowHeight - this.margin[1];
                }

                if(node.maxW && node.maxW > 0){
                    pixiesLimit.maxWidth = this.getCardWidth(node.x, node.x + node.maxW);
                }

                if(node.maxH && node.maxH > 0){
                    pixiesLimit.maxHeight = node.maxH * this.rowHeight - this.margin[1];
                }

                return pixiesLimit;
            },
            getMoveCols(dx, startCol){
                if(startCol <= 0 && dx < 0) return 0;
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
                let flag = dy < 0 ? '-' : '+';
                let absDy = Math.abs(dy);
                if(absDy < this.rowHeight/2) return 0;
                let i = 0;
                let row = startRow;
                while(absDy > 0){
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
                if(!this.coors){
                    this.setLayout();
                }
                let distributeItem = this.coors.add(item);
                let style = this.getCardStyle(distributeItem);
                this.$set(distributeItem.rawInfo, '_alt_style', style);
                this.innerLayout.push(distributeItem.rawInfo);
                this.$emit('update:layout', this.innerLayout);
                return distributeItem.id;
            },
            deleteItem(id){
                return this.closeWidget(id);
            },
            getAllItems(){
                return this.innerLayout;
            },
            getItemLegalSize(item, size){
                
                let minH = getFirstSetValue(item.minH, this.defVal.minH);
                let minW = getFirstSetValue(item.minW, this.defVal.minW);
                let maxH = getFirstSetValue(item.maxH, this.defVal.maxH);
                let maxW = getFirstSetValue(item.maxW, this.defVal.maxW);
                let h = size.h;
                let w = size.w;
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
                let index = getIndexOfArrayByAttr(this.innerLayout, _id, '_id');
                if(index === -1) return false;
                let item = this.innerLayout[index];
                this.coors.remove(item._id);
                // this.coors.moveAllItemUp();
                this.innerLayout.splice(index, 1);
                this.reRenderStyle();
                // this.reRenderCount++;
                this.clearDragEnv();
                this.$emit('update:layout', this.innerLayout);
            }
        },
        updated(){
            this.$emit('updated');
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
    /* cursor: move; */
}
.alt-grid-container .alt-grid-item.can-drag{
    cursor: move;
}
.alt-grid-container.alt-grid-container-operating .alt-grid-item{
    transition-duration: 300ms;
}
.alt-grid-container.alt-grid-container-operating .alt-grid-item.operated-item{
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
    visibility: hidden;
}
.alt-grid-container-operating .alt-grid-item-drag-placeholder{
    visibility: visible;
}
.alt-grid-container-operating{
    user-select: none;
}

.alt-grid-container-operating .mask{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
}
.alt-grid-container-operating.alt-move .mask{
    cursor: move;
}
.alt-grid-container-operating.alt-resize .mask{
    cursor: se-resize;
}
</style>
