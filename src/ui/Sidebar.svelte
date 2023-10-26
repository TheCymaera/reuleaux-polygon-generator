<script lang="ts">
	import CheckboxField from "./helion/CheckboxField.svelte";
	import FilledButton from "./helion/FilledButton.svelte";
	import ToggleSwitchField from "./helion/ToggleSwitchField.svelte";
	import OutlinedNumberField from "./helion/OutlinedNumberField.svelte";
	import ColorField from "./helion/ColorField.svelte";
	import OutlinedSelectField from "./helion/OutlinedSelectField.svelte";
  import * as reuleaux from "../reuleaux/maths.js";
  import { Renderer } from "../reuleaux/renderer.js";

	export let canvas: HTMLCanvasElement;
	const renderer = new Renderer(canvas.getContext("2d")!);
	renderer.viewHeight = 500;
	renderer.viewWidth = 500;
	renderer.viewX = -renderer.viewWidth / 2;
	renderer.viewY = -renderer.viewHeight / 2;

	let polygon: reuleaux.ReuleauxPolygon = {
		x: 0,
		y: 0,
		sides: 3,
		circumradius: 100,
		orientation: 0,
		extension: 0,
	};

	let manualDraw = false;
	let autoDraw = {
		polygon: true,
		circles: true,
		arcs: true,
	}

	let display = {
		resolution: 1000,
		lineWidth: 10,
		lineCap: "butt" as CanvasLineCap,
		lineJoin: "round" as CanvasLineJoin,
		colors: {
			polygon: "#000000",
			circle: "#f00000",
			arc: "#0000f0",
			extension: "#800080",
			extensionRadii: "#008000",
		}
	}

	$: {
		canvas.width = display.resolution;
		canvas.height = display.resolution;
	}


	$: if (!manualDraw) {
		renderer.clear();
		draw(polygon, autoDraw.polygon, autoDraw.circles, autoDraw.arcs, display);
	}

	function draw(polygon: reuleaux.ReuleauxPolygon, drawPolygon: boolean, drawCircles: boolean, drawArcs: boolean, displaySettings: typeof display) {
		polygon = { ...polygon };
		polygon.orientation = polygon.orientation * Math.PI / 180;

		renderer.ctx.lineWidth = displaySettings.lineWidth;
		renderer.ctx.lineCap = displaySettings.lineCap;
		renderer.ctx.lineJoin =  displaySettings.lineJoin;
		renderer.ctx.miterLimit = 1;

		const arcs = reuleaux.getArcs(polygon);
		const extensions = reuleaux.getExtensions(polygon);

		if (drawPolygon) {
			// Draw base shape
			renderer.ctx.strokeStyle = displaySettings.colors.polygon;
			renderer.drawPolygon(arcs);

			// Draw extensions radii
			//  >> get the sector as a polygon, the straight lines are the radii
			if (polygon.extension !== 0) {	
				renderer.ctx.strokeStyle = displaySettings.colors.extensionRadii;
				for (const arc of extensions) {
					const sectorPolygon = reuleaux.getSector(arc);
					renderer.drawPolygon(sectorPolygon,false);
				}
			}
		}

		if (drawCircles) {
			// Draw circles
			renderer.ctx.strokeStyle = displaySettings.colors.circle;
			for (const arc of arcs) renderer.drawCircle(arc);
		}

		if (drawArcs) {
			if (polygon.extension === 0) {
				(async ()=>{
					// Draw arcs
					renderer.ctx.strokeStyle = displaySettings.colors.arc;
					renderer.ctx.beginPath();
					for (const arc of arcs) renderer.traceArc(arc);
					renderer.ctx.closePath();
					renderer.ctx.stroke();
				})();
			} else {
				// Draw arcs
				renderer.ctx.strokeStyle = displaySettings.colors.arc;
				for (const arc of arcs) renderer.drawArc(arc);
				// Draw extensions
				renderer.ctx.strokeStyle = displaySettings.colors.extension;
				for (const arc of extensions) renderer.drawArc(arc);
			}
		}
	}
</script>

<br />

<h2 class="font-bold text-xl my-4">Draw</h2>

<ToggleSwitchField label="Manual" bind:checked={manualDraw} />

<br>

<div hidden={manualDraw}>
	<CheckboxField label="Polygon" bind:checked={autoDraw.polygon} />
	<CheckboxField label="Circles" bind:checked={autoDraw.circles} />
	<CheckboxField label="Arcs" bind:checked={autoDraw.arcs} />
</div>

<div hidden={!manualDraw} class="pl-2">
	<FilledButton class="mb-1" onPress={()=>draw(polygon, true, false, false, display)}>Polygon</FilledButton>
	<FilledButton class="mb-1" onPress={()=>draw(polygon, false, true, false, display)}>Circles</FilledButton>
	<FilledButton class="mb-1" onPress={()=>draw(polygon, false, false, true, display)}>Arcs</FilledButton>
	<FilledButton class="mb-1" onPress={()=>renderer.clear()}>Clear</FilledButton>
</div>

<br />

<h2 class="font-bold text-xl my-4">Geometry</h2>

<OutlinedNumberField label="Sides" type="number" bind:value={polygon.sides} hint="(Enter an odd number for a shape of constant width)" />

<OutlinedNumberField label="Circumradius" type="number" bind:value={polygon.circumradius} /> <br>

<OutlinedNumberField label="Orientation" type="number" bind:value={polygon.orientation} /> <br>

<OutlinedNumberField label="Extension" type="number" bind:value={polygon.extension} />

<br />

<h2 class="font-bold text-xl my-4">Display</h2>


<OutlinedNumberField label="Resolution" type="number" bind:value={display.resolution} /> <br>

<OutlinedNumberField label="Line Width" type="number" bind:value={display.lineWidth} /> <br>

<ColorField label="Polygon Color" bind:value={display.colors.polygon} />
<ColorField label="Circle Color" bind:value={display.colors.circle} />
<ColorField label="Arc Color" bind:value={display.colors.arc} />
<ColorField label="Extension Color" bind:value={display.colors.extension} />
<ColorField label="Extension Radii Color" bind:value={display.colors.extensionRadii} />

<OutlinedSelectField label="Line cap" bind:value={display.lineCap} options={[
	{ value: "butt", label: "Butt" },
	{ value: "round", label: "Round" },
	{ value: "square", label: "Square" },
]} /> <br>

<OutlinedSelectField label="Line join" bind:value={display.lineJoin} options={[
	{ value: "round", label: "Round" },
	{ value: "bevel", label: "Bevel" },
	{ value: "miter", label: "Miter" },
]} />


<div style="height: 50vh"></div>