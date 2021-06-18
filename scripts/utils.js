function $(el){
    return document.querySelector(el);
}
function log(msg){
    console.log(msg);
}
function error_log(msg){
    console.error(msg);
}

function progName(url){ // returns program name from url
    url=url.split(/\//);
    return url[url.length-1]; //last one is our program name

}