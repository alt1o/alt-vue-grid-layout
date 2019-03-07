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

export function getVue(){
    let temp = Vue;
    if(temp) return temp;
    if(window.Vue) return window.Vue;
    return null;
}

export function isInteger(num){
    if(Number.isInteger) return Number.isInteger(num);

    let s = num + '';
    return !~s.indexOf('.');
}

export function hasClass(dom, className){
    let classList = dom.classList;
    return ~classList.indexOf(className);
}