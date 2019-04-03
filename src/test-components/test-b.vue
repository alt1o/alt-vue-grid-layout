<template>
    <div>
        <h1>b 组件</h1>
        <p>{{ injectedProps.card.w }}</p>
    </div>
</template>
<script>
export default {
    updated(){
        console.log('updated b');
    }
}
</script>
