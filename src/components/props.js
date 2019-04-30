let props = {
    layout: {
        type: Array,
        default: () => []
    },
    isDraggable: { // 是否可以拖拽
        type: Boolean,
        default: true
    },
    isResizable: { // 是否可以调整大小
        type: Boolean,
        default: true
    },
    rowHeight: { // 每行高度
        type: Number,
        default: 150,
        validator: function(value){
            return !isNaN(value) && (value > 0);
        }
    },
    maxRows: { // 最大
        type: Number,
        default: Infinity
    },
    margin: {
        type: Array,
        default: () => [10, 10]
    }, // 元素的右边距和下边距
    colNum: { // 列数
        type: Number,
        default: 12
    },
    backgroundColor: { // 背景颜色
        type: String,
        default: 'rgba(200,200,200,1)'
    },
    gridItemClass: { // 每一个卡片的class
        type: String,
        default: ''
    },
    closeHandlerClass: { // 关闭按钮的class
        type: String,
        default: ''
    },
    resizeHandlerClass: { // 设置大小按钮的class
        type: String,
        default: 'alt-g-i-r-h-default-style'
    },
    placeholderClass: { // 拖拽时 placeholder 的class
        type: String,
        default: ''
    },
    isShowOriginCloseBtn: {
        type: Boolean,
        default: true
    },
    width: {
        type: [Number, Boolean],
        default: false
    }
}

export default props;