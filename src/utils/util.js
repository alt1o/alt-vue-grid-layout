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