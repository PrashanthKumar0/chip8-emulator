// main.js is bootstraps whole system

let screen,speaker,keyboard;
let chip8;

function main(){
    screen=new Screen($('#display-container'));
    speaker=new Speaker();
    keyboard=new Keyboard();

    chip8=new Chip8(screen,speaker,keyboard);
    // chip8.fetchRom("roms/BLINKY");
    // chip8.fetchRom("./roms/BLITZ");
    // chip8.fetchRom("./roms/CONNECT4");
    // chip8.fetchRom("./roms/INVADERS");
    // chip8.fetchRom("./roms/LANDING");
    // chip8.fetchRom("./roms/MAZE");
    // chip8.fetchRom("./roms/PONG");
    // chip8.fetchRom("./roms/SPACE");
    // chip8.fetchRom("./roms/TANK");
    // chip8.fetchRom("./roms/TETRIS");
    // chip8.fetchRom("roms/TICTACTOE");
    // chip8.fetchRom("./roms/TRON");
    chip8.fetchRom("./roms/WALL");

    // chip8.fetchRom("roms/EMPTY");
    
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
