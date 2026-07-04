# 🎮 Pixel Survival — Modular Landscape Edition

Ein vollständiges, modulares 2D Pixel Survival Browser-Game für **Mobile + PC**, optimiert für **Querformat/Landscape**, GitHub Pages und Web2App/Web2APK.

![Cover](assets/cover.png)

## ✅ Wichtig: Landscape / Querformat

Diese Version startet bzw. fordert Landscape auf drei Ebenen an:

1. `manifest.webmanifest` enthält:

```json
"orientation": "landscape"
```

2. Beim Start Game wird versucht:

```js
screen.orientation.lock('landscape')
```

3. Wenn das Gerät im Hochformat ist, zeigt CSS einen Rotate-Hinweis.

Für Web2App/Web2APK musst du zusätzlich im Builder setzen:

```text
Orientation: Landscape
Fullscreen: Ja
JavaScript: Aktiviert
LocalStorage / DOM Storage: Aktiviert
```

## Projektstruktur

```text
/index.html
/style.css
/core/engine.js
/core/render.js
/core/input.js
/core/gameLoop.js

/systems/player.js
/systems/world.js
/systems/inventory.js
/systems/combat.js
/systems/crafting.js
/systems/ai.js
/systems/building.js
/systems/farming.js
/systems/weather.js
/systems/save.js
/systems/audio.js

/ui/hud.js
/ui/menu.js
/ui/inventoryUI.js
/ui/craftingUI.js
/ui/mobileControls.js

/assets/
  cover.png
  favicon.svg
  icon-192.png
  icon-512.png
  sprites_placeholder.png
  tileset_placeholder.png
```

## Enthaltene Systeme

- Animated Splash Screen mit `MADE BY WCPO`
- Main Menu mit Start, Continue, Settings, Controls Tutorial, Credits
- Chunk-basierte Infinite World
- Seed-basierte Procedural Generation
- Biome: Grasslands, Forest, Desert, Snow, Swamp, Volcano, Ocean, Underground Caves
- Multi-Layer: Surface, Underground, Deep Caves
- Terrain Editing und Physics-lite Falling Blocks
- Pixel Renderer mit Camera Smoothing, Parallax, Lighting, Vignette, Screen Shake
- Player Stats: Health, Hunger, Thirst, Stamina, Temperature, Oxygen
- XP, Leveling und Skills: mining, combat, crafting, survival
- Status Effects: poison, burn, freeze, regen
- Inventory Grid, Hotbar 1–9, Drag & Drop, Equipment, Weight System
- Crafting Tree mit Workbench, Furnace, Anvil, Discovery und Auto-Crafting Hook
- Combat: Melee, Ranged, Crits, Dodge/Roll, Combo, Knockback, Durability, Boss Hook
- Enemy AI: idle, patrol, chase, attack, flee
- Gegner: slime, zombie, skeleton archer, wolf, goblin, cave bat, boss
- Building: Grid placement, rotate, destroy, walls, traps, doors, farms, structures
- Farming: seeds, growth stages, water, seasonal effects, harvest
- Weather: rain, storm, snow, heatwave, wind
- Save System: LocalStorage, Autosave alle 10 Sekunden, mehrere Slots vorbereitet
- Mobile Controls: linker Joystick, rechter Aim-Joystick, Buttons für Attack/Interact/Dodge/Inventory/Craft/Build
- Mini-Map mit Biome Colors, Player Marker, Cave Layer Toggle
- Audio System: lightweight WebAudio SFX
- Item System mit 180+ Items, Rarities, Durability und Descriptions
- Progression: XP, Skill Growth, Unlock Tiers, Boss Progression Hook
- Death System mit Respawn und Item Drop
- Performance: Chunk Loading/Unloading, Entity Culling, adaptive Low-End Mode
- AI-ready Plugin Hooks

## Lokal starten

```bash
python3 -m http.server 8080
```

Dann öffnen:

```text
http://localhost:8080
```

Oder `index.html` direkt öffnen. Für Service Worker / Offline Cache ist ein lokaler Server besser.

## GitHub Pages

1. Alle Dateien in ein GitHub Repository hochladen.
2. `index.html` muss im Root liegen.
3. Settings → Pages → Deploy from branch → `main` → `/root`.
4. URL testen:

```text
https://DEIN-NAME.github.io/DEIN-REPO/index.html?v=landscape-modular-1
```

## Web2App / APK

Start URL:

```text
https://DEIN-NAME.github.io/DEIN-REPO/index.html?v=landscape-modular-1
```

Einstellungen:

```text
Orientation: Landscape
Fullscreen: Yes
JavaScript: Enabled
LocalStorage / DOM Storage: Enabled
Cache: optional, bei Problemen deaktivieren
Icon: assets/icon-512.png
```

Wenn die App alte Inhalte zeigt, alte APK deinstallieren und Cache im Web2App Builder löschen.

## Controls

### PC

- `A/D` oder Pfeile: bewegen
- `W` / Pfeil hoch / Space: springen
- Maus / `F` / Space: Angriff
- `E`: abbauen/interagieren
- `Q`: Hotbar Item nutzen
- `I`: Inventory
- `C`: Crafting
- `M`: Map / Layer Toggle
- `B`: Destroy Mode
- `R`: Rotate
- `F5`: Save

### Mobile

- Linker Joystick: Bewegung
- Rechter Joystick: Zielen
- `ATT`: Angriff
- `DOD`: Dodge
- `ACT`: Interaktion/Mine
- `INV`: Inventory
- `CRF`: Crafting
- `BLD`: Build/Destroy Mode
