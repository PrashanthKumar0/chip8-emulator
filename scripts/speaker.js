function Speaker(freq=440){
    this.freq=freq||440;
    
    this.ctx=new AudioContext();
    this.gain=this.ctx.createGain();
    this.oscillator=this.ctx.createOscillator();
    this.oscillator.frequency.value=freq;
    this.oscillator.type="square";
    this.oscillator.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.pause();
    this.oscillator.start();
}
Speaker.prototype.play=function(){
    this.gain.gain.value=1;
}
Speaker.prototype.pause=function(){
    this.gain.gain.value=0;
}