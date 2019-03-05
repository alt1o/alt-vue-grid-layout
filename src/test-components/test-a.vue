<template>
    <div>
        <h1 @click="_close">a组件-包含vue生命周期，以及close事件</h1> 
        <p>{{ injectedProps.card.name }}</p>
    </div>
</template>

<script>
export default {
    methods: {
        _close(){
            this.injectedProps.close();
        }
    },
    beforeCreate(){
            console.log('before create');
        },
        created(){
            console.log('create');
        },
        beforeMount(){
            console.log('before mount');
        },
        mounted(){
            console.log('mounted');
        },
        beforeUpdate(){
            console.log('before update');
        },
        updated(){
            console.log('updated');
        },
        activated(){
            console.log('activated');
        },
        deactivated(){
            console.log('deactivated');
        },
        beforeDestroy(){
            console.log('before destroy');
        },
        destroyed(){
            console.log('destroyed');
        },
        errorCaptured(){
            console.log('error captured');
        }
}
</script>

