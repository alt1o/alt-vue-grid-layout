// import Vue from "vue";
import VueGridLayout from './components/grid.vue';

// Vue.component('AltVueGridLayout', VueGridLayout);

function factory(){
    let grid = {
        ...VueGridLayout,
        components: {}
    };

    return grid;
}

// export default VueGridLayout;
export default {
    createGrid: factory,
    grid: VueGridLayout
};