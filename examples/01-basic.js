var testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0", type: 'type1', name: 'type1'},
    {"x":2,"y":0,"w":3,"h":2,"i":"1", type: 'type2', name: 'type2'},
    {"x":5,"y":0,"w":2,"h":2,"i":"2", type: 'type3', name: 'type3'},
    {"x":7,"y":0,"w":4,"h":2,"i":"3"},
    {"x":11,"y":0,"w":1,"h":2,"i":"4"},
    {"x":10,"y":0,"w":2,"h":2,"i":"5"},
    {"x":0,"y":5,"w":2,"h":2,"i":"6"},
    {"x":2,"y":5,"w":2,"h":2,"i":"7"}
];
let type1 = {
    mounted(){
        this.$el.innerHTML += 'hhhhwxlfsdf' + this.itemInfo.name
    }
}
let type2 = {
    template: '<p>hhhhh{{itemInfo.name}}</p>'
}

let type3 = Vue.extend({
    template: 'fff<h1>{{itemInfo.name}}</h1>'
})

let Grid = AltVueGridLayout.createGrid();

Grid.addWidgetType({
    type1: type1,
    type2: type2,
    type3: type3
})
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
