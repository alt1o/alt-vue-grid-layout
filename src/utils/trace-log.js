export default class TraceLog {
    constructor(){
        this.count = 0;
        this.countDetail = {};

        this.detail = new Seq(100);
    }

    log(type, data){
        this.increment(type);
        this.detail.push({
            type: type,
            value: data
        })
        return this.count;
    }

    get(type){
        if(type === 'detail'){
            return this.detail.get();
        }else if(type === 'countDetail'){
            return this.countDetail;
        }
        return this.count;
    }

    increment(type){
        this.count++;
        if(type){
            if(this.countDetail[type] === undefined){
                this.countDetail[type] = 0;
            }
            this.countDetail[type]++;
        }
        return this.count;
    }

    decrement(type){
        this.count--;
        if(type && this.countDetail[type]){
            this.countDetail[type]--;
        }
        return this.count;
    }
}

class Seq {
    constructor(maxLen){
        this.arr = [];
        this.maxLen = maxLen;
    }

    push(value){
        if(this.arr.length >= this.maxLen){
            this.arr.shift();
        }
        this.arr.push(value);
    }

    get(){
        return this.arr;
    }
}