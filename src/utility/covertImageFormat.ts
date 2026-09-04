export function convertImageExtention(param:string){
    if(typeof param!==param) return param;

    return param.replace(/\.jpe?g(?=([?#]|$))/gi,'.webp');
}