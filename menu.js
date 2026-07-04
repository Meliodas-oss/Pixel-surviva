(function(){
'use strict'; const PS=window.PS;
class MenuUI{
  constructor(engine){
    this.engine=engine;
    this.done=false;
    this.fastMode=new URLSearchParams(location.search).has('fast')||localStorage.getItem('PS_FAST_MENU')==='1';
    this.splashDuration=this.fastMode?120:900;
    this.createParticles();
    this.bind();
    this.skipHandler=()=>this.showMain();
    document.getElementById('splashScreen')?.addEventListener('pointerdown',this.skipHandler,{once:true});
    setTimeout(()=>this.showMain(),this.splashDuration);
  }
  createParticles(){
    const box=document.getElementById('splashParticles');if(!box)return;
    const coarse=matchMedia('(pointer: coarse)').matches;
    const low=(navigator.hardwareConcurrency||4)<=4;
    const count=this.fastMode?10:(coarse||low?22:38);
    for(let i=0;i<count;i++){
      const p=document.createElement('i');p.className='particle';
      p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';
      p.style.color=['#49d17d','#4ba3ff','#ffd166','#b56cff'][i%4];
      p.style.setProperty('--dx',(Math.random()*360-180)+'px');
      p.style.setProperty('--dy',(Math.random()*220-110)+'px');
      p.style.animationDelay=(Math.random()*.25)+'s';
      box.appendChild(p);
    }
  }
  bind(){
    document.getElementById('btnStart').onclick=()=>this.engine.startGame(true);
    document.getElementById('btnContinue').onclick=()=>{if(this.engine.systems.save.load(0))this.engine.startGame(false);};
    document.getElementById('btnSettings').onclick=()=>this.showSettings();
    document.getElementById('btnControls').onclick=()=>this.showControls();
    document.getElementById('btnCredits').onclick=()=>this.showCredits();
    document.getElementById('btnRespawn').onclick=()=>this.engine.systems.player.respawn();
    document.getElementById('btnLoadDeath').onclick=()=>{if(this.engine.systems.save.load(0))this.engine.startGame(false);};
    document.getElementById('btnMenuDeath').onclick=()=>this.engine.showMenu();
    document.getElementById('openSettingsInGame').onclick=()=>this.showSettings();
  }
  showMain(){
    if(this.done)return;this.done=true;
    const splash=document.getElementById('splashScreen');
    splash?.removeEventListener('pointerdown',this.skipHandler);
    splash?.classList.add('hidden');
    this.engine.showMenu();
  }
  panel(title,html){
    const p=document.getElementById('panel');p.dataset.kind='menu';p.classList.remove('hidden');
    p.innerHTML=`<h2>${title}</h2>${html}<div class="toolbar"><button onclick="document.getElementById('panel').classList.add('hidden')">Close</button></div>`;
  }
  showSettings(){
    this.panel('⚙️ Settings',`<p>Landscape Lock ist aktiv. In Web2App zusätzlich Orientation = Landscape setzen.</p><label><input type="checkbox" ${this.engine.settings.lowEnd?'checked':''} onchange="PS.app.lowEnd=this.checked;PS.app.settings.lowEnd=this.checked"> Low-end FPS optimization</label><br><label><input type="checkbox" ${this.engine.settings.showLighting?'checked':''} onchange="PS.app.settings.showLighting=this.checked"> Dynamic lighting</label><br><label><input type="checkbox" ${localStorage.getItem('PS_FAST_MENU')==='1'?'checked':''} onchange="localStorage.setItem('PS_FAST_MENU',this.checked?'1':'0')"> Fast menu / Splash fast überspringen</label><br><label>Volume <input type="range" min="0" max="1" step=".05" value="${this.engine.settings.volume}" oninput="PS.app.settings.volume=+this.value"></label>`);
  }
  showControls(){this.panel('🎮 Controls Tutorial',`<p><b>PC:</b> WASD move, W/Space jump, Mouse/Space attack, E mine/interact, Q use hotbar, I inventory, C craft, M map, B destroy mode, R rotate.</p><p><b>Mobile:</b> Left joystick movement, right joystick aim, ATT attack, ACT mine/interact, DOD dodge, INV inventory, CRF crafting.</p><p><b>Splash:</b> Tippen/Klicken überspringt sofort.</p>`);}
  showCredits(){this.panel('⭐ Credits',`<p><b>MADE BY WCPO</b></p><p>Modular HTML5 Pixel Survival Engine. Arena/GPT/Web-Generator compatible. No external servers required.</p>`);}
}
PS.MenuUI=MenuUI;
})();
