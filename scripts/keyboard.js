// keyboard.js
/*


FOR KEYBOARD

-----------------------------------------------------------
||        our mapping          ||    chip8-keyboard      ||   
-----------------------------------------------------------
||                             ||                        ||   
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | 1 | 2 | 3 | 4 |        ||  | 1 | 2 | 3 | C |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | Q | W | E | R |        ||  | 4 | 5 | 6 | D |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | A | S | D | F |        ||  | 7 | 8 | 9 | E |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | Z | X | C | V |        ||  | A | 0 | B | F |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||                             ||                        ||
-----------------------------------------------------------


FOR KEYPAD


-----------------------------------------------------------
||        our mapping          ||    chip8-keyboard      ||   
-----------------------------------------------------------
||                             ||                        ||   
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | 0 | 1 | 2 | 3 |        ||  | 1 | 2 | 3 | C |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | 4 | 5 | 6 | 7 |        ||  | 4 | 5 | 6 | D |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | 8 | 9 | A | B |        ||  | 7 | 8 | 9 | E |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||    | C | D | E | F |        ||  | A | 0 | B | F |     ||
||    +---+---+---+---+        ||  +---+---+---+---+     ||
||                             ||                        ||
-----------------------------------------------------------

[NOTE : all must be uppercase ]
   */


function Keyboard(keypad){
    this.keypad=keypad;

    this.KEYPAD_MAP={
            1:0,    2:1,      3:2,    0xc:3,
            4:4,    5:5,      6:6,    0xD:7,
            7:8,    8:9,    9:0xA,  0xE:0xB,
        0xA:0xC,  0:0xD,  0xB:0xE,  0xF:0xF
    };

    this.KEY_MAP={
        // our key : their key
            '1':0x1,     '2':0x2,    '3':0x3,    '4':0xC,
            'Q':0x4,     'W':0x5,    'E':0x6,    'R':0xD,
            'A':0x7,     'S':0x8,    'D':0x9,    'F':0xE,
            'Z':0xA,     'X':0x0,    'C':0xB,    'V':0xF,
    };
    
    this.keysAvailable=new Set();
    this.keypressed=[]; //i may have used bin operations

    this.shouldListen=false;
    this.keyDownListener=null;
    addEventListener('keydown',this.onKeyDown.bind(this));
    addEventListener('keyup',this.onKeyUp.bind(this));
}

Keyboard.prototype.onKeyDown=function(e){
    let key=this.KEY_MAP[String.fromCharCode(e.which).toUpperCase()];
    let idx=this.keypressed.indexOf(key);
    if(idx===-1 && key!==undefined){        
        this.keypad[this.KEYPAD_MAP[key]].classList.add('active');
        this.keypressed.push(key);
        if(this.keyDownListener && this.shouldListen)    this.keyDownListener(key);    
    }
}


Keyboard.prototype.onKeyUp=function(e){
    let key=String.fromCharCode(e.which).toUpperCase();
    let idx=this.keypressed.indexOf(this.KEY_MAP[key]);
    if(idx!==-1){
        this.keypad[this.KEYPAD_MAP[this.KEY_MAP[key]]].classList.remove('active');
        this.keypressed.splice(idx,1);
    }
}
Keyboard.prototype.isPressed=function(key){

    if((0x0<=key &&  key<0xF)){
        this.keypad[this.KEYPAD_MAP[key]].disabled=false;
    }
    
    return this.keypressed.includes(key);
}
Keyboard.prototype.enableAllKeypad=function(){
    this.keypad.forEach(function(kp){
        kp.disabled=false;
    })
}
Keyboard.prototype.disableAllKeypad=function(){
    this.keypad.forEach(function(kp){
        kp.disabled=true;
    })
}