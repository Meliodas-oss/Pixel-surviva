# Web2App Landscape Guide

## Wichtig

Damit die APK direkt im Querformat startet, musst du es **im Web2App Builder** einstellen. Eine Website kann Landscape nur anfragen, aber Android/WebView entscheidet am Ende.

## Empfohlene Einstellungen

| Setting | Wert |
|---|---|
| App Orientation | Landscape |
| Fullscreen | Ja |
| JavaScript | Aktiviert |
| DOM Storage / LocalStorage | Aktiviert |
| Zoom Controls | Aus |
| Pull to Refresh | Aus |
| Cache | Bei Problemen aus |
| Start URL | `https://DEIN-NAME.github.io/DEIN-REPO/index.html?v=landscape-modular-1` |
| Icon | `assets/icon-512.png` |

## GitHub Pages URL

Nutze niemals die normale GitHub Repository URL:

```text
https://github.com/DEIN-NAME/DEIN-REPO
```

Nutze die GitHub Pages URL:

```text
https://DEIN-NAME.github.io/DEIN-REPO/index.html?v=landscape-modular-1
```

## Wenn die App weiterhin im Hochformat startet

1. Prüfe Web2App Setting `Orientation = Landscape`.
2. Alte APK komplett deinstallieren.
3. Neue APK bauen.
4. Neue APK installieren.
5. Falls möglich WebView Cache im Builder deaktivieren.

## Wenn alte Version kommt

Ändere die URL-Version:

```text
index.html?v=landscape-modular-2
```

Dann APK neu bauen, weil die Start-URL in der APK gespeichert ist.
