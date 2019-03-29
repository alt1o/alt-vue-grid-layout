import StackWithDepth from './utils/stack';

export default class HistoryStack {
    constructor(options = {}){
        this.undo = new StackWithDepth({
            maxDepth: options.maxDepth
        });
        this.redo = new StackWithDepth();
    }

    push(params){
        this.undo.push(params);
        this.redo.clear();
    }

    go(posNumber){
        if(posNumber > 0){
            return this.goForward(posNumber);
        }else{
            return this.goBackward(Math.abs(posNumber));
        }
    }

    goForward(num){
        let empty = { value: [] };
        if(!this.redo.length) return empty;
        while(num--){
            let temp = this.redo.pop();
            this.undo.push(temp);
        }

        return this.undo.peek() || empty;
    }

    goBackward(num){
        let empty = { value: [] };
        if(!this.undo.length || !(this.undo.length - 1)) return empty;
        while(num--){
            let temp = this.undo.pop();
            this.redo.push(temp);
        }

        return this.undo.peek() || empty;
    }
}