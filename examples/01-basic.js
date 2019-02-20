var testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0"},
    {"x":2,"y":0,"w":3,"h":2,"i":"1"},
    {"x":5,"y":0,"w":2,"h":2,"i":"2"},
    {"x":7,"y":0,"w":4,"h":2,"i":"3"},
    {"x":11,"y":0,"w":1,"h":2,"i":"4"},
    {"x":10,"y":0,"w":2,"h":2,"i":"5"},
    {"x":0,"y":5,"w":2,"h":2,"i":"6"},
    {"x":2,"y":5,"w":2,"h":2,"i":"7"}
];

let Grid = AltVueGridLayout.createGrid();
new Vue({
    el: '#app',
    components: {
        Grid
    },
    data: {
        layout: testLayout,
        draggable: true,
        resizable: true,
        index: 0
    },
    mounted: function(){
        this.$refs.grid.setLayout(this.layout);
    }
});
