<template>
    <div>
        <h1 @click="_close">a组件</h1> 
        <p>{{ itemInfo.name }}</p>
    </div>
</template>

<script>
export default {
    methods: {
        _close(){
            this.close();
        }
    }
}
</script>

