import { isNil, forEach } from './util'
import Rect from './rect'
class Coordinate {
    constructor(options = {}){
        this.coors = [];
        this.coorItemsMap = {};
        this.maxWidth = options.maxWidth;
    }

    add(info){
        /**
         * 1. 判断位置参数合法性，不合法则自动分配
         * 2. 添加到坐标系
         * 3. 返回 id
         */

        let rectItem = new Rect(info, this);
        
        this.distributeRectPosition(rectItem);

        this.coorsFillRect(rectItem.x, rectItem.y, rectItem.w, rectItem.h, rectItem);

        this.coorItemsMap[rectItem.id] = rectItem;

        return rectItem;
    }

    coorsFillRect(x, y, w, h, value){
        let arr = this.coors;
        let row;
        for(let i = y; i < y + h; i++){
            row = arr[i];
            if(isNil(row)){
                arr[i] = [];
            }
            for(let j = x; j < x + w; j++){
                arr[i][j] = value;
            }
        }
    }

    coorsGetRectItems(x, y, w, h){
        let itemsList = [];
        let row, cell;
        for(let i = y; i < y + h; i++){
            row = this.coors[i] || [];
            for(let j = x; j < x + w; j++){
                cell = row[j];
                if(!isNil(cell)){
                    itemsList.push(cell);
                }
            }
        }

        return itemsList;
    }

    distributeRectPosition(rectInstance){
        if(!this.checkRectPositionIsLegal(rectInstance, this.coors)){
            let legalPos = this.getLegalPosition(rectInstance, this.coorItemsMap);
            rectInstance.setPos(legalPos);
        }
    }

    getLegalPosition(rectInstance, itemsMap){
        let x = rectInstance.x;
        let y = rectInstance.y;
        let w = rectInstance.w;
        let h = rectInstance.h;

        let colsHeight = [];
        let tempItem = null;
        let tempY = 0;

        forEach(Object.keys(itemsMap), (key) => {
            tempItem = itemsMap[key];
            tempY = tempItem.y + tempItem.h;
            for(let m = tempItem.x; m < tempItem.x + tempItem.w; m++){
                if(tempY > (colsHeight[m] || 0)){
                    colsHeight[m] = tempY;
                }
            }
        })

        let max = this.maxWidth || colsHeight.length + w;

        for(let i = 0; i < max; i++){
            if(isNil(colsHeight[i])){
                colsHeight[i] = 0;
            }
        }

        let index = this.getMinPeek(colsHeight, w);
        x = ~index ? index : 0;
        y = colsHeight[x] || 0;

        return {
            x: x,
            y: y,
            w: w,
            h: h
        }
    }

    getMinPeek(arr, w){
        if(w === 1){
            let minVal = Math.min.apply(null, arr);
            return arr.indexOf(minVal);
        }
        let index = -1;
        let value = Infinity;
        for(let i = 0; i < arr.length - w + 1; i++){
            let flag = true;
            let item = arr[i];
            for(let j = i + 1; j < i + w; j++){
                if(item < arr[j]){
                    flag = false;
                    break;
                }
            }
            if(flag && item < value){
                value = item;
                index = i;
            }
        }
        return index;
    }

    // 检查位置是否合法
    checkRectPositionIsLegal(item, coors){
        let x = item.x;
        let y = item.y;
        let w = item.w;
        let h = item.h;
        for(let i = y; i < y + h; i++){
            if(isNil(coors[i])) continue;
            for(let j = x; j < x + w; j++){
                if(!isNil(coors[i][j])){
                    return false;
                }
            }
        }

        return true;
    }

    _moveTo(id, pos = {}){
        /**
         * 1. 找到对应的id
         * 2. 判断移动的
         */

        if(isNil(pos.x) || isNil(pos.y)) return;
        let rectItem = this.coorItemsMap[id];

        rectItem.fill(null);

        let targetRect = {
            x: pos.x,
            y: pos.y,
            w: rectItem.w,
            h: rectItem.h
        };

        let targetAreaRectItems = this.coorsGetFirstItemForColsInRect(targetRect);

        let targetBottomLine = {
            x: targetRect.x,
            y: targetRect.y + targetRect.h,
            w: targetRect.w
        }

        forEach(targetAreaRectItems, (item) => {
            item.moveDown(targetBottomLine.y - item.y);
        })

        rectItem.setPos(targetRect);

        this.coorsFillRect(targetRect.x, targetRect.y, targetRect.w, targetRect.h, rectItem);

        this._moveUpAll();
    }

    _resizeTo(id, rect = {}){
        if(isNil(rect.w) || isNil(rect.h)) return;

        let rectItem = this.coorItemsMap[id];

        rectItem.fill(null);

        let targetRect = {
            x: rectItem.x,
            y: rectItem.y,
            w: rect.w,
            h: rect.h
        };

        let targetAreaRectItems = this.coorsGetFirstItemForColsInRect(targetRect);

        let targetBottomLine = {
            x: targetRect.x,
            y: targetRect.y + targetRect.h,
            w: targetRect.w
        }

        forEach(targetAreaRectItems, (item) => {
            item.moveDown(targetBottomLine.y - item.y);
        })

        rectItem.setPos(targetRect);

        rectItem.fill(rectItem);

        // this.coorsFillRect(targetRect.x, targetRect.y, targetRect.w, targetRect.h, rectItem);

        this._moveUpAll();

    }

    _moveDown(id, rows){
        let rectItem = this.coorItemsMap[id];

        rectItem.fill(null);

        let belowItems = this.coorsGetFirstItemForColsInRect({
            x: rectItem.x,
            y: rectItem.y + rectItem.h,
            w: rectItem.w,
            h: rectItem.h + rows
        })

        let targetBottomLine = {
            x: rectItem.x,
            y: rectItem.y + rectItem.h + rows,
            w: rectItem.w
        }

        forEach(belowItems, (item) => {
            item.moveDown(targetBottomLine.y - item.y);
        })

        rectItem.setPos({
            y: rectItem.y + rows
        });

        rectItem.fill(rectItem);

    }

    coorsGetFirstItemForColsInRect(rect){
        let {x, y, w, h} = rect;
        let itemsList = [];

        let mapList = [];

        let row, cell;
        for(let i = y; i < y + h; i++){
            row = this.coors[i] || [];
            for(let j = x; j < x + w; j++){
                cell = row[j];
                if(!isNil(cell) && !mapList[j] && this.checkLineIsLegal(cell, mapList)){
                    mapList[j] = cell;
                    if(!~itemsList.indexOf(cell)){
                        itemsList.push(cell);
                    }
                }
            }
            if(itemsList.length >= w) break;
        }

        return itemsList;
    }

    checkLineIsLegal(cell, line){
		for(let i = cell.x; i < cell.x + cell.w; i++){
			if(!isNil(line[i]) && cell !== line[i]){
				return false;
			}
		}

		return true;
	}

    getEmptyRowsBeforeLine(x, y, w){
        if(y === 0) return 0;
        let count = 0;
        let row, cell;
        for(let rowNum = y - 1; rowNum >= 0; rowNum--){
            row = this.coors[rowNum] || [];
            for(let colNum = x; colNum < x + w; colNum++){
                cell = row[colNum];
                if(!isNil(cell)){
                    return count;
                }
            }
            count++;
        }

        return count;
    }

    _moveUpAll(){
        let me = this;
        forEach(this.coors, (row) => {
            forEach(row, (cell) => {
                if(!cell || cell.y === 0) return;
                let canUpRows = me.getEmptyRowsBeforeLine(cell.x, cell.y, cell.w);
                cell.fill(null);
                cell.setPos({
                    y: cell.y - canUpRows
                })
                cell.fill(cell);
            })
        })
    }
    
    clear(){
        this.coors = [];
        this.coorItemsMap = {};
    }

    batchAddItem(itemList){
        let me = this;
        forEach(itemList, (item) => {
            me.add(item);
        })
        this._moveUpAll();
    }

    getAllItems(){
        let list = [];
        let itemMap = this.coorItemsMap;
        forEach(Object.keys(itemMap), (key) => {
            list.push(itemMap[key].rawInfo);
        })

        return list;
    }

    remove(id){
        let rectItem = this.coorItemsMap[id];
        if(rectItem){
            rectItem.fill(null);
            delete this.coorItemsMap[id];
            this._moveUpAll();
        }
        return rectItem;
    }

    replace(id, info){
        let rectItem = this.coorItemsMap[id];
        if(rectItem && 
            rectItem.x === info.x &&
            rectItem.y === info.y &&
            rectItem.w === info.w &&
            rectItem.h === info.h ){
            rectItem.fill(null);
            delete this.coorItemsMap[id];

            let newRectItem = new Rect(info, this);
            newRectItem.fill(newRectItem);
            this.coorItemsMap[newRectItem.id] = newRectItem;
            return newRectItem;
        }
        return null;
    }

    getItemById(id){
        return this.coorItemsMap[id];
    }

}

export default Coordinate;