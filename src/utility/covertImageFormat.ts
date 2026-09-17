export function convertImageExtention(param:string,width:number=320){
    if(typeof param!=="string") return param;

    // let thumb_url = param.replace(/^http:\/\//, "https://").replace('.jpg','').replace("/upload/",`/upload/f_webp/q_auto/w_${width}/`).;
    
    // return thumb_url;

    let secureUrl = param.replace(/^http:\/\//, "https://");

    // 2. Remove the trailing image extension (e.g., .jpg, .png, .jpeg) so f_auto can take over completely
    secureUrl = secureUrl.replace(/\.(jpg|jpeg|png|webp|gif|avif)\$/i, '');

    // 3. Inject the transformations safely into the last occurrence of /upload/
    const uploadIndex = secureUrl.lastIndexOf("/upload/");
    const transformedUrl = 
        secureUrl.slice(0, uploadIndex) + 
        `/upload/f_webp/q_auto/w_${width}/` + 
        secureUrl.slice(uploadIndex + 8);

    console.log(transformedUrl)

    return transformedUrl;
}