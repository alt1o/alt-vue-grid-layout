<template>
    <div>
        <h1>组件D</h1>
        <p>{{ itemInfo.name }}</p>
        <p>{{ text }}</p>
    </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
    name: 'test-d',
    data(){
        return {
            text: 'text content'
        }
    },
    mounted(){
        console.log('mounted')
    }
})
</script>

<style>

</style>
