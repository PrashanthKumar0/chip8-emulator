// keyboard.js
/*

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
[NOTE : all must be uppercase ]
   */


function Keyboard(){
    this.KEY_MAP={
        // our key : their key
            '1':0x1,     '2':0x2,    '3':0x3,    '4':0xC,
            'Q':0x4,     'W':0x5,    'E':0x6,    'R':0xD,
            'A':0x7,     'S':0x8,    'D':0x9,    'F':0xE,
            'Z':0xA,     'X':0x0,    'C':0xB,    'V':0xF,
    };
 
    this.keypressed=[]; //i may have used bin operations

    this.keyDownListener=null;
    addEventListener('keydown',this.onKeyDown.bind(this));
    addEventListener('keyup',this.onKeyUp.bind(this));
}

Keyboard.prototype.onKeyDown=function(e){
    let key=String.fromCharCode(e.which).toUpperCase();
    
    let idx=this.keypressed.indexOf(this.KEY_MAP[key]);
    if(idx==-1){
        this.keypressed.push(this.KEY_MAP[key]);
        if(this.keyDownListener)    this.keyDownListener(this.KEY_MAP[key]);
        
    }
}


Keyboard.prototype.onKeyUp=function(e){
    let key=String.fromCharCode(e.which).toUpperCase();
    let idx=this.keypressed.indexOf(this.KEY_MAP[key]);
    if(idx>=0){
        this.keypressed.splice(idx,1);
    }
}

// Keyboard.prototype.isPressed=function(key){
//     return this.keypressed.includes(key);
// }