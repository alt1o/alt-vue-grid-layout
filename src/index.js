// import Vue from "vue";
import VueGridLayout from './components/grid.vue';
import altStore from './alt-store/index'

// Vue.component('AltVueGridLayout', VueGridLayout);

function factory(options = {}){

    let grid = {
        ...VueGridLayout,
        components: {}
    };

    if(options.altStore && options.altStore instanceof altStore.Store){
        grid.altStore = options.altStore;
    }

    return grid;
}

// export default VueGridLayout;
export default {
    createGrid: factory,
    grid: VueGridLayout,
    altStore: altStore
};