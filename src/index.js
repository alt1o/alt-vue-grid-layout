// import Vue from "vue";
import VueGridLayout from './components/grid.vue';
import altStore from './alt-store/index'

// Vue.component('AltVueGridLayout', VueGridLayout);

// export default VueGridLayout;
export default {
    Grid: VueGridLayout,
    altStore: altStore
};