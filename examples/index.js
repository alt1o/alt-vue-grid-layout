
Vue.use(AltVueGridLayout.altStore);

let store = new AltVueGridLayout.altStore.Store({
    state: {
        count: 0
    },
    mutations: {
        add(state){
            state.count++;
        }
    }
})

let testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0", maxW: 3, maxH: 3, name:'nihaowxl', type: 'testA', resizable: true, isDraggable: true},
    {"x":2,"y":0,"w":3,"h":2,"i":"1", name: '123', minH: 2, minW: 2, type: 'testB', resizable: null, isDraggable: null},
    {"x":5,"y":0,"w":2,"h":2,"i":"2", name: '22', type: 'testC', resizable: false, isDraggable: true},
    {"x":7,"y":0,"w":4,"h":2,"i":"3", name: '334', gridItemClass: 'ceshi-class', closeHandlerClass:"ceshi-close-class", resizeHandlerClass:"ceshi-resize-class", resizable: false, draggable: false},
    {"x":11,"y":0,"w":1,"h":2,"i":"4", type: 'testD', name: 'wakaka', resizable: false, isDraggable: true},
    // {"x":10,"y":0,"w":2,"h":2,"i":"5", resizable: false, draggable: false},
    {"x":0,"y":2,"w":2,"h":2,"i":"6", name: '1222', resizable: false, isDraggable: true},
    {"x":2,"y":2,"w":2,"h":2,"i":"7", name: '13', resizable: false, isDraggable: true, isShowOriginCloseBtn: true}
];
let layout2 = [
    { x: 0, y: 0, w: 8, h: 6},
    { x: 0, y: 6, w: 6, h: 6}
]

let app = new Vue({
    name: 'app',
    el: '#app',
    altStore: store,
    components: {
        Grid: AltVueGridLayout.Grid
    },
    props: {
        txt: String
    },
    data () {
        return {
            layout: JSON.parse(JSON.stringify(testLayout)),
            layout2: JSON.parse(JSON.stringify(layout2)),
            draggable: true,
            resizable: true,
            rowHeight: 150,
            colNumStr: 12,
            colNum: 12,
            margin: [1, 1],
            bgcolor: 'rgba(0,  0, 0, 0.5)',
            isGridShow: true
        }
    },
    watch: {
        colNumStr(val){
            this.colNum = Number(val) || 12;
        },
        layout(){
            console.log('layout change');
        },
        count(val, oldVal){
            console.log('count change', val, oldVal);
        }
    },
    computed: {
        count(){
            return this.$altStore.state.count;
        }
    },
    mounted: function () {
        // this.$refs.altGrid.setLayout(this.layout);
        setTimeout(() => {
            this.isGridShow = true;
        //    this.$refs.altGrid.setLayout(this.layout2); 
        //    this.$refs.altGrid.addItem({ x: 0, y: 0, w: 6, h: 6 }); 
            // this.$refs.altGrid.deleteItem(this.$refs.altGrid.layout[0]._id);
            this.layout[0].name = 'aafffffff'
        }, 2000);
        // this.$refs.grid2.setLayout(this.layout);
    },
    methods: {
        gridUpdated(){
            console.log('grid updated');
        },
        go: function(num){
            this.$refs.altGrid.go(num);
        },
        clicked: function(index) {
            this.layout.splice(index, 1);
            // window.alert("CLICK!");
        },
        removeItem: function(item) {
            //console.log("### REMOVE " + item.i);
            this.layout.splice(this.layout.indexOf(item), 1);
        },
        addItem: function() {
            this.$refs.altGrid.addItem();
        },
        move: function(item){
            console.log("MOVE i=" + item.i + ", X=" + item.x + ", Y=" + item.y);
            this.$emit('move', item);
        },
        resize: function(item, newSize){
            console.log("RESIZE i=" + item.i + ", H=" + item.h + ", W=" + item.w + ", H(px)=" + newSize.height + ", W(px)=" + newSize.width);
            this.$emit('resize', item);
        },
        moved: function(item){
            console.log("### MOVED i=" + item.i + ", X=" + item.x + ", Y=" + item.y);
            this.$emit('moved', item);
        },
        resized: function(item, newSize){
            console.log("### RESIZED i=" + item.i + ", H=" + item.h + ", W=" + item.w + ", H(px)=" + newSize.height + ", W(px)=" + newSize.width);
            this.$emit('resized', item);
        }
    },
})