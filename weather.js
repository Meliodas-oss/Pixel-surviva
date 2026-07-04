(function(){
'use strict'; const PS=window.PS,U=PS.Utils;
class WeatherSystem{
  constructor(engine){this.engine=engine;this.type='clear';this.intensity=0;this.wind=0;this.timer=12;}
  isNight(){const h=(this.engine.dayTime%(60*24))/60;return h>=20||h<5;}
  timeString(){const h=(this.engine.dayTime%(60*24))/60,m=(h%1)*60;return String(h|0).padStart(2,'0')+':'+String(m|0).padStart(2,'0');}
  update(dt){this.engine.dayTime+=dt*4;this.timer-=dt;if(this.timer<=0){this.timer=U.rnd(30,85);const r=Math.random();this.type=r<.45?'clear':r<.62?'rain':r<.75?'storm':r<.86?'snow':r<.95?'heatwave':'wind';this.intensity=this.type==='clear'?0:U.rnd(.25,1);this.wind=this.type==='storm'||this.type==='wind'?U.rnd(-1,1)*80:U.rnd(-1,1)*20;this.engine.toast('Weather: '+this.type,'#4ba3ff');}}
  serialize(){return{type:this.type,intensity:this.intensity,wind:this.wind,timer:this.timer};} deserialize(d){if(d)Object.assign(this,d);}
}
PS.WeatherSystem=WeatherSystem;
})();
