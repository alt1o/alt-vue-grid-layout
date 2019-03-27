export default class StackWithDepth {
    constructor(options = {}){
        this.stack = [];
        this.maxDepth = options.maxDepth || 10;
    }

    get length(){
        return this.stack.length;
    }

    set length(num){
        console.error('[stackWithDepth] 不能直接设置length属性.')
    }

    push(param){
        if(this.stack.length > this.maxDepth){
            this.stack.shift();
        }

        this.stack.push(param);

        return this.stack;
    }

    pop(){
        return this.stack.pop();
    }

    peek(){
        return this.stack[this.stack.length - 1];
    }

    clear(){
        this.stack = [];
    }
}