function $(el){
    return document.querySelector(el);
}
function _(el){
    return document.querySelectorAll(el);
}
function log(msg){
    // console.log(msg);
    $("#log").innerText+=msg.replace('\n','<br>');
}
function error_log(msg){
    // console.error(msg);
    $("#log").innerHTML+='<span color="red">'+msg.replace('\n','<br>')+'</span>';
}

function progName(url){ // returns program name from url
    url=url.split(/\//);
    return url[url.length-1]; //last one is our program name
}