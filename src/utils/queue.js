export default class Queue {
    constructor(options){
        this._queue = [];
        this.maxLength = options.maxLength || 10;
    }

    get(){
        return this._queue;
    }

    push(param){
        if(this._queue.length >= this.maxLength){
            this._queue.shift();
        }
        this._queue.push(param);
        return this._queue.length;
    }

    shift(){
        return this._queue.shift();
    }
}