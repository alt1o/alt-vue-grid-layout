<template>
    <div id="app">
        <h1 style="text-align: center">Vue Grid Layout</h1>
        <h2>{{ txt }}</h2>
        <!--<pre>{{ layout | json }}</pre>-->
        <div>
            <div class="layoutJSON">
                Displayed as <code>[x, y, w, h]</code>:
                <div class="columns">
                    <div class="layoutItem" v-for="item in layout" :key="item.i">
                        <b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
                    </div>
                </div>
            </div>
            <!--<div class="layoutJSON">
                Displayed as <code>[x, y, w, h]</code>:
                <div class="columns">
                    <div class="layoutItem" v-for="item in layout2">
                        <b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
                    </div>
                </div>
            </div>-->
        </div>
        <div id="content">
            <!-- <button @click="decreaseWidth">Decrease Width</button>
            <button @click="increaseWidth">Increase Width</button> -->
            <button @click="addItem">Add an item</button>
            <!-- Add to show rtl support -->
            <!-- <button @click="changeDirection">Change Direction</button>  -->
            <input type="checkbox" v-model="draggable"/> Draggable
            <input type="checkbox" v-model="resizable"/> Resizable
            <!-- <input type="checkbox" v-model="mirrored"/> Mirrored -->
            <input type="checkbox" v-model="responsive"/> Responsive
            <div style="margin-top: 10px;margin-bottom: 10px;">
                Row Height: <input type="number" v-model="rowHeight"/> Col nums: <input type="number" v-model="colNum"/>
            </div>
            right margin <input type="number" v-model="margin[0]" />
            bottom margin <input type="number" v-model="margin[1]" />
            opacity(0 - 10) <input type="number" v-model="opacity">
            background color <input type="text" v-model="bgcolor">
            <button @click="addItem">addItem</button>
            <div id="container">
                <grid ref="altGrid" ></grid>
            </div>
        </div>
    </div>
</template>

<script>
    // import {getDocumentDir, setDocumentDir} from "./helpers/DOM";
    import Grid from './grid.vue';
    import testA from './test-components/test-a.vue';
    import testB from './test-components/test-b.vue';

    // console.log(Grid)
    Grid.addWidgetType('testA', testA);
    Grid.addWidgetType('testB', testB);
    Grid.addWidgetType('testC', {
        mounted(){
            this.$el.innerHTML += 'heello world'
        }
    })

    let testLayout = [
        {"x":0,"y":0,"w":2,"h":2,"i":"0", name:'nihaowxl', type: 'testA', resizable: true, draggable: true},
        {"x":2,"y":0,"w":3,"h":2,"i":"1", type: 'testB', resizable: null, draggable: null},
        {"x":5,"y":0,"w":2,"h":2,"i":"2", type: 'testC', resizable: false, draggable: false},
        {"x":7,"y":0,"w":4,"h":2,"i":"3", resizable: false, draggable: false},
        {"x":11,"y":0,"w":1,"h":2,"i":"4", resizable: false, draggable: false},
        {"x":10,"y":0,"w":2,"h":2,"i":"5", resizable: false, draggable: false},
        {"x":0,"y":5,"w":2,"h":2,"i":"6", resizable: false, draggable: false},
        {"x":2,"y":5,"w":2,"h":2,"i":"7", resizable: false, draggable: false}
    ];

    export default {
        name: 'app',
        components: {
            // ResponsiveGridLayout,
            Grid
        },
        props: {
            txt: String
        },
        data () {
            return {
                layout: JSON.parse(JSON.stringify(testLayout)),
                draggable: true,
                resizable: true,
                mirrored: false,
                responsive: true,
                rowHeight: 150,
                colNum: 12,
                index: 0,
                margin: [3, 3],
                opacity: 100,
                bgcolor: '#eee'
            }
        },
        mounted: function () {
            this.$refs.altGrid.setLayout(this.layout);
        },
        methods: {
            clicked: function(index) {
                this.layout.splice(index, 1);
                // window.alert("CLICK!");
            },
            increaseWidth: function() {
                let width = document.getElementById("content").offsetWidth;
                width += 20;
                document.getElementById("content").style.width = width+"px";
            },
            decreaseWidth: function() {
                let width = document.getElementById("content").offsetWidth;
                width -= 20;
                document.getElementById("content").style.width = width+"px";
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
    #container {
        height: 500px;
        overflow: auto;
    }
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
