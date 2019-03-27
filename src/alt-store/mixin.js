export default function mixin(Vue){
    Vue.mixin({
        beforeCreate: altStoreInit
    })

    function altStoreInit(){
        const options = this.$options;

        if(options.altStore){
            this.$altStore = options.altStore;
        }else if(options.parent && options.parent.$altStore){
            this.$altStore = options.parent.$altStore;
        }
    }
}