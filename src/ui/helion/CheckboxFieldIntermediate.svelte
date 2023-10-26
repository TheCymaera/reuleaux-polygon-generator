<script lang="ts">
	// @ts-nocheck Remove when TS assertion is supported in svelte templates. "bind:check" is throwing an error due to "indeterminate" option.

	import { fa5_solid_check, fa5_solid_minus } from "fontawesome-svgs";
	// import UnstyledCheckboxField from "./UnstyledCheckboxField.svelte";

	export let checked: boolean | "indeterminate";
	export let label: string;
	export let readonly = false;
	export let level = 0;
	export let onChange = (event: { checked: boolean }) => { };
	export let hint = "";

	$: active = checked === true || checked === "indeterminate";

	let pressed = false;
	let pressTime = 0;
	const minPressTime = 200;
	function press() {
		pressed = true;
		pressTime = performance.now();
	}

	function unPress() {
		const elapsed = performance.now() - pressTime;
		if (elapsed > minPressTime) return void (pressed = false);
		setTimeout(() => pressed = false, minPressTime - elapsed);
	}
</script>

<svelte:window on:pointerup={unPress} />
<!-- expose tailwind colors as custom properties -->
<div 
	style:padding=".5em"
	style:padding-left={(level) + .5 + "rem"}
>
	<label class="flex items-center gap-2 cursor-pointer"
		style:pointer-events={readonly ? "none" : ""}
		class:Checked={active} 
		class:Pressed={pressed}
		on:pointerdown={press}
	>
		<input type="checkbox" class="absolute opacity-0" disabled={readonly} bind:checked={checked} indeterminate={checked === "indeterminate"} on:change={()=>{
			if (checked === "indeterminate") return;
			onChange({ checked });
		}} />
	
		<helion-checkbox-box 
			class="
				relative grid place-items-center h-5 w-5 rounded text-bg border-divider
				{active && !readonly ? "bg-primary-500 !border-transparent" : ""}
				{active && readonly ? "bg-divider !border-transparent" : ""}
			"
		>
			<helion-checkbox-tick class="grid place-items-center text-xs text-onPrimary" class:Tick_checked={active}>
				{#if checked !== "indeterminate"}
					<span class="grid place-items-center mt-[1px]">{@html fa5_solid_check}</span>
				{:else}
					{@html fa5_solid_minus}
				{/if}
			</helion-checkbox-tick>
	
			<helion-checkbox-splash class:Splash_shown={pressed} class={active ? "bg-primary-500" : "bg-inkWell"} />
		</helion-checkbox-box>
	
		<span>{label}</span>
	</label>
	{#if hint}
	<small style:padding-left={1.8 + "rem"}>
		{hint}
	</small>
	{/if}
</div>

<style>
/* Box */
helion-checkbox-box {
	transition: background-color .2s, border-color .2s;
	will-change: background-color, border-color;
	border-width: .08em;
	z-index: 0;
}

/* Tick */
helion-checkbox-tick {
	opacity: 0;
	transition: opacity .2s;
	will-change: opacity;
}

.Tick_checked {
	opacity: 1;
}

/* Splash */
helion-checkbox-splash {
	position: absolute;
	left: 50%; 
	top: 50%;
	translate: -50% -50%;

	opacity: .1;
	width: 3em; 
	height: 3em;
	border-radius: 50%;

	scale: 0;
	transition: scale .2s;
	will-change: scale;

	z-index: -1;
}

.Splash_shown,
input:focus-visible + * helion-checkbox-splash,
input:active + * helion-checkbox-splash {
	scale: 1;
}
</style>