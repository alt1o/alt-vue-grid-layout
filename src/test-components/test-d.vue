<template>
    <div>
        <h1>组件D</h1>
        <p>{{ altCardProps.card.name }}</p>
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
    props: ['altCardProps'],
    mounted(){
        console.log('mounted')
        this.$on('move', function(fff){
            console.log('move move move', fff)
        })
    },
    watch: {
        ccc(val, old){
            console.log('test-d ccc change', val, old);
        }
    }
})
</script>

<style>

</style>
