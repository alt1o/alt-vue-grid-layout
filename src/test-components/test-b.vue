<template>
    <div>
        <h1>b 组件</h1>
        <p>{{ altCardProps.card.w }}</p>
        <input type="text">
    </div>
</template>
<script>
export default {
    props: ['altCardProps'],
    updated(){
        console.log('updated b');
    }
}
</script>
