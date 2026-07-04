(function(){
'use strict'; const PS=window.PS,U=PS.Utils;
class FarmingSystem{
  constructor(engine){this.engine=engine;this.crops=[];this.season=0;this.seasons=['Spring','Summer','Autumn','Winter'];}
  plantSelected(seedId='seed'){const p=this.engine.systems.player,w=this.engine.systems.world,inv=this.engine.systems.inventory;const tx=Math.floor(p.x/w.tile),ty=Math.floor((p.y+p.h/2)/w.tile)+1;if(w.tileDefs[w.getTile(tx,ty)]?.farm!==true)return this.engine.toast('Need farm plot','#ff9f43');if(!inv.remove(seedId,1))return;this.crops.push({x:tx,y:ty-1,seed:seedId,stage:0,water:40,t:0});this.engine.toast('Seed planted','#49d17d');}
  waterAt(tx,ty){const c=this.crops.find(c=>c.x===tx&&c.y===ty);if(c){c.water=100;this.engine.toast('Crop watered','#4ba3ff');}}
  harvestAt(tx,ty){const i=this.crops.findIndex(c=>c.x===tx&&c.y===ty&&c.stage>=3);if(i<0)return false;const c=this.crops[i];this.engine.systems.inventory.add(c.seed==='wheat_seed'?'cooked_meat':'berry',U.irnd(2,5));this.crops.splice(i,1);this.engine.systems.player.addXP(4,'survival');return true;}
  update(dt){this.season=(Math.floor(this.engine.dayTime/(60*24*3))%4);for(const c of this.crops){c.t+=dt;c.water=Math.max(0,c.water-3*dt);let rate=(c.water>0?1:.25);if(this.seasons[this.season]==='Winter')rate*=.45;if(c.t>18/rate&&c.stage<3){c.t=0;c.stage++;}}}
  serialize(){return{crops:this.crops,season:this.season};} deserialize(d){if(d){this.crops=d.crops||[];this.season=d.season||0;}}
}
PS.FarmingSystem=FarmingSystem;
})();
