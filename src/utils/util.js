export function deepCopy(...args){
    return JSON.parse(JSON.stringify(args[0]));
}