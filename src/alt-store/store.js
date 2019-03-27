import mixin from './mixin'
import { forEachValue } from './util'

let Vue;
export class AltStore {
    constructor(options){
        this._mutations = Object.create(null);
        
        this.initVm(options.state);
        this.initMutations(options.mutations);
    }

    get state(){
        return this._vm._data.$$state;
    }

    set state(v){
        console.error('cannot set state directly.');
    }

    commit(type, payload){
        let entry = this._mutations[type];
        if(!entry){
            console.error('[altStore] unknown commit type.');
            return;
        }

        entry.forEach((handler) => {
            handler(payload);
        })
    }

    getOriginState(){
        return this._vm._data.$$state;
    }

    initMutations(mutations){
        let store = this;
        let state = this.getOriginState();
        forEachValue(mutations, (handler, key) => {
            const entry = store._mutations[key] || (store._mutations[key] = []);
            entry.push(function wrapperHandler(payload) {
                handler.call(store, state, payload);
            })
        })
    }

    initVm(state){
        const oldVm = this._vm;

        this._vm = new Vue({
            data: {
                $$state: state
            }
        })

        if(oldVm){
            Vue.nextTick(() => oldVm.$destroy())
        }
    }
}

export function install(_Vue){
    if(Vue && _Vue === Vue){
        if(process.env.NODE_ENV !== 'production'){
            console.error(
                '[AltStore] already installed.'
            )
        }
        return;
    }

    Vue = _Vue;
    mixin(Vue);
}