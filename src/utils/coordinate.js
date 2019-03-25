class Coordinate {
    constructor(){
        this.coors = [];
    }

    addItem(item = {}){
        console.log('add item: %d; %d; %d; %d;', item.x, item.y, item.w, item.h);
        if(!this.isNotNegative(item.x) || 
            !this.isNotNegative(item.y) ||
            !this.isPositiveNumer(item.w) ||
            !this.isPositiveNumer(item.h) ||
            !this.checkItemPositionIsLegal(item, this.coors)){
            let distributePos = this.distributeItemPosition(item, this.getAllItems());
            item.x = distributePos.x;
            item.y = distributePos.y;
            item.w = distributePos.w;
            item.h = distributePos.h;
        }

        let x = item.x;
        let y = item.y;
        let w = item.w;
        let h = item.h;

        for(let i = y; i < y + h; i++){
            if(this.isNil(this.coors[i])) this.coors[i] = [];
            for(let j = x; j < x + w; j++){
                if(this.isNil(this.coors[i][j])){
                    this.coors[i][j] = item;
                }
            }
        }

        // console.log(this.coors);
        return item;
    }

    batchAddItem(list){
        for(let i = 0; i < list.length; i++){
            this.addItem(list[i])
        }
    }

    getAllItems(){
        let items = [];
        let tempRow = null;
        let tempItem = null;
        for(let i = 0; i < this.coors.length; i++){
            tempRow = this.coors[i];
            if(this.isNil(tempRow)) continue;
            for(let j = 0; j < tempRow.length; j++){
                tempItem = tempRow[j];
                if(this.isNil(tempItem) || ~items.indexOf(tempItem)) continue;
                items.push(tempItem);
            }
        }

        return items;
    }

    // 检查位置是否合法
    checkItemPositionIsLegal(item, coors){
        let x = item.x;
        let y = item.y;
        let w = item.w;
        let h = item.h;
        for(let i = y; i < y + h; i++){
            if(this.isNil(coors[i])) continue;
            for(let j = x; j < x + w; j++){
                if(!this.isNil(coors[i][j])){
                    return false;
                }
            }
        }

        return true;
    }

    // 分配元素位置
    distributeItemPosition(item, itemList){
        let x = this.isPositiveNumer(item.x) ? item.x : 0;
        let y = this.isPositiveNumer(item.y) ? item.y : 0;
        let w = this.isPositiveNumer(item.w) ? item.w : 1;
        let h = this.isPositiveNumer(item.h) ? item.h : 1;

        let colsHeight = [];
        let tempItem = null;
        let tempY = 0;
        for(let i = 0, j = itemList.length; i < j; i++){
            tempItem = itemList[i];
            tempY = tempItem.y + tempItem.h;
            for(let m = tempItem.x; m < tempItem.x + tempItem.w; m++){
                if(tempY > (colsHeight[m] || 0)){
                    colsHeight[m] = tempY;
                }
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

    // 获取最下部分可以插入位置
    getMinPeek(arr, w){
        if(w === 1){
            let minVal = Math.min.apply(null, arr);
            return arr.indexOf(minVal);
        }
        let index = -1;
        let value = 10000;
        for(let i = 0; i < arr.length - w; i++){
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

    // 删除元素
    removeItem(item){
        console.log('remove item: %d;%d;%d;%d', item.x, item.y, item.w, item.h);
        let x = item.x;
        let y = item.y;
        let w = item.w;
        let h = item.h;
        for(let i = y; i < y + h; i++){
            if(this.isNil(this.coors[y])) continue;
            for(let j = x; j < x + w; j++){
                this.coors[i][j] = null;
            }
        }
    }

    moveItemTo(item, target){
        console.log('------- move start ------');
        if(item.x === target.x && item.y === target.y){
            console.log('---- no move end ------')
            return;
        }
        console.log('%d;%d;%d;%d; -> %d;%d', item.x, item.y, item.w, item.h, target.x, target.y);
        console.log('test get move up rows', this.getMoveUpRows(item));
        this.removeItem(item);
        
        let belowItems = this.findFirstItemInEveryColsAtRect({
            x: item.x,
            y: item.y + item.h,
            w: item.w,
            h: 1
        });
        for(let i = 0; i < belowItems.length; i++){
            this.moveItemUp(belowItems[i], this.getMoveUpRows(belowItems[i]));
        }

        let flag = this.checkItemPositionIsLegal({
            x: target.x,
            y: target.y,
            w: item.w,
            h: item.h
        }, this.coors);
        if(!flag){
            let targetBelowItems = this.findFirstItemInEveryColsAtRect({
                x: target.x,
                y: target.y,
                h: item.h,
                w: item.w
            })
            console.log('move down items: %d', targetBelowItems.length);
            // console.table(targetBelowItems);
            for(let i = 0; i < targetBelowItems.length; i++){
                this.moveItemDown(targetBelowItems[i], target.y - targetBelowItems[i].y + item.h);
            }
        }

        item.x = target.x;
        item.y = target.y;

        this.addItem(item);
        // this.moveAllItemUp();
        console.log('coors', JSON.parse(JSON.stringify(this.coors)));
        console.log('----- move end -----');
    }

    resizeItem(item, target){
        console.log('---- resize start ------');
        if(item.w === target.w && item.h === target.h){
            console.log('---- resize no move end -----');
            return;
        }
        console.log('%d;%d;%d;%d; -> %d;%d', item.x, item.y, item.w, item.h, target.w, target.h);
        this.removeItem(item);
        
        let belowItems = this.findFirstItemInEveryColsAtRect({
            x: item.x,
            y: item.y + item.h,
            w: item.w,
            h: 1
        });
        for(let i = 0; i < belowItems.length; i++){
            this.moveItemUp(belowItems[i], this.getMoveUpRows(belowItems[i]));
        }

        let flag = this.checkItemPositionIsLegal({
            x: item.x,
            y: item.y,
            w: target.w,
            h: target.h
        }, this.coors);
        if(!flag){
            let targetBelowItems = this.findFirstItemInEveryColsAtRect({
                x: item.x,
                y: item.y,
                h: target.h,
                w: target.w
            })
            console.log('move down items: %d', targetBelowItems.length);
            // console.table(targetBelowItems);
            for(let i = 0; i < targetBelowItems.length; i++){
                this.moveItemDown(targetBelowItems[i], item.y - targetBelowItems[i].y + target.h);
            }
        }

        item.w = target.w;
        item.h = target.h;

        this.addItem(item);
        this.moveAllItemUp();
        console.log('coors', JSON.parse(JSON.stringify(this.coors)));
        console.log('----- move end -----');
    }

    // 查找某个区域位置的每一列的第一个元素
    findFirstItemInEveryColsAtRect(pos){
        let x = pos.x;
        let y = pos.y;
        let w = pos.w;
        let h = pos.h;

        let items = [];
        let tempRow = null;
        let tempItem = null;

        for(let i = x; i < x + w; i++){
            for(let j = y; j < y + h; j++){
                tempRow = this.coors[j];
                if(this.isNil(tempRow)) continue;
                tempItem = tempRow[i];
                if(this.isNil(tempItem) || ~items.indexOf(tempItem)) continue;
                items.push(tempItem);
                break;
            }
        }

        return items;
    }

    getMoveUpRows(item){
        let coors = this.coors;
        let upperRows = 0;
        for(let i = item.y - 1; i >= 0; i--){
            if(this.isNil(coors[i])){
                upperRows++;
                continue;
            }
            for(let j = item.x; j < item.x + item.w; j++){
                if(!this.isNil(coors[i][j])) return upperRows;
            }
            upperRows++;
        }

        return upperRows;
    }

    // 上移元素
    moveItemUp(item, size){
        console.log('move item up: %d; %d; %d; %d  => %d', item.x, item.y, item.w, item.h, size);
        if(!size) return;
        this.removeItem(item);
        
        let belowItems = this.findFirstItemInEveryColsAtRect({
            x: item.x,
            y: item.y + item.h,
            h: 1,
            w: item.w
        })

        item.y -= size;
        this.addItem(item);

        for(let i = 0; i < belowItems.length; i++){
            this.moveItemUp(belowItems[i], this.getMoveUpRows(belowItems[i]))
        }
    }
    // 暂时移动完成之后全部都moveUp一下
    moveAllItemUp(){
        let itemList = this.getAllItems();
        for(let i = 0, j = itemList.length; i < j; i++){
            this.moveItemUp(itemList[i], this.getMoveUpRows(itemList[i]));
        }
    }

    // 下移元素
    moveItemDown(item, size){
        console.log('move item down: %d; %d; %d; %d  => %d', item.x, item.y, item.w, item.h, size);
        if(!size) return;
        this.removeItem(item);

        let belowItems = this.findFirstItemInEveryColsAtRect({
            x: item.x,
            y: item.y,
            h: item.h + size,
            w: item.w
        })
        console.log('move down items: %d', belowItems.length);
        for(let i = 0; i < belowItems.length; i++){
            this.moveItemDown(belowItems[i], size);
        }

        item.y += size;
        this.addItem(item);
    }

    clear(){
        this.coors = [];
    }

    // 判断是否是正整数
    isPositiveNumer(num){
        if(this.isNil(num)) return false;
        return num > 0;
    }
    // 判断是否为非负数 也就是 大于等于0
    isNotNegative(num){
        if(this.isNil(num)) return false;
        return num >= 0;
    }

    isNil(vari){
        return vari === undefined || vari === null;
    }

}

export default Coordinate;