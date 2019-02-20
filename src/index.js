// import Vue from "vue";
import VueGridLayout from './grid.vue';
import GridItem from './components/GridItem.vue';
import GridLayout from './components/GridLayout.vue';

// Vue.component('AltVueGridLayout', VueGridLayout);

function factory(){
    let grid = {
        ...VueGridLayout,
        components: {
            GridLayout,
            GridItem,
        }
    };

    return grid;
}

// export default VueGridLayout;
export default {
    createGrid: factory
};