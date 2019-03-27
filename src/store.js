import { getVue } from './utils/util'
import AltStore from './alt-store/index.js'
import HistoryStack from './history'

let Vue = getVue();
Vue.use(AltStore);
export default function createStore(){
    return new AltStore.Store({
        state: {
            counter: {
                total: 0,
                detail: {
                    move: 0,
                    moved: 0,
                    resize: 0,
                    resized: 0
                }
            },
            log: [],
            historyStack: new HistoryStack({ maxDepth: 10 })
        },
        mutations: {
            log(state, payload) {
                let type = payload.type;
                if (state.counter.detail[type] === undefined) {
                    Vue.set(state.counter.detail, type, 0);
                }
                state.log.push(payload);
    
                state.counter.total++;
                state.counter.detail[type]++;
            },
            addHistory(state, payload){
                state.historyStack.push(payload);
            }
        }
    });
}