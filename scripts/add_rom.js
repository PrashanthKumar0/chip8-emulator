//drawer.js for adding 

function add_rom_main(){
    let add_rom_toggle_btn=$("#toggleBtn");
    
    add_rom_toggle_btn.onclick=function(){
        let url=prompt('ENTER ROM URL');
        if(!url || url.replace(/\s/gm,'').length<=4){
            log('no url entered.');
        }else{
            try{
                let items=JSON.parse(localStorage.getItem('custom_roms'));
                if(!items.contains(url)) {
                    items.push(url);
                    localStorage.setItem('chip8_roms',JSON.stringify(items));
                    add_rom(url);
                }
            }catch(e){
                let arr=[url];
                localStorage.setItem('chip8_roms',JSON.stringify(arr));
                add_rom(url);                
            }
        }
    }
    try{
        let items=JSON.parse(localStorage['chip8_roms']);
        items.forEach(function(url) {
            add_rom(url);
        });
        log('\n'+items.length+" rom(s) found !\n")
    }catch(e){
        log('no roms saved');
    }

}


function add_rom(url){
    let name=progName(url);
    let el=document.createElement('option');
    el.value=url;
    el.innerText=name;
    $("#romSelection").appendChild(el);
}

addEventListener('load',add_rom_main);

