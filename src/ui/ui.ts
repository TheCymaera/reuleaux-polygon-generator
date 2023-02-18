import { Renderer } from "../reuleaux/renderer.js";
import * as reuleaux from "../reuleaux/maths.js";
import sidebarHTML from "./sidebar.html?raw";
import infoHTML from "./info.html?raw";
import "./main.css";

import {} from "helion/core.js";
import {} from "helion/LightTheme.js";
import {} from "helion/StandardView.js";
import {} from "helion/Panel.js";
import {} from "helion/OutlinedTextField.js";
import {} from "helion/CircleButton.js";
import {} from "helion/Checkbox.js";
import {} from "helion/ToggleSwitch.js";
import {} from "helion/SidebarView.js";
import {} from "helion/AppBar.js";
import {} from "helion/AspectRatio.js";
import {} from "helion/Stack.js";
import {} from "helion/ColorPickerField.js";
import {} from "helion/FilledButton.js";
import {} from "helion/Intangible.js";

import { fa5_solid_angleLeft, fa5_solid_cog, fa5_solid_download, fa5_solid_info, fa5_solid_share, fa5_solid_times } from "fontawesome-svgs";

document.body.innerHTML = /*html*/`
<helion-standard-view class="helion-fill-parent">
	<helion-app-bar slot="header" center-title="">
		<helion-app-bar-left>
			<a class="helion-app-bar-icon-button" href="/" title="Home">
				${fa5_solid_angleLeft}
			</a>
		</helion-app-bar-left>
		<helion-app-bar-title>Reuleaux Polygon Generator</helion-app-bar-title>
	</helion-app-bar>
	<helion-sidebar-view id=sidebarView slot="body" sidebar-opened>
		<helion-panel id=sidebar slot=sidebar style="overflow: auto;">
			${sidebarHTML}
		</helion-panel>
		<helion-stack slot=main>
			<helion-aspect-ratio style="--aspect-ratio: 1; padding: 1em 4em;">
				<canvas class="helion-panel"></canvas>
			</helion-aspect-ratio>
			<helion-intangible class="actionButtons">
				<button title="Information" class="helion-circle-button js-toggleDialog">
					${fa5_solid_info}
				</button>
				<button title="Toggle Settings" class="helion-circle-button js-toggleSidebar">
					${fa5_solid_cog}
				</button>
				<button title="Share" class="helion-circle-button js-share">
					${fa5_solid_share}
				</button>
				<div style="flex: 1;"></div>
				<button title="Share" class="helion-circle-button js-download">
					${fa5_solid_download}
				</button>
			</helion-intangible>
		</helion-stack>
	</helion-sidebar-view>
</helion-standard-view>

<helion-panel class="infoDialog helion-fill-parent">
	<div style="max-width: 600px; width: 100%; margin: auto;">
		${infoHTML}
	</div>

	<helion-intangible class="helion-fill-parent actionButtons">
		<button class="helion-circle-button js-toggleDialog" title="Close"> 
			${fa5_solid_times}
		</button>
	</helion-intangible>
</helion-panel>`;


export const canvas = document.querySelector("canvas")!;
export const renderer = new Renderer(canvas.getContext("2d")!);

document.querySelector(".js-download")!.addEventListener("click", ()=>{
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/png", undefined);
	a.download = "pixel-text.png";
	a.click();
});

for (const button of document.querySelectorAll(".js-toggleDialog")) {
	(button as HTMLButtonElement).onclick = ()=>{
		document.body.toggleAttribute("data-info-dialog-opened");
	}
}

const shareData: ShareData = {
	title: document.title,
	url: window.location.href
}

document.querySelector(".js-share")!.addEventListener("click", async ()=>{
	navigator.share(shareData).catch(i=>undefined);
});

if (!navigator.share) {
	document.querySelector(".js-share")!.remove();
}

const sidebarView = document.querySelector("#sidebarView") as HTMLElement;

document.querySelector(".js-toggleSidebar")!.addEventListener("click", async ()=>{
	sidebarView.toggleAttribute("sidebar-opened");
});

new ResizeObserver(()=>{
	sidebarView.setAttribute("layout", 
		(sidebarView.clientWidth/sidebarView.clientHeight) < .8 ? "mobile" : "desktop"
	);
}).observe(sidebarView);


export const autoDrawPolygon = document.querySelector("#autoDrawPolygon") as HTMLInputElement;
export const autoDrawCircles = document.querySelector("#autoDrawCircles") as HTMLInputElement;
export const autoDrawArcs    = document.querySelector("#autoDrawArcs") as HTMLInputElement;

export const sides 					= document.querySelector("#sides") as HTMLInputElement;
export const circumradius 	= document.querySelector("#circumradius") as HTMLInputElement;
export const orientation 		= document.querySelector("#orientation") as HTMLInputElement;
export const extension 			= document.querySelector("#extension") as HTMLInputElement;

export const lineWidth 			= document.querySelector("#lineWidth") as HTMLInputElement;
export const polygonColor 	= document.querySelector("#polygonColor") as HTMLInputElement;
export const circleColor 		= document.querySelector("#circleColor") as HTMLInputElement;
export const arcColor 			= document.querySelector("#arcColor") as HTMLInputElement;
export const extensionColor 		= document.querySelector("#extensionColor") as HTMLInputElement;
export const extensionRadiiColor= document.querySelector("#extensionRadiiColor") as HTMLInputElement;
export const lineCap 	= document.querySelector("#lineCap") as HTMLSelectElement;
export const lineJoin = document.querySelector("#lineJoin") as HTMLSelectElement;

export function getPolygon() {
	return {
		x: 0,
		y: 0,
		sides: sides.valueAsNumber || 0,
		circumradius: circumradius.valueAsNumber || 0,
		orientation: orientation.valueAsNumber  * (Math.PI/180) || 0,
		extension: extension.valueAsNumber || 0
	};
}

export function clear() {
	renderer.clear();
}

export function draw(
	drawPolygon = autoDrawPolygon.checked, 
	drawCircles = autoDrawCircles.checked,
	drawArcs = autoDrawArcs.checked
) {
	renderer.ctx.lineWidth = lineWidth.valueAsNumber;
	renderer.ctx.lineCap = lineCap.value as CanvasLineCap;
	renderer.ctx.lineJoin =  lineJoin.value as CanvasLineJoin;
	renderer.ctx.miterLimit = 1;

	const polygon = getPolygon();
	const arcs = reuleaux.getArcs(polygon);
	const extensions = reuleaux.getExtensions(polygon);

	if (drawPolygon) {
		// Draw base shape
		renderer.ctx.strokeStyle = polygonColor.value;
		renderer.drawPolygon(arcs);

		// Draw extensions radii
		//  >> get the sector as a polygon, the straight lines are the radii
		if (polygon.extension !== 0) {	
			renderer.ctx.strokeStyle = extensionRadiiColor.value;
			for (const arc of extensions) {
				const sectorPolygon = reuleaux.getSector(arc);
				renderer.drawPolygon(sectorPolygon,false);
			}
		}
	}

	if (drawCircles) {
		// Draw circles
		renderer.ctx.strokeStyle = circleColor.value;
		for (const arc of arcs) renderer.drawCircle(arc);
	}

	if (drawArcs) {
		if (polygon.extension === 0) {
			(async ()=>{
				// Draw arcs
				renderer.ctx.strokeStyle = arcColor.value;
				renderer.ctx.beginPath();
				for (const arc of arcs) renderer.traceArc(arc);
				renderer.ctx.closePath();
				renderer.ctx.stroke();
			})();
		} else {
			// Draw arcs
			renderer.ctx.strokeStyle = arcColor.value;
			for (const arc of arcs) renderer.drawArc(arc);
			// Draw extensions
			renderer.ctx.strokeStyle = extensionColor.value;
			for (const arc of extensions) renderer.drawArc(arc);
		}
	}
}



const manualDrawInput = document.querySelector("#manualDraw") as HTMLInputElement;
manualDrawInput.addEventListener("change",()=>toggleManualDraw(manualDrawInput.checked));
toggleManualDraw(manualDrawInput.checked);

export function manualDraw(): boolean {
	return manualDrawInput.checked;
}

export function toggleManualDraw(toggle?: boolean): boolean {
	return manualDrawInput.checked = document.documentElement.toggleAttribute("data-manual-draw",toggle);
}


const resolutionInput = document.querySelector("#resolution") as HTMLInputElement;
resolutionInput.addEventListener("input",()=>changeResolution(resolutionInput.valueAsNumber));

export function resolution(): number {
	return resolutionInput.valueAsNumber;
}

export function changeResolution(resolution: number): void {
	resolutionInput.valueAsNumber = canvas.height = canvas.width = resolution;
	renderer.resize();
}

changeResolution(resolutionInput.valueAsNumber);


// manual draw buttons
document.querySelector("#drawPolygon")!.addEventListener("click",()=>draw(true,false,false));
document.querySelector("#drawCircles")!.addEventListener("click",()=>draw(false,true,false));
document.querySelector("#drawArcs")!.addEventListener("click",()=>draw(false,false,true));
document.querySelector("#clear")!.addEventListener("click",()=>clear());


// auto-draw if any value has changed.
document.addEventListener("input",()=>{
	if (!manualDraw()) clear(), draw();
});
if (!manualDraw()) clear(), draw();