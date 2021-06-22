// chip8.js | motherboard & motherboard (its a chipset lol)

function Chip8(screen,speaker,keyboard){
    this.screen=screen;
    this.speaker=speaker;
    this.keyboard=keyboard;

    this.romUrl=null;
    this.onRomLoaded=null; //this is a callback which would be used by end user
    
    
    this.ram=new Uint8Array(0xFFF+1); // 4kb ram 
    let wrapper=document.createElement('div');
    wrapper.classList.add('flex');
    let txt=document.createElement('span');
    txt.innerText='SPEED : ';
    this.speedEl=document.createElement('input');
    this.speedEl.style.flex='1';
    this.speedEl.setAttribute('type','number');
    this.speedEl.setAttribute('min','1');
    // this.speedEl.setAttribute('max','15');
    

    this.speedEl.onchange=function(){
        this.speed=Number(this.speedEl.value);
    }.bind(this);

    wrapper.appendChild(txt);
    wrapper.appendChild(this.speedEl);
    this.screen.cover.appendChild(wrapper);
    
    
    this.speed=this.speedEl.value=8;
    this.paused=true;
    this.halted=true; // initially our computer is off (must call reset to turn it on)
}

Chip8.prototype.fetchRom=function(url="./roms/BLINKY"){
    let req=new XMLHttpRequest();
    req.open("GET",url);
    req.responseType="arraybuffer";
    req.send();
    
    let _this=this;

    req.onload=function(){
        if(req.status==200){
            _this.loadRom(new Uint8Array(req.response),url);
        }else{
            _this.loadRom(new Uint8Array(0),null);//same as not loading    
        }
    }

}

Chip8.prototype.loadRom=function(rom,url){
    this.romUrl=url;
    // instructions are loaded from 0x200
    let end=rom.length;
    for(let i=0;i<end;i++){
        this.ram[0x200 + i]=rom[i]; // load the rom into ram
    }

    this.onRomLoaded(); // callback
}



Chip8.prototype.loadSprite=function(){
    
    //--[2.4 Display]---------------------------------- 
    var sprite=[ // quite tedious to copy from doc (took a lot of time)
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];
    //sprite must be stored in ram from 0x0 to 0x1FF
    for(let i=0;i<sprite.length;i++){
        this.ram[i]=sprite[i];
    }
}

// user calls reset after uploading program to chip8
// reset is something like power on button on cabinet
Chip8.prototype.reset=function(){
    if(this.romUrl==null){
        this.halted=true;
        throw new Error("No Roms Inserted!");
    }
    this.loadSprite();
    
    
    this.paused=false;
    this.halted=false;
    
    //*--[ 2.2  registers]--------------------------------------
        //*--[ psudo registers ]--------------------------------    
            this.PC=0x200;  //! program counter (should i keep this is cpu?)
            //since our program starts from 0x200 its set to it
            this.SP=0; //! Stack Pointer (8-bit) (can do it without this too but lets stick to specifaction .)
            // it is used to point to the topmost level of the stack.
            this.stack=[]; //! The stack is an array of 16 16-bit values  
            // used to store the address that the interpreter shoud return to when finished with a subroutine

        //*--[ general purpose registers ]----------------------
            this.V=new Uint8Array(16);  //general purpose registers 
            //! Vx register where x is from 0 to 0xF
            //! V[0xF] (VF) is used as flag for some instructions

            this.I=0;   //a 16-bit register called I. 
            //! This register is generally used to store memory addresses, 
            //so only the lowest (rightmost) 12 bits are usually used.

        //*--[ (2.5) special registers ]------------------------------
            // chip8 has 2 special 8bit registers
            this.DT=0; //delay timer 
            this.ST=0; // sound timer

    //*--[/ 2.2  registers]------------------------------------------------------------------------


    
    this.keyboard.keysAvailable=new Set();
    this.screen.clear();
    this.speaker.pause();

    
    // this.fetchRom(this.romUrl);


    this.fps=60; //60hz
    this.speed=this.speedEl.value=8;
    if(this.interval)clearInterval(this.interval);
    this.interval=setInterval(this.cycle.bind(this),1000/this.fps);
}
/*
//test #48 display INST Fx29
var n=0;
setInterval(function(){
    n++;
    n%=0xF+1;
    chip8.I=n*5;
    chip8.execute(0xD00F);
    screen.refresh();
    setTimeout(function(){
        chip8.I=n*5;
        chip8.execute(0xD00F);
    });
},1000)
*/

// var arrDbg=[];
// var countDbg=0;

Chip8.prototype.cycle=function(){
    if(this.halted){
        clearInterval(this.interval);
        return;
    }

    //execute everything 10 times (saw this freecodecamp tutorial using this for speeding up stuff)
    for(let a=0;a<this.speed;a++){   
        if(!this.paused){
            this.step();
        }
    }
    if(this.DT>0) this.DT--;

    if(this.ST>0){
        this.ST--;
        this.speaker.play();
    }else{
        this.speaker.pause();
    }
    
    
}

Chip8.prototype.step=function(){
            //  all instructions are 2 bytes long 
            //  (so we need to also fetch next instruction and combine both)
            //  we glue it by bitwise or (xxxxxxxx | yyyyyyyy)
            
            //  fetch
            let instruction=((this.ram[this.PC] << 8 ) | this.ram[this.PC+1]);
// debugger;
            //  console.log(instruction);
            if(instruction==undefined){
                console.log(this);
                debugger;
            }
            this.PC+=2; //  since we are dealing with 2 bytes
            //  todo: exception handling on execute
            this.execute(instruction);
        // this.screen.refresh(); //! see if its good here    
}

Chip8.prototype.execute=function(instruction){
    // 16 bit instruction (can be represented with 0000 0000 0000 0000  4 hex 0x0000 ) 
    let opcode=(instruction & 0xF000) >> 12; // we need first 4 bits from left for opcode .
    // in that 16 bit of instruction
    // 0000                 0000            0000            0000
    // first is opcode      secnod is a     third is b      fourth is c
    // todo: refactor this in clean way
    let a=(instruction & 0x0F00)   >> 8;
    let b=(instruction & 0x00F0)   >> 4;
    let c=(instruction & 0x000F);
    let bc=instruction & 0x00FF;
    instruction=(instruction & 0x0FFF); //finally the instruction without opcode
    
    switch(opcode){
    
        case 0x0://0nnn SYS addr
            switch(bc){
                case 0xE0: //00E0 CLS
                    this.screen.clear();
                break;
          
                case 0xEE: //00EE RET
                    this.PC=this.stack.pop(); //set pc to last element of stack
                    if(--this.SP < 0){
                        this.halted=true;
                        throw new Error ("Stack already empty");
                    }
                break;
                
                // default:
                //     this.halted=true;
                //     throw new Error("invalid 0x0 command");
            }
        break;
        
        case 0x1://1nnn //jump to nnn
            this.PC=instruction;    
        break;
        
        case 0x2://2nnn // Call addr
            this.SP++; // increment stack pointer
            this.stack.push(this.PC); // put pc in stack
            this.PC=instruction; // set pc to addr    
        break;

        case 0x3://3xkk // SE Vx , byte (increment pc by 2 if v[x]==kk)
            if(this.V[a]===(bc)){
                this.PC+=2;
            }
        break;
        
        case 0x4://4xkk // SNE Vx , byte (increment pc by 2 if v[x]!=kk)
            if(this.V[a]!==(bc)){
                this.PC+=2;
            }    
        break;
        
        case 0x5://5xy0 // SE Vx,Vy  (pc+=2 if Vx==Vy)
            if(c===0x0){ //? combine both ifs?
               if(this.V[a]===this.V[b]){
                    this.PC+=2;
                }
            }
        break;
        
        case 0x6://6xkk // LD Vx,byte (sets Vx=kk)
            this.V[a]=(bc);
        break;

        case 0x7://7xkk //ADD Vx, byte (Vx+=kk)
            this.V[a]+=(bc);
        break;

        case 0x8://8xyn  // operations between Vx and Vy (store in Vx)
            switch(c){

                case 0x0://8xy0 // LD Vx, Vy (Vx=Vy)
                    this.V[a]=this.V[b];
                break;

                case 0x1://8xy1 //OR Vx, Vy (Vx = Vx | Vy.)
                    this.V[a]|=this.V[b];
                break;
                
                case 0x2://8xy2 //AND Vx, Vy (Vx = Vx & Vy.)
                    this.V[a]&=this.V[b];
                break;
                
                case 0x3://8xy3 //XOR Vx, Vy (Vx = Vx ^ Vy.)
                    this.V[a]^=this.V[b];
                break;

                case 0x4://8xy4 //ADD Vx, Vy (Vx = Vx + Vy.)
                    this.V[0xF]=0;
                    this.V[a]+=this.V[b];
                    // set flag if sum exceeds
                    if(this.V[a]>0xFF) {
                        this.V[0xF]=1;
                        // only lowest 8 bis is kept
                        this.V[a]&=0xFF;
                    }
                break;
                
                case 0x5://8xy5 //SUB Vx, Vy (Vx = Vx - Vy.)
                    this.V[0xF]=0; // set Vf to 0 
                    
                    if(this.V[a] > this.V[b]) this.V[0xF]=1; // set not borrow to 1
                    //Vx=Vx-Vy
                    this.V[a]-=this.V[b]; // ! not to be confused with op 0x7
                break;

                case 0x6://8xy6 //SHR Vx
                    //shift right
                    this.V[0xF]=(this.V[a] & 0x1); //Vf is lsb 000x
                    this.V[a] >>=1; // same as dividing by 2 or shift right
                break;
                
                case 0x7://8xy7 //SUBN Vx, Vy
                    this.V[0xF]=0; // set Vf=0 
                    if(this.V[b]>this.V[a]) this.V[0xF]=1; //If Vy > Vx, then VF is set to 1
                    // Vx=Vy-Vx
                    this.V[a]=this.V[b]-this.V[a]; //! not to be confused with 0x5
                break;                    
                
                case 0xE://8xyE //SHL Vx {,Vy}
                    this.V[0xF]=(this.V[a] & 0x80); // 0x80 is 0b10000000 (our register is 8 bit)
                    this.V[a]<<=1; // same as multiplying by 2 or left bit shift  
                    this.V[a]&=0xFF;//make it 8 bit incase it overflows
                break;
                
            }
         
        break;
    
        case 0x9://9xy0
            // 9xy0 - SNE Vx, Vy
            //pc+=2 if Vx!=Vy
            if(c==0x0){ //? combine both ins single if?
                if(this.V[a]!==this.V[b]) this.PC+=2;
            }
        break;

        case 0xA://Annn // LD I,addr
            // Set  I=addr
            this.I=instruction;
        break;

        case 0xB://Bnnn // JP V0,addr
            //Jump to location addr + V0.
            this.PC=instruction+this.V[0];
        break;
    
        case 0xC://Cxkk //  RND Vx, byte
            //Set Vx = random byte AND kk
            this.V[a]=Math.floor(Math.random()*0xFF) & (bc);
        break;
    
        case 0xD://Dxyn // DRW Vx, Vy, nibble
        // if((this.V[a] == 1) && (this.V[b] > 0) && (this.V[b] < this.screen.rows-1)) debugger;
            this.V[0xF]=0;
            for(var y=0;y<c;y++){
                let sp=this.ram[this.I+y];
                for(var x=0;x<8;x++){//our sprite width is 8 bits
                    if((sp & (0x1 <<(8-1-x))) > 0){
                        if(this.screen.setPixel(this.V[a]+x,this.V[b]+y)){
                            this.V[0xF]=1;
                        }else{
                            // this.screen.refresh();
                        }
                    }
                }
                
            }
            if(!this.V[0xF]) this.screen.refresh();
            // this.screen.refresh();
        break;
    
        case 0xE://Ennn // KBD
            switch((bc)){
                case 0x9E://Ex9E
                    //  SKP Vx
                    //PC+=2 next instruction if key with the value of Vx is pressed.
                    if(this.keyboard.isPressed(this.V[a])){
                        this.PC+=2; 
                    }
                    //0 in case false 1 on true //not using if
                break;

                case 0xA1://ExA1 // SKNP Vx
                    //Skip next instruction if key with the value of Vx is not pressed
                    if(!this.keyboard.isPressed(this.V[a])){
                        this.PC+=2;
                    }
                break;
            }
        break;

        case 0xF://Fnnn
            switch((bc)){
                case 0x07://Fx07 //LD Vx, DT
                    //Set Vx = delay timer value
                    this.V[a]=this.DT;
                break;

                case 0x0A://Fx0A // LD Vx, K
                    //Wait for a key press, store the value of the key in Vx.
                    this.paused=true;
                    this.keyboard.shouldListen=true;
                    this.keyboard.enableAllKeypad();
                    this.keyboard.keyDownListener=function(key){
                        this.V[a]=key;
                        this.keyboard.disableAllKeypad();
                        this.keyboard.shouldListen=false;
                        this.paused=false;
                    }.bind(this);
                break;

                case 0x15://Fx15 // LD DT, Vx
                    this.DT=this.V[a];
                break;
                
                case 0x18://Fx18 // LD ST, Vx
                    this.ST=this.V[a];
                break;

                case 0x1E://Fx1E // ADD I, Vx
                    this.I+=this.V[a];
                break;
                
                case 0x29://Fx29 // LD F, Vx
                    // Set I = location of sprite for digit Vx
                    this.I=this.V[a]*5; //since our sprite stride is 5  stored contigeously
                break;
                
                case 0x33://Fx33 // LD B, Vx
                    //Store BCD representation of Vx in memory locations I, I+1, and I+2.
                    // bcd is nothing but lets take a number 876
                    //bcd representation is just 8   7   6
                    this.ram[this.I]=parseInt(this.V[a]/100); //(100s digit) 8 in our case
                    this.ram[this.I+1]=parseInt((this.V[a]%100)/10); //(10s digit) 7 in our case
                    this.ram[this.I+2]=parseInt(this.V[a]%10); //(1s digit) 7 in our case
                break;

                case 0x55://Fx55 // LD [I], Vx
                    // if(a>=0xF) throw new Error ("cant access register which is not available") 
                    for(let i=0;i<=a;i++){
                        this.ram[this.I+i]=this.V[i];
                    } 
                break;
                    
                case 0x65://Fx65 //LD Vx, [I]
                    // if(x>=0xF) throw new Error ("cant access register which is not available") 
                    for(let i=0;i<=a;i++){
                        this.V[i]=this.ram[this.I+i];
                    }
                break;
            
            }
        break;
    
    }   
}
