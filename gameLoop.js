(function(){
'use strict'; const PS=window.PS;
function boot(){
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  const app = new PS.Engine(); PS.app = app;
  app.register('inventory', new PS.InventorySystem(app));
  app.register('world', new PS.WorldSystem(app));
  app.register('player', new PS.PlayerSystem(app));
  app.register('combat', new PS.CombatSystem(app));
  app.register('crafting', new PS.CraftingSystem(app));
  app.register('ai', new PS.AISystem(app));
  app.register('building', new PS.BuildingSystem(app));
  app.register('farming', new PS.FarmingSystem(app));
  app.register('weather', new PS.WeatherSystem(app));
  app.register('save', new PS.SaveSystem(app));
  app.register('audio', new PS.AudioSystem(app));
  app.register('input', new PS.InputSystem(app));
  app.register('render', new PS.RenderSystem(app));
  app.registerUI('hud', new PS.HUD(app));
  app.registerUI('menu', new PS.MenuUI(app));
  app.registerUI('inventoryUI', new PS.InventoryUI(app));
  app.registerUI('craftingUI', new PS.CraftingUI(app));
  app.registerUI('mobileControls', new PS.MobileControls(app));

  // AI-ready plugin hooks.
  app.on('tick', ({dt}) => { if(app.systems.player.level>=8 && app.frame%900===0) app.systems.ai.spawnBoss(); });

  let last = performance.now(), fpsAcc=0, fpsFrames=0;
  function frame(now){
    const dt = Math.min(PS.Config.maxDt, (now-last)/1000 || 0.016); last=now; app.time += dt; app.frame++;
    fpsAcc += dt; fpsFrames++; if(fpsAcc>.5){app.fps=Math.round(fpsFrames/fpsAcc);fpsAcc=0;fpsFrames=0;if(app.fps<38)app.lowEnd=true;}
    if(app.mode==='game'){
      app.systems.input.update(dt);
      app.systems.weather.update(dt);
      app.systems.player.update(dt);
      app.systems.world.update(dt);
      app.systems.combat.update(dt);
      app.systems.ai.update(dt);
      app.systems.building.update(dt);
      app.systems.farming.update(dt);
      app.systems.crafting.update(dt);
      app.systems.audio.update(dt);
      app.systems.save.update(dt);
      app.ui.hud.update(dt);
      app.emit('tick',{dt});
    } else if(app.mode==='death') {
      app.ui.hud.update(dt);
    }
    app.systems.render.draw();
    app.ui.hud.draw(app.ctx);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
