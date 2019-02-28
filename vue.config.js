module.exports = {
    configureWebpack: {
        output: {
            library: "AltVueGridLayout",
            libraryExport: 'default'
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue'
            }
        }
    },
    css: {
        extract: false
    }
}