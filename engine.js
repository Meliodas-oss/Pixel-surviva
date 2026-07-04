(function(){
  'use strict';
  const PS = window.PS = window.PS || {};

  PS.Config = {
    version: 'landscape-modular-1.0.0',
    tile: 32,
    chunkTiles: 24,
    gravity: 1350,
    maxDt: 0.05,
    savePrefix: 'PS_MODULAR_LANDSCAPE_SLOT_',
    autoSaveSeconds: 10,
    targetFps: 60,
    startMode: 'splash',
    landscapeQuery: 'v=landscape-modular-1'
  };

  PS.Utils = {
    clamp(v,a,b){return Math.max(a,Math.min(b,v));},
    lerp(a,b,t){return a+(b-a)*t;},
    dist(a,b,c,d){return Math.hypot(a-c,b-d);},
    norm(x,y){const l=Math.hypot(x,y)||1;return [x/l,y/l];},
    rnd(a,b){return a+Math.random()*(b-a);},
    irnd(a,b){return Math.floor(a+Math.random()*(b-a+1));},
    hash(x,y,s=1337){let h=(x*374761393+y*668265263+s*1442695041)|0;h^=h>>>13;h=Math.imul(h,1274126177);return(h^(h>>>16))>>>0;},
    rand2(x,y,s=1337){return PS.Utils.hash(x,y,s)/4294967295;},
    key(x,y,z=0){return x+','+y+','+z;},
    now(){return performance.now()/1000;},
    deepCopy(o){return JSON.parse(JSON.stringify(o));},
    fmt(n){return Math.floor(n).toString();}
  };

  const baseItems = {
    wood:{id:'wood',name:'Wood',icon:'🪵',type:'material',rarity:'common',weight:.2,stack:999,desc:'Basic building and crafting resource.'},
    stone:{id:'stone',name:'Stone',icon:'🪨',type:'material',rarity:'common',weight:.35,stack:999,desc:'Used for tools, walls and furnaces.'},
    fiber:{id:'fiber',name:'Plant Fiber',icon:'🌿',type:'material',rarity:'common',weight:.05,stack:999,desc:'Rope, bandages and light armor material.'},
    coal:{id:'coal',name:'Coal',icon:'⚫',type:'fuel',rarity:'common',weight:.25,stack:999,desc:'Fuel for furnaces and torches.'},
    iron:{id:'iron',name:'Iron Ore',icon:'⛓️',type:'material',rarity:'rare',weight:.55,stack:999,desc:'Smeltable ore for iron age gear.'},
    gold:{id:'gold',name:'Gold Ore',icon:'🟡',type:'material',rarity:'rare',weight:.55,stack:999,desc:'Advanced circuits, luxury gear and upgrades.'},
    crystal:{id:'crystal',name:'Energy Crystal',icon:'💎',type:'material',rarity:'epic',weight:.3,stack:999,desc:'Powers magic, lasers and mythic tools.'},
    obsidian:{id:'obsidian',name:'Obsidian',icon:'◼️',type:'material',rarity:'epic',weight:.65,stack:999,desc:'Volcanic endgame block.'},
    seed:{id:'seed',name:'Berry Seed',icon:'🌱',type:'seed',rarity:'common',weight:.02,stack:99,desc:'Plant on soil and water it.'},
    wheat_seed:{id:'wheat_seed',name:'Wheat Seed',icon:'🌾',type:'seed',rarity:'common',weight:.02,stack:99,desc:'Seasonal crop seed.'},
    berry:{id:'berry',name:'Berry',icon:'🍓',type:'food',rarity:'common',weight:.05,stack:99,food:18,water:3,desc:'Restores hunger.'},
    water_flask:{id:'water_flask',name:'Water Flask',icon:'💧',type:'drink',rarity:'common',weight:.25,stack:20,water:35,desc:'Restores thirst.'},
    cooked_meat:{id:'cooked_meat',name:'Cooked Meat',icon:'🍖',type:'food',rarity:'rare',weight:.25,stack:20,food:42,desc:'High hunger restore.'},
    heal_potion:{id:'heal_potion',name:'Healing Potion',icon:'❤️',type:'consumable',rarity:'rare',weight:.1,stack:20,heal:45,desc:'Restores health.'},
    antidote:{id:'antidote',name:'Antidote',icon:'🧴',type:'consumable',rarity:'rare',weight:.1,stack:20,cleanse:'poison',desc:'Cleanses poison.'},
    torch:{id:'torch',name:'Torch',icon:'🔥',type:'block',block:'torch',rarity:'common',weight:.1,stack:99,desc:'Light source for caves.'},
    dirt_block:{id:'dirt_block',name:'Dirt Block',icon:'🟫',type:'block',block:'dirt',rarity:'common',weight:.4,stack:999,desc:'Placeable terrain block.'},
    wood_wall:{id:'wood_wall',name:'Wood Wall',icon:'🧱',type:'block',block:'woodWall',rarity:'common',weight:.35,stack:999,desc:'Basic house wall.'},
    stone_wall:{id:'stone_wall',name:'Stone Wall',icon:'🧱',type:'block',block:'stoneWall',rarity:'common',weight:.5,stack:999,desc:'Stronger defensive wall.'},
    door:{id:'door',name:'Door',icon:'🚪',type:'block',block:'door',rarity:'common',weight:.6,stack:20,desc:'House entry block.'},
    trap:{id:'trap',name:'Spike Trap',icon:'🪤',type:'block',block:'trap',rarity:'rare',weight:.8,stack:50,desc:'Damages enemies.'},
    farm_plot:{id:'farm_plot',name:'Farm Plot',icon:'🟩',type:'block',block:'farm',rarity:'common',weight:.4,stack:99,desc:'Allows planting crops.'},
    workbench:{id:'workbench',name:'Workbench',icon:'🪚',type:'station',block:'workbench',rarity:'common',weight:4,stack:5,station:'workbench',desc:'Unlocks better recipes.'},
    furnace:{id:'furnace',name:'Furnace',icon:'🔥',type:'station',block:'furnace',rarity:'rare',weight:7,stack:3,station:'furnace',desc:'Smelting station.'},
    anvil:{id:'anvil',name:'Anvil',icon:'⚒️',type:'station',block:'anvil',rarity:'rare',weight:8,stack:3,station:'anvil',desc:'Metal crafting station.'},
    wood_sword:{id:'wood_sword',name:'Wood Sword',icon:'🗡️',type:'weapon',rarity:'common',weight:1.2,damage:14,range:58,cooldown:.42,durability:80,desc:'Starter melee weapon.'},
    stone_pickaxe:{id:'stone_pickaxe',name:'Stone Pickaxe',icon:'⛏️',type:'tool',rarity:'common',weight:1.6,damage:10,harvest:2,durability:120,desc:'Mines stone and ore.'},
    bow:{id:'bow',name:'Hunter Bow',icon:'🏹',type:'weapon',rarity:'rare',weight:1.4,damage:22,range:480,cooldown:.55,ranged:true,durability:130,desc:'Ranged weapon.'},
    iron_sword:{id:'iron_sword',name:'Iron Sword',icon:'⚔️',type:'weapon',rarity:'rare',weight:2.1,damage:35,range:64,cooldown:.36,durability:200,desc:'Iron age melee weapon.'},
    crystal_bow:{id:'crystal_bow',name:'Crystal Bow',icon:'💠',type:'weapon',rarity:'epic',weight:1.8,damage:48,range:620,cooldown:.44,ranged:true,status:'freeze',durability:260,desc:'Shoots freezing crystal arrows.'},
    obsidian_blade:{id:'obsidian_blade',name:'Obsidian Blade',icon:'🌋',type:'weapon',rarity:'legendary',weight:2.8,damage:78,range:72,cooldown:.31,status:'burn',durability:360,desc:'Mythic volcanic blade.'},
    leather_helmet:{id:'leather_helmet',name:'Leather Helmet',icon:'🪖',type:'armor',slot:'helmet',rarity:'common',weight:.8,armor:.04,desc:'Light head armor.'},
    leather_chest:{id:'leather_chest',name:'Leather Chest',icon:'🥋',type:'armor',slot:'chest',rarity:'common',weight:1.4,armor:.08,desc:'Light chest armor.'},
    leather_boots:{id:'leather_boots',name:'Leather Boots',icon:'🥾',type:'armor',slot:'boots',rarity:'common',weight:.7,armor:.03,speed:.04,desc:'Movement friendly boots.'},
    iron_chest:{id:'iron_chest',name:'Iron Chestplate',icon:'🛡️',type:'armor',slot:'chest',rarity:'rare',weight:3.8,armor:.18,desc:'Heavy iron defense.'},
    crystal_shield:{id:'crystal_shield',name:'Crystal Shield',icon:'🔰',type:'shield',slot:'shield',rarity:'epic',weight:2.2,armor:.12,desc:'Blocks part of incoming damage.'}
  };

  const prefix = ['Ancient','Burning','Frozen','Shadow','Golden','Mithril','Crystal','Wild','Storm','Toxic','Solar','Lunar','Runic','Obsidian','Royal','Echoing'];
  const weaponNames = ['Blade','Axe','Spear','Bow','Dagger','Hammer','Sabre','Repeater'];
  const armorNames = ['Helmet','Chestguard','Boots','Shield','Mask','Cloak'];
  const toolNames = ['Pickaxe','Drill','Axe','Hammer','Scanner','Saw'];
  const foodNames = ['Stew','Elixir','Ration','Berry Mix','Tea','Jerky'];
  const blockNames = ['Wall','Trap','Lamp','Door','Tower','Bridge','Gate'];
  const rarities = ['common','rare','epic','legendary'];
  const icons = {weapon:['🗡️','🪓','🔱','🏹','🪃','⚔️'], armor:['🛡️','🥋','🪖','🥾','🌑'], tool:['⛏️','🪓','🔨','🧲','🪚'], food:['🍲','🧪','🍖','🍓','🍵'], block:['🧱','🪤','🏮','🚪','🗼']};
  const generated = {};
  let serial = 1;
  function addGenerated(type, names, count){
    for(let i=0;i<count;i++){
      const tier = 1 + Math.floor(i/(count/8));
      const rarity = rarities[Math.min(3, Math.floor(tier/2))];
      const id = `${type}_${String(i+1).padStart(3,'0')}`;
      const nm = `${prefix[(i+serial)%prefix.length]} ${names[(i*3+serial)%names.length]} ${i+1}`;
      const item = {id,name:nm,icon:icons[type][i%icons[type].length],type,rarity,weight:.2+tier*.18,stack:type==='weapon'||type==='armor'||type==='tool'?1:99,desc:`${rarity} ${type} item. Tier ${tier}.`};
      if(type==='weapon')Object.assign(item,{damage:12+tier*8+(i%7),range:i%4===0?480+tier*18:56+tier*3,cooldown:Math.max(.22,.58-tier*.03),ranged:i%4===0,durability:90+tier*35,status:['','burn','freeze','poison'][i%4]||null});
      if(type==='tool')Object.assign(item,{damage:8+tier*4,harvest:1+Math.floor(tier/2),durability:100+tier*35});
      if(type==='armor')Object.assign(item,{slot:['helmet','chest','boots','shield'][i%4],armor:.03+tier*.025,durability:110+tier*28});
      if(type==='food')Object.assign(item,{type:'food',food:10+tier*4,water:i%2?8:0});
      if(type==='block')Object.assign(item,{type:'block',block:'generatedBlock',hp:70+tier*20});
      generated[id]=item; serial++;
    }
  }
  addGenerated('weapon',weaponNames,45); addGenerated('armor',armorNames,40); addGenerated('tool',toolNames,30); addGenerated('food',foodNames,30); addGenerated('block',blockNames,35);
  PS.Items = {...baseItems, ...generated};

  PS.Recipes = [
    {id:'wood_sword',out:'wood_sword',count:1,cat:'weapons',station:'hand',req:{wood:5}},
    {id:'stone_pickaxe',out:'stone_pickaxe',count:1,cat:'tools',station:'hand',req:{wood:3,stone:4}},
    {id:'torch',out:'torch',count:4,cat:'buildings',station:'hand',req:{wood:1,coal:1}},
    {id:'workbench',out:'workbench',count:1,cat:'buildings',station:'hand',req:{wood:12,stone:4}},
    {id:'wood_wall',out:'wood_wall',count:8,cat:'buildings',station:'hand',req:{wood:8}},
    {id:'farm_plot',out:'farm_plot',count:2,cat:'food',station:'hand',req:{wood:2,dirt_block:6}},
    {id:'bow',out:'bow',count:1,cat:'weapons',station:'workbench',req:{wood:14,fiber:8}},
    {id:'leather_helmet',out:'leather_helmet',count:1,cat:'armor',station:'workbench',req:{fiber:12,wood:3}},
    {id:'leather_chest',out:'leather_chest',count:1,cat:'armor',station:'workbench',req:{fiber:18,wood:5}},
    {id:'door',out:'door',count:1,cat:'buildings',station:'workbench',req:{wood:6}},
    {id:'trap',out:'trap',count:1,cat:'buildings',station:'workbench',req:{wood:4,stone:6}},
    {id:'furnace',out:'furnace',count:1,cat:'buildings',station:'workbench',req:{stone:22,coal:3}},
    {id:'stone_wall',out:'stone_wall',count:8,cat:'buildings',station:'workbench',req:{stone:12}},
    {id:'iron_sword',out:'iron_sword',count:1,cat:'weapons',station:'furnace',req:{iron:12,coal:3,wood:2}},
    {id:'iron_chest',out:'iron_chest',count:1,cat:'armor',station:'furnace',req:{iron:24,coal:5}},
    {id:'anvil',out:'anvil',count:1,cat:'buildings',station:'furnace',req:{iron:18,stone:12}},
    {id:'crystal_bow',out:'crystal_bow',count:1,cat:'weapons',station:'anvil',req:{bow:1,crystal:8,gold:6}},
    {id:'crystal_shield',out:'crystal_shield',count:1,cat:'armor',station:'anvil',req:{crystal:10,gold:8,iron:8}},
    {id:'obsidian_blade',out:'obsidian_blade',count:1,cat:'weapons',station:'anvil',req:{obsidian:16,crystal:12,gold:10}}
  ];
  Object.values(generated).slice(0,80).forEach((it,idx)=>{
    if(['weapon','tool','armor','food','block'].includes(it.type)){
      const station = idx<15?'hand':idx<35?'workbench':idx<55?'furnace':'anvil';
      const req = it.type==='food'?{berry:2+it.weight*2|0,seed:1}:{wood:2+(idx%6),stone:2+(idx%5)};
      if(idx>25)req.iron=2+(idx%8); if(idx>50)req.crystal=1+(idx%5);
      PS.Recipes.push({id:'recipe_'+it.id,out:it.id,count:1,cat:it.type==='block'?'buildings':it.type==='food'?'food':it.type+'s',station,req});
    }
  });

  class Engine{
    constructor(){
      this.canvas=document.getElementById('gameCanvas'); this.ctx=this.canvas.getContext('2d'); this.ctx.imageSmoothingEnabled=false;
      this.mode='splash'; this.time=0; this.dayTime=6*60; this.frame=0; this.fps=60; this.lowEnd=false; this.pixelScale=1;
      this.camera={x:0,y:0,vx:0,vy:0,zoom:1,shake:0}; this.logs=[]; this.plugins={}; this.systems={}; this.ui={}; this.rendererMode='canvas2d'; this.webglAvailable=(()=>{try{const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'));}catch(e){return false;}})(); this.settings={volume:.5,lowEnd:false,autoCraft:false,showLighting:true};
      this.resize(); window.addEventListener('resize',()=>this.resize());
    }
    resize(){this.dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));this.width=this.canvas.width=Math.floor(innerWidth*this.dpr);this.height=this.canvas.height=Math.floor(innerHeight*this.dpr);this.viewW=innerWidth;this.viewH=innerHeight;this.ctx.imageSmoothingEnabled=false;this.pixelScale=Math.max(1,Math.floor(Math.min(this.viewW/480,this.viewH/270)));}
    register(name,obj){this.systems[name]=obj;return obj;}
    registerUI(name,obj){this.ui[name]=obj;return obj;}
    emit(event,data){(this.plugins[event]||[]).forEach(fn=>{try{fn(data,this);}catch(e){console.warn('plugin error',e);}});}
    on(event,fn){(this.plugins[event]||=[]).push(fn);}
    loadAsset(path){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=path;});}
    toast(msg,color='#ffffff66'){this.logs.unshift({msg,color,t:4});this.logs=this.logs.slice(0,7);const box=document.getElementById('toastLog');if(box)box.innerHTML=this.logs.map(l=>`<div class="toast" style="border-left-color:${l.color}">${l.msg}</div>`).join('');}
    shake(power=.18){this.camera.shake=Math.max(this.camera.shake,power);}
    setMode(mode){this.mode=mode;document.body.dataset.mode=mode;}
    async requestLandscape(){
      try{ if(document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); }catch(e){}
      try{ if(screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); }catch(e){ this.toast('Landscape lock: Bitte in Web2App Orientation=Landscape setzen','#ffd166'); }
    }
    startGame(newGame=true){this.requestLandscape();document.getElementById('mainMenu').classList.add('hidden');document.getElementById('deathScreen').classList.add('hidden');document.getElementById('hud').classList.remove('hidden');document.getElementById('topButtons').classList.remove('hidden');document.getElementById('mobileControls').classList.remove('hidden');this.setMode('game');if(newGame&&this.systems.save)this.systems.save.newGame();this.systems.audio?.startAmbient();this.toast('World loaded. Survive, craft, build.','#49d17d');}
    showMenu(){document.getElementById('hud').classList.add('hidden');document.getElementById('topButtons').classList.add('hidden');document.getElementById('mobileControls').classList.add('hidden');document.getElementById('panel').classList.add('hidden');document.getElementById('mainMenu').classList.remove('hidden');document.getElementById('deathScreen').classList.add('hidden');this.setMode('menu');}
    die(){this.setMode('death');document.getElementById('deathScreen').classList.remove('hidden');this.systems.audio?.play('death');}
  }
  PS.Engine = Engine;
})();
