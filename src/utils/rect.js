import { isNil } from './util'

class Rect {
    constructor(info = {}, coors){
        this.appendUniqueId(info);

        this.x = this.isNotNegativeNumber(info.x) ? info.x : 0;
        this.y = this.isNotNegativeNumber(info.y) ? info.y : 0;
        this.w = this.isPositiveNumber(info.w) ? info.w : 1;
        this.h = this.isPositiveNumber(info.h) ? info.h : 1;

        this.id = info._id;

        this.rawInfo = info;

        this.coors = coors;
    }

    setPos(pos){
        let attrs = ['x', 'y', 'w', 'h'];

        let attrName;
        let tempValue;
        for(let i = 0, j = attrs.length; i < j; i++){
            attrName = attrs[i];
            tempValue = pos[attrName];
            if(!isNil(tempValue)){
                this[attrName] = tempValue;
                this.rawInfo[attrName] = tempValue
            }
        }
        
    }

    moveTo(x, y){
        if(this.coors.maxWidth && x + this.w > this.coors.maxWidth){
			x = this.coors.maxWidth - this.w;
		}
		if(x < 0) x = 0;
        if(y < 0) y = 0;
        
        this.coors._moveTo(this.id, {
            x: x,
            y: y
        })
    }

    resizeTo(w, h){
        if(this.coors.maxWidth && w + this.x > this.coors.maxWidth){
			w = this.coors.maxWidth - this.x;
		}
		if(w < 1) w = 1;
        if(h < 1) h = 1;
        
        this.coors._resizeTo(this.id, {
            w: w,
            h: h
        })
    }

    moveDown(rows){
        this.coors._moveDown(this.id, rows);
    }

    fill(value){
        this.coors.coorsFillRect(this.x, this.y, this.w, this.h, value);
    }

    // 判断是否是正整数
    isPositiveNumber(num){
        if(isNil(num)) return false;
        return num > 0;
    }
    // 判断是否为非负数 也就是 大于等于0
    isNotNegativeNumber(num){
        if(isNil(num)) return false;
        return num >= 0;
    }

    appendUniqueId(item){
        if(!item._id){
            item._id = this.getUniqueId();
        }
    }

    getUniqueId(len, radix) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // 参考rfc4122，https://tools.ietf.org/html/rfc4122
            let r;

            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }
}

export default Rect;