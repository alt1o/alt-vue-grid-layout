function watchBoxSizeChange(el, handler){
    if(!(el instanceof HTMLElement)){
        throw new TypeError('第一个参数必须是一个html元素');
    }

    if(/^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(el.tagName)){
        throw new TypeError('不支持当前元素类型，可以尝试使用div')
    }

    if(typeof handler !== 'function'){
        throw new TypeError('第二个参数必须是一个函数');
    }

    this.el = el;
    this.handler = handler;
    this.hadInitScrollListener = false;

    this.checkHidden();
}
watchBoxSizeChange.prototype.checkHidden = function checkHidden(){
    requestAnimationFrame(() => {
        let width = this.el.offsetWidth;
        let height = this.el.offsetHeight;
        if(width === 0 && height === 0){
            this.checkHidden();
        }else{
            this.handler();
            this.init();
            this.hadInitScrollListener = true;
        }
    })
}


watchBoxSizeChange.prototype.init = function init(){
    // 最后一次变动的宽高
    this.lastWidth = this.el.offsetWidth || 1;
    this.lastHeight = this.el.offsetHeight || 1;

    // 最大宽高
    this.maxWidth = 10000 * (this.lastWidth);
    this.maxHeight = 10000 * (this.lastHeight);

    // 变动宽高
    this.newWidth = 0;
    this.newHeight = 0;

    this.expand = document.createElement('div');
    this.expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;';

    this.shrink = this.expand.cloneNode(false);

    let expandChild = document.createElement('div');

    expandChild.style.cssText = 'transition:0s;animation:none;';
    let shrinkChild = expandChild.cloneNode(false);

    expandChild.style.width = this.maxWidth + 'px';
    expandChild.style.height = this.maxHeight + 'px';
    shrinkChild.style.width = '250%';
    shrinkChild.style.height = '250%';

    this.expand.appendChild(expandChild);
    this.shrink.appendChild(shrinkChild);

    this.el.appendChild(this.expand);
    this.el.appendChild(this.shrink);

    if(this.expand.offsetParent !== this.el){
        this.el.style.position = 'relative';
    }

    this.expand.scrollTop = this.shrink.scrollTop = this.maxHeight;
    this.expand.scrollLeft = this.shrink.scrollLeft = this.maxWidth;

    this.bindOnScroll = null;
    this.addListener();
}

watchBoxSizeChange.prototype.onScroll = function onScroll(){
    this.newWidth = this.el.offsetWidth || 1;
    this.newHeight = this.el.offsetHeight || 1;
    if(this.newWidth !== this.lastWidth || this.newHeight !== this.lastHeight){
        requestAnimationFrame(this.onResize.bind(this));
    }
    this.expand.scrollTop = this.shrink.scrollTop = this.maxHeight;
    this.expand.scrollLeft = this.shrink.scrollLeft = this.maxWidth;
}

watchBoxSizeChange.prototype.onResize = function onResize(){
    this.lastWidth = this.newWidth;
    this.lastHeight = this.newHeight;
    this.handler(this.lastWidth, this.lastHeight);
}

watchBoxSizeChange.prototype.addListener = function addListener(){
    this.bindOnScroll = this.onScroll.bind(this);
    this.expand.addEventListener('scroll', this.bindOnScroll, false)
    this.shrink.addEventListener('scroll', this.bindOnScroll, false)
}

watchBoxSizeChange.prototype.removeListener = function removeListener(){
    this.expand.removeEventListener('scroll', this.bindOnScroll, false)
    this.shrink.removeEventListener('scroll', this.bindOnScroll, false)
}

watchBoxSizeChange.prototype.destroy = function destroy(){
    if(this.hadInitScrollListener){
        this.removeListener();
        this.el.removeChild(this.expand);
        this.el.removeChild(this.shrink);
    }
}

export default watchBoxSizeChange;