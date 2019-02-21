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