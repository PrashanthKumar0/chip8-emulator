// main.js is bootstraps whole system

let screen,speaker,keyboard;
let chip8;

const baseUrl='.';

function main(){
    screen=new Screen($('#display-container'));
    speaker=new Speaker();
    keyboard=new Keyboard();

    chip8=new Chip8(screen,speaker,keyboard);
    $('#romSelection').focus();
    $('#romSelection').onchange=function(e){
        e.target.blur();
        loadRom(e.target.value);
    }
    



}



function loadRom(name){
    
    chip8.fetchRom(baseUrl+"/roms/"+name);

    // todo : implement onError callback in chip8.js ?
    chip8.onRomLoaded=function(){
        log("rom ( "+ chip8.romUrl+ " ) loaded successfully!")
        log("booting...");
        try{
            chip8.reset();
            log("booted chip8...");
            log("chip8 running "+progName(chip8.romUrl)); //progName from utils.js
        }catch(e){
            error_log(e);
            error_log("failed booting...\n");            
        }
    }
}

onload=main;
