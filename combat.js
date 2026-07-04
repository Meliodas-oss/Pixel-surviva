(function(){
'use strict'; const PS=window.PS,U=PS.Utils;
class CombatSystem{
  constructor(engine){this.engine=engine;this.projectiles=[];this.slashes=[];}
  attack(){const p=this.engine.systems.player,inv=this.engine.systems.inventory;if(p.attackTimer>0)return;const eq=inv.equipment.weapon||inv.hotbarSlot();const item=eq?PS.Items[eq.id]:PS.Items.wood_sword;if(!item)return;p.attackTimer=item.cooldown||.45;p.anim='attack';p.combo=(p.combo+1)%3;const crit=Math.random()<(.06+p.skills.combat*.01);const dmg=(item.damage||8)*(crit?1.8:1)*(1+p.combo*.08);const aim=this.engine.systems.input.aim;const ax=aim.x||p.facing,ay=aim.y||0;if(item.ranged){this.projectiles.push({x:p.x,y:p.y-6,vx:ax*620,vy:ay*620,dmg,life:(item.range||480)/620,owner:'player',status:item.status});this.engine.systems.audio?.play('bow');}else{this.slashes.push({x:p.x,y:p.y,ax,ay,r:item.range||58,t:.14,dmg,status:item.status,crit});this.hitMelee(p.x,p.y,ax,ay,item.range||58,dmg,item.status);this.engine.systems.audio?.play('attack');}if(eq&&eq.meta){eq.meta.durability=(eq.meta.durability||item.durability||100)-1;if(eq.meta.durability<=0){this.engine.toast(`${item.name} broke`,'#f05265');eq.count=0;}}p.addXP(1,'combat');}
  hitMelee(x,y,ax,ay,range,dmg,status){const ai=this.engine.systems.ai;for(const e of ai.enemies){if(e.dead)continue;const d=U.dist(x,y,e.x,e.y),ang=Math.atan2(e.y-y,e.x-x),ba=Math.atan2(ay,ax),diff=Math.abs(((ang-ba+Math.PI*3)%(Math.PI*2))-Math.PI);if(d<range+e.r&&(diff<1.05||d<30))ai.damageEnemy(e,dmg,status,Math.sign(ax)*90);}}
  dodge(){const p=this.engine.systems.player;if(p.dodge>0||p.stats.stamina<22)return;p.stats.stamina-=22;p.dodge=.23;p.invuln=.38;this.engine.systems.audio?.play('dodge');}
  update(dt){const ai=this.engine.systems.ai,p=this.engine.systems.player;for(const q of this.projectiles){q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.owner==='player'){for(const e of ai.enemies){if(!e.dead&&U.dist(q.x,q.y,e.x,e.y)<e.r+7){ai.damageEnemy(e,q.dmg,q.status,Math.sign(q.vx)*80);q.life=0;break;}}}else if(U.dist(q.x,q.y,p.x,p.y)<p.w){p.damage(q.dmg,q.status);q.life=0;}}this.projectiles=this.projectiles.filter(q=>q.life>0);this.slashes.forEach(s=>s.t-=dt);this.slashes=this.slashes.filter(s=>s.t>0);}
  serialize(){return{projectiles:this.projectiles};}
  deserialize(d){this.projectiles=d?.projectiles||[];}
}
PS.CombatSystem=CombatSystem;
})();
