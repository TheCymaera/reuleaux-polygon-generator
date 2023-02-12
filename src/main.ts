import * as ui from "./ui/ui.js";

console.log(`For debugging, see "window.app".`);
window["app"] = { ui };

// set renderer clipspace
const viewWidth = 500, viewHeight = 500;
ui.renderer.resize(-viewWidth/2, -viewHeight/2, viewWidth, viewHeight);

// auto-draw
if (!ui.manualDraw()) ui.draw();