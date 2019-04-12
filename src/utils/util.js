import Vue from 'vue';
// 深拷贝
export function deepCopy(...args){
    return JSON.parse(JSON.stringify(args[0]));
}
// 获取变量类型
export function getVariType(vari){
    return Object.prototype.toString.call(vari).slice(8, -1).toLowerCase();
}
// 判断值是否为 undefined 或 null
export function isNil(val){
    return val === undefined || val === null;
}

// 获取vue对象
export function getVue(){
    let temp = Vue;
    if(temp) return temp;
    if(window.Vue) return window.Vue;
    return null;
}

// 判断是否为整数
export function isInteger(num){
    if(Number.isInteger) return Number.isInteger(num);

    let s = num + '';
    return !~s.indexOf('.');
}

// 判断是否含有某个class
export function hasClass(dom, className){
    let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    let domClassName = dom.className;
    return reg.test(domClassName);
    // return ~domClassName.indexOf(className);
}

// 从event.path中遍历查找包含某个class的元素
export function findParentThoughEvtPath(evtPath, parentClass, stopClass){
    let dom = null;
    for(let i = 0, l = evtPath.length; i < l; i++){
        dom = evtPath[i];
        if(hasClass(dom, parentClass)){
            return dom;
        }
        if(hasClass(dom, stopClass)){
            return null;
        }
    }
    return null;
}

export function getFirstSetValue(){
    let args = arguments;
    let l = args.length;
    for(let i = 0; i < l; i++){
        if(!isNil(args[i])) return args[i];
    }
    return args[l - 1];
}

export function forEachValue(obj, fn){
    Object.keys(obj).forEach(key => fn(obj[key], key));
}

export function getIndexOfArrayByAttr(arr, value, attr){
    for(let i = 0; i < arr.length; i++){
        if(attr){
            if(arr[i][attr] === value) return i;
        }else{
            if(arr[i] === value) return i;
        }
    }
    return -1;
}

function getEventPath(event){
    let target = event.target || null;
    let pathArr = [target];

    if(!target || !target.parentElement){
        return [];
    }

    while(target.parentElement){
        target = target.parentElement;
        pathArr.unshift(target);
    }

    return pathArr;
}

export function normalizeEvent(event){
    let evt = event;
    if(!evt.path){
        evt.path = (evt.composedPath && evt.composedPath()) || getEventPath(event);
    }
    return evt;
}

export function getUniqueID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // 参考rfc4122，https://tools.ietf.org/html/rfc4122
        var r;

        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}