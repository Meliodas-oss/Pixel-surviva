(function(){
'use strict'; const PS=window.PS;
class SaveSystem{
  constructor(engine){this.engine=engine;this.slot=0;this.autoTimer=0;this.slots=3;}
  key(slot=this.slot){return PS.Config.savePrefix+slot;}
  newGame(){const p=this.engine.systems.player;p.initSpawn();this.engine.systems.inventory.slots.forEach((s,i)=>{});this.engine.systems.ai.enemies=[];}
  save(slot=this.slot){const e=this.engine;const data={version:PS.Config.version,time:e.time,dayTime:e.dayTime,player:e.systems.player.serialize(),inventory:e.systems.inventory.serialize(),world:e.systems.world.serialize(),combat:e.systems.combat.serialize(),ai:e.systems.ai.serialize(),crafting:e.systems.crafting.serialize(),building:e.systems.building.serialize(),farming:e.systems.farming.serialize(),weather:e.systems.weather.serialize(),settings:e.settings};localStorage.setItem(this.key(slot),JSON.stringify(data));this.engine.toast('Saved slot '+(slot+1),'#4ba3ff');}
  load(slot=this.slot){const raw=localStorage.getItem(this.key(slot));if(!raw){this.engine.toast('No save in slot '+(slot+1),'#f05265');return false;}try{const d=JSON.parse(raw),e=this.engine;e.dayTime=d.dayTime||360;e.systems.player.deserialize(d.player);e.systems.inventory.deserialize(d.inventory);e.systems.world.deserialize(d.world);e.systems.combat.deserialize(d.combat);e.systems.ai.deserialize(d.ai);e.systems.crafting.deserialize(d.crafting);e.systems.building.deserialize(d.building);e.systems.farming.deserialize(d.farming);e.systems.weather.deserialize(d.weather);e.settings=d.settings||e.settings;this.engine.toast('Loaded slot '+(slot+1),'#4ba3ff');return true;}catch(err){console.error(err);this.engine.toast('Save corrupted','#f05265');return false;}}
  has(slot=0){return !!localStorage.getItem(this.key(slot));}
  update(dt){this.autoTimer+=dt;if(this.autoTimer>=PS.Config.autoSaveSeconds){this.autoTimer=0;this.save(this.slot);}}
}
PS.SaveSystem=SaveSystem;
})();
