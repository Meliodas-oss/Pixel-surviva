(function(){
'use strict';
class AudioSystem{
  constructor(engine){this.engine=engine;this.ctx=null;this.ambient=null;this.enabled=true;}
  init(){if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(AC)this.ctx=new AC();}}
  play(name){if(!this.enabled)return;this.init();if(!this.ctx)return;const map={attack:[420,.05,'square'],bow:[760,.04,'square'],mine:[250,.05,'square'],build:[520,.05,'triangle'],craft:[720,.08,'triangle'],hurt:[120,.08,'sawtooth'],death:[70,.5,'sawtooth'],jump:[500,.035,'triangle'],dodge:[900,.035,'triangle'],eat:[620,.06,'sine'],equip:[680,.04,'triangle'],level:[880,.14,'sine']};const m=map[name]||[440,.06,'square'];const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=m[2];o.frequency.value=m[0];g.gain.value=(this.engine.settings.volume||.5)*.08;g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+m[1]);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+m[1]);}
  startAmbient(){this.init();}
  update(dt){/* lightweight procedural ambient hook */}
}
PS.AudioSystem=AudioSystem;
})();
