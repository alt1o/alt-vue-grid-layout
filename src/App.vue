<template>
    <div id="app">
        <h1 style="text-align: center">Vue Grid Layout</h1>
        <h2>{{ txt }}</h2>
        <div>
            <div class="layoutJSON">
                Displayed as <code>[x, y, w, h]</code>:
                <div class="columns">
                    <div class="layoutItem" v-for="item in layout" :key="item.i">
                        <b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
                    </div>
                </div>
            </div>
        </div>
        <div id="content">
            <input type="checkbox" v-model="draggable"/> Draggable
            <input type="checkbox" v-model="resizable"/> Resizable
            <div style="margin-top: 10px;margin-bottom: 10px;">
                Row Height: <input type="number" v-model="rowHeight"/> Col nums: <input type="number" v-model="colNumStr"/>
            </div>
            right margin <input type="number" v-model="margin[0]" />
            bottom margin <input type="number" v-model="margin[1]" />
            background color <input type="text" v-model="bgcolor">
            <button @click="addItem">addItem</button>
            <button @click="go(-1)">goback</button>
            <button @click="go(1)">goforward</button>
            <div id="container">
                <grid 
                    :layout.sync="layout"
                    class="nihao"
                    :is-draggable="draggable"
                    :is-resizable="resizable"
                    :row-height="Number(rowHeight)"
                    :margin="margin"
                    :backgroundColor="bgcolor"
                    :col-num="colNum"
                    grid-item-class="ceshi-global-item"
                    close-handler-class="ceshi-global-close"
                    resize-handler-class="alt-g-i-r-h-default-style"
                    placeholder-class="ceshi-global-placeholder"
                    ref="altGrid" ></grid>
            </div>
        </div>
    </div>
</template>

<script>
    // import {getDocumentDir, setDocumentDir} from "./helpers/DOM";
    import GridLayout from './index';
    import testA from './test-components/test-a.vue';
    import testB from './test-components/test-b.vue';
    import testD from './test-components/test-d.vue';

    let Grid = GridLayout.createGrid();
    // console.log(Grid)
    Grid.addWidgetType({
        'testA': testA,
        'testB': testB
    })
    // Grid.addWidgetType('testA', testA);
    // Grid.addWidgetType('testB', testB);
    Grid.addWidgetType('testC', {
        mounted(){
            console.log('mounted');
            this.$el.innerHTML += 'heello world'
            this.$on('resize', (a, b) => {
                console.log('components resize', a, b, arguments);
            })
        }
    })
    Grid.addWidgetType('testD', testD);

    let testLayout = [
        {"x":0,"y":0,"w":2,"h":2,"i":"0", maxW: 3, maxH: 3, name:'nihaowxl', type: 'testA', resizable: true, isDraggable: true},
        {"x":2,"y":0,"w":3,"h":2,"i":"1", minH: 2, minW: 2, type: 'testB', resizable: null, isDraggable: null},
        {"x":5,"y":0,"w":2,"h":2,"i":"2", type: 'testC', resizable: false, isDraggable: true},
        {"x":7,"y":0,"w":4,"h":2,"i":"3", gridItemClass: 'ceshi-class', closeHandlerClass:"ceshi-close-class", resizeHandlerClass:"ceshi-resize-class", resizable: false, draggable: false},
        {"x":11,"y":0,"w":1,"h":2,"i":"4", type: 'testD', name: 'wakaka', resizable: false, isDraggable: true},
        // {"x":10,"y":0,"w":2,"h":2,"i":"5", resizable: false, draggable: false},
        {"x":0,"y":2,"w":2,"h":2,"i":"6", resizable: false, isDraggable: true},
        {"x":2,"y":2,"w":2,"h":2,"i":"7", resizable: false, isDraggable: true, isShowOriginCloseBtn: true}
    ];
    let layout2 = [
        { x: 0, y: 0, w: 8, h: 6},
        { x: 0, y: 6, w: 6, h: 6}
    ]

    export default {
        name: 'app',
        components: {
            Grid
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
                bgcolor: 'rgba(0,  0, 0, 0.5)'
            }
        },
        watch: {
            colNumStr(val){
                this.colNum = Number(val) || 12;
            },
            layout(){
                console.log('layout change');
            }
        },
        mounted: function () {
            // this.$refs.altGrid.setLayout(this.layout);
            setTimeout(() => {
            //    this.$refs.altGrid.setLayout(this.layout2); 
            //    this.$refs.altGrid.addItem({ x: 0, y: 0, w: 6, h: 6 }); 
                // this.$refs.altGrid.deleteItem(this.$refs.altGrid.layout[0]._id);
                this.layout[0].name = 'aafffffff'
            }, 2000);
            // this.$refs.grid2.setLayout(this.layout);
        },
        methods: {
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
    }
</script>

<style>
    /* #container {
        height: 500px;
        overflow: auto;
        width: 1083px;
    } */
</style>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
