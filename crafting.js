(function(){
'use strict'; const PS=window.PS;
class CraftingSystem{
  constructor(engine){this.engine=engine;this.discovered=new Set(['wood_sword','stone_pickaxe','torch','workbench','wood_wall','farm_plot']);this.category='all';this.auto=false;}
  can(recipe){const inv=this.engine.systems.inventory,world=this.engine.systems.world,p=this.engine.systems.player;return this.discovered.has(recipe.id)&&inv.has(recipe.req)&&world.stationNear(p.x,p.y,recipe.station);}
  craft(id){const r=PS.Recipes.find(x=>x.id===id||x.out===id);if(!r)return;if(!this.discovered.has(r.id)){this.engine.toast('Recipe not discovered','#f05265');return;}const world=this.engine.systems.world,p=this.engine.systems.player;if(!world.stationNear(p.x,p.y,r.station)){this.engine.toast('Need station: '+r.station,'#ff9f43');return;}const inv=this.engine.systems.inventory;if(!inv.take(r.req)){this.engine.toast('Missing ingredients','#f05265');return;}const item=PS.Items[r.out],meta={};if(item.durability)meta.durability=item.durability;inv.add(r.out,r.count,meta);p.addXP(5,'crafting');this.discoverNearby();this.engine.systems.audio?.play('craft');this.engine.toast(`Crafted ${item.icon} ${item.name}`,'#49d17d');this.engine.ui.craftingUI?.render();}
  discoverNearby(){for(const r of PS.Recipes){if(this.discovered.has(r.id))continue;if(Math.random()<.08){this.discovered.add(r.id);this.engine.toast('Discovered recipe: '+PS.Items[r.out].name,'#b56cff');break;}}
  }
  update(dt){if(!this.auto&&!this.engine.settings.autoCraft)return;if(this.engine.frame%60!==0)return;const r=PS.Recipes.find(x=>this.can(x)&&['torch','berry'].includes(x.out));if(r)this.craft(r.id);}
  serialize(){return{discovered:[...this.discovered],auto:this.auto};}
  deserialize(d){if(!d)return;this.discovered=new Set(d.discovered||[...this.discovered]);this.auto=!!d.auto;}
}
PS.CraftingSystem=CraftingSystem;
})();
