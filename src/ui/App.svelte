<script lang="ts">
	import { fa5_solid_angleLeft, fa5_solid_save, fa5_solid_info, fa5_solid_times } from 'fontawesome-svgs';
	import "./main.css";
  import AspectRatio from './helion/AspectRatio.svelte';
	import CircleButton from './helion/CircleButton.svelte';
	import Sidebar from './Sidebar.svelte';

	let canvas: HTMLCanvasElement;

	let infoDialogOpened = false;
</script>
<div class="grid grid-rows-[min-content,1fr] overflow-hidden">
	<header class="grid grid-cols-[1fr,auto,1fr] items-center bg-surfaceContainer text-onSurfaceContainer overflow-hidden shadow-md z-10">
		<div>
			<a href="/" title="Home" class="
				text-lg grid place-items-center h-12 w-12 relative
				before:h-[150%] before:w-[150%] before:rounded-full before:bg-[currentColor] before:content-[''] before:absolute
				before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out
				hover:before:opacity-10 active:before:opacity-20
			">
				{@html fa5_solid_angleLeft}
			</a>
		</div>
		<h1 class="font-bold">Reuleaux Polygon Generator</h1>
		<div></div>
	</header>
	<main class="relative grid grid-cols-[400px,auto] max-md:grid-rows-[1fr,1fr] max-md:grid-cols-[1fr] overflow-hidden z-0">
		<side class="bg-surfaceContainer text-onSurfaceContainer max-md:order-[2] p-3 overflow-auto">
			{#if canvas}
				<Sidebar canvas={canvas} />
			{/if}
		</side>

		<div class="py-4 px-4 md:px-24 grid">
			<AspectRatio aspectRatio={1}>
				<canvas bind:this={canvas} class="bg-surfaceContainer text-onSurfaceContainer h-full w-full" />
			</AspectRatio>
		</div>

		<div class="absolute h-full right-0 w-min p-4 gap-4 flex flex-col pointer-events-none [&>*]:pointer-events-auto">
			<CircleButton label="Info" onPress={() => infoDialogOpened = true}>
				{@html fa5_solid_info}
			</CircleButton>
			
			<CircleButton label="Save Image" onPress={() => {
				const a = document.createElement("a");
				a.href = canvas.toDataURL("image/png", undefined);
				a.download = "pixel-text.png";
				a.click();
			}}>
				{@html fa5_solid_save}
			</CircleButton>
		</div>
	</main>

	<div class="absolute inset-0 bg-surface text-onSurface transition-opacity duration-300 ease-in-out {infoDialogOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-20">
		<div class="absolute h-full right-0 w-min p-4 gap-4 flex flex-col">
			<CircleButton label="Close Info" onPress={() => infoDialogOpened = false}>
				{@html fa5_solid_times}
			</CircleButton>
		</div>

		<div class="max-w-3xl m-auto p-4">
			<h1 class="font-bold text-3xl my-3">Reuleaux Polygon Generator</h1>

			<h2 class="font-bold text-2xl my-3">License</h2>
			<p>
				All content generated using the tool can be used for commercial or non-commercial purposes. <wbr>
				Attribution is appreciated but not required.
			</p>
			<h2  class="font-bold text-2xl my-3">Links</h2>
			<p>
				<a class="text-primary-500 underline" href="https://github.com/TheCymaera/reuleaux-polygon-generator" target="_blank">Code on GitHub</a>
			</p>
		</div>
	</div>
</div>