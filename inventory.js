(function(){
'use strict'; const PS=window.PS;
class InventorySystem{
  constructor(engine){this.engine=engine;this.size=36;this.slots=Array.from({length:this.size},()=>null);this.hotbar=Array.from({length:9},(_,i)=>i);this.selectedHotbar=0;this.dragIndex=null;this.equipment={helmet:null,chest:null,boots:null,weapon:null,shield:null};this.add('wood_sword',1,{durability:PS.Items.wood_sword.durability});this.add('stone_pickaxe',1,{durability:PS.Items.stone_pickaxe.durability});this.add('berry',5);this.add('wood',12);this.add('stone',8);this.add('seed',4);}
  item(id){return PS.Items[id]||{id,name:id,icon:'?',stack:99,weight:1};}
  add(id,count=1,meta={}){let item=this.item(id),left=count,stackMax=item.stack||99;for(let s of this.slots){if(!s||s.id!==id)continue;const space=stackMax-s.count;if(space>0){const n=Math.min(space,left);s.count+=n;left-=n;if(left<=0)return true;}}for(let i=0;i<this.size&&left>0;i++){if(!this.slots[i]){const n=Math.min(stackMax,left);this.slots[i]={id,count:n,meta:{...meta}};left-=n;}}if(left>0)this.engine.toast('Inventory full','#f05265');this.engine.ui.inventoryUI?.render();return left<=0;}
  remove(id,count=1){if(this.count(id)<count)return false;let left=count;for(let i=0;i<this.size;i++){const s=this.slots[i];if(!s||s.id!==id)continue;const n=Math.min(s.count,left);s.count-=n;left-=n;if(s.count<=0)this.slots[i]=null;if(left<=0)break;}this.engine.ui.inventoryUI?.render();return true;}
  has(req){return Object.entries(req).every(([id,n])=>this.count(id)>=n);}
  take(req){if(!this.has(req))return false;Object.entries(req).forEach(([id,n])=>this.remove(id,n));return true;}
  count(id){return this.slots.reduce((a,s)=>a+(s&&s.id===id?s.count:0),0);}
  weight(){let w=0;for(const s of this.slots)if(s)w+=(this.item(s.id).weight||0)*s.count;for(const s of Object.values(this.equipment))if(s)w+=(this.item(s.id).weight||0);return w;}
  maxWeight(){return 52+(this.engine.systems.player?.skills?.survival||0)*4;}
  hotbarSlot(){return this.slots[this.hotbar[this.selectedHotbar]];}
  useHotbar(){const s=this.hotbarSlot();if(!s)return;this.useSlot(this.hotbar[this.selectedHotbar]);}
  useSlot(i){const s=this.slots[i];if(!s)return;const it=this.item(s.id);if(['weapon','tool','armor','shield'].includes(it.type)||it.slot){this.equip(i);return;}if(it.type==='food'||it.type==='drink'||it.type==='consumable'){const p=this.engine.systems.player;p.stats.hunger=PS.Utils.clamp(p.stats.hunger+(it.food||0),0,100);p.stats.thirst=PS.Utils.clamp(p.stats.thirst+(it.water||0),0,100);if(it.heal)p.heal(it.heal);if(it.cleanse)p.status[it.cleanse]=0;this.remove(s.id,1);this.engine.systems.audio?.play('eat');this.engine.toast(`${it.icon} Used ${it.name}`,'#49d17d');return;}if(it.type==='seed'){this.engine.systems.farming?.plantSelected(s.id);return;}if(it.block||it.type==='station'){this.engine.systems.building.selectedItem=s.id;this.engine.toast(`Build selected: ${it.name}`,'#ffd166');}}
  equip(i){const s=this.slots[i];if(!s)return;const it=this.item(s.id);let slot=it.slot;if(it.type==='weapon')slot='weapon';if(it.type==='tool')slot='weapon';if(it.type==='shield')slot='shield';if(!slot)return;const old=this.equipment[slot];this.equipment[slot]=s;this.slots[i]=old||null;this.engine.systems.audio?.play('equip');this.engine.toast(`Equipped ${it.icon} ${it.name}`,'#4ba3ff');this.engine.ui.inventoryUI?.render();}
  move(a,b){if(a===b)return;const t=this.slots[a];this.slots[a]=this.slots[b];this.slots[b]=t;this.engine.ui.inventoryUI?.render();}
  dropOnDeath(){const drops=[];for(let i=9;i<this.size;i++){const s=this.slots[i];if(s&&Math.random()<.35){drops.push(s);this.slots[i]=null;}}return drops;}
  serialize(){return{slots:this.slots,equipment:this.equipment,selectedHotbar:this.selectedHotbar};}
  deserialize(d){if(!d)return;this.slots=d.slots||this.slots;this.equipment=d.equipment||this.equipment;this.selectedHotbar=d.selectedHotbar||0;}
}
PS.InventorySystem=InventorySystem;
})();
