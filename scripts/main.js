// main.js is bootstraps whole system

let screen,speaker,keyboard;
let chip8;
let keypad;
const baseUrl='.';

function main(){
    screen=new Screen($('#display-container'));
    speaker=new Speaker();
    
    keypad=_('#keyPad > .key-row > button');
    keyboard=new Keyboard(keypad);

    chip8=new Chip8(screen,speaker,keyboard);
    $('#romSelection').focus();
    $('#romSelection').childNodes.forEach(function(el){
        el.value=baseUrl+"/roms/"+el.value;
    });
    
    $('#romSelection').onchange=function(e){
        e.target.blur();
        loadRom(e.target.value);
    }
    
    keypad.forEach(function(el,key){
        el.disabled=true;
        el.setAttribute('ontouchstart','keyboard.onKeyDown({"which":"'+el.innerText+'".codePointAt(0)});');
        el.setAttribute('onmousedown','keyboard.onKeyDown({"which":"'+el.innerText+'".codePointAt(0)});');
        //could use event listeners?
        document.body.setAttribute('onmouseup','keyboard.keypressed=[];');
        document.body.setAttribute('ontouchend','keyboard.keypressed=[];');
    })


}



function loadRom(url){
    chip8.fetchRom(url);
    $("#loader").style.display="block";
    // todo : implement onError callback in chip8.js ?
    chip8.onRomLoaded=function(){
        log("rom ( "+ chip8.romUrl+ " ) loaded successfully!")
        log("booting...");
        try{
            chip8.reset();
            log("booted chip8...");
            log("chip8 running "+progName(chip8.romUrl)); //progName from utils.js
            
            keyboard.disableAllKeypad();
            $("#loader").style.display="none";
        }catch(e){
            error_log(e);
            error_log("failed booting...\n");            
        }
    }
}

onload=main;
