function $(el){
    return document.querySelector(el);
}
function _(el){
    return document.querySelectorAll(el);
}
function log(msg){
    // console.log(msg);
    let l=$('#log');
    l.innerHTML+=msg+'\n'.replace('\n','<br>');
    l.scroll(0,l.scrollHeight);
}
function error_log(msg){
    // console.error(msg);
    let l=$('#log');
    l.innerHTML+='<span color="red">'+msg+'\n'.replace('\n','<br>')+'</span>';
    l.scroll(0,l.scrollHeight);
}

function progName(url){ // returns program name from url
    url=url.split(/\//);
    return url[url.length-1]; //last one is our program name
}