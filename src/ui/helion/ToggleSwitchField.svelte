<script lang="ts">
	export let checked: boolean;
	export let label: string;
	export let readonly = false;

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

<label class="flex items-center gap-2 cursor-pointer mx-2" 
	style:pointer-events={readonly ? "none" : ""}
	class:Checked={checked} 
	class:Pressed={pressed}
	on:pointerdown={press}
>
	<input type="checkbox" class="absolute opacity-0" bind:checked={checked} disabled={readonly} />

	<helion-toggle-switch-track
		class="
			{checked ? "bg-primary-500" : "bg-onSurfaceContainer"}
		"
		class:Disabled={readonly}
	>
		<helion-toggle-switch-thumb 
			class:Thumb_checked={checked}
			class:Thumb_disabled={readonly}
			class="Movable bg-surfaceContainer"
			class:Movable_checked={checked} 
		/>

		<helion-toggle-switch-splash 
			class="Movable
				{checked ? "bg-primary-500" : "bg-inkWell"}
			"
			class:Splash_visible={pressed}
			class:Movable_checked={checked}
		/>
	</helion-toggle-switch-track>

	<span>{label}</span>
</label>


<style>
:root {
	--helion-ToggleSwitch-trackHeight: 1.5em;
	--helion-ToggleSwitch-trackWidth: 2.5em;
	
	--helion-ToggleSwitch-thumbSize: calc(var(--helion-ToggleSwitch-trackHeight) * .8);

	--helion-ToggleSwitch-splashSize: 3em;
	--helion-ToggleSwitch-splashOpacity: .15;

	--helion-ToggleSwitch-transition: .2s ease;
}

helion-toggle-switch-track {
	position: relative;
	height: var(--helion-ToggleSwitch-trackHeight);
	width: var(--helion-ToggleSwitch-trackWidth);
	box-sizing: border-box;

	border-radius: var(--helion-ToggleSwitch-trackHeight);

	transition: background-color var(--helion-ToggleSwitch-transition), opacity var(--helion-ToggleSwitch-transition);

	will-change: background-color, opacity;
}

.Movable {
	position: absolute;
	top: 50%;
	left: 0;
	translate: 
		calc(var(--helion-ToggleSwitch-trackHeight) / 2 - 50%) 
		-50%;
}

.Movable_checked {
	translate: 
		calc(var(--helion-ToggleSwitch-trackWidth) - var(--helion-ToggleSwitch-trackHeight) / 2  - 50%) 
		-50%;
}

helion-toggle-switch-thumb {
	width:	var(--helion-ToggleSwitch-thumbSize);
	height:	var(--helion-ToggleSwitch-thumbSize);
	transition: translate var(--helion-ToggleSwitch-transition);

	display: block;
	border-radius: 50%;

	will-change: translate;
}

helion-toggle-switch-splash {
	width:	var(--helion-ToggleSwitch-splashSize);
	height:	var(--helion-ToggleSwitch-splashSize);
	opacity: 0;

	display: block;
	border-radius: 50%;

	scale: 0;

	--helion-ToggleSwitch-splashTransition: .5s ease-out;

	transition: 
		translate var(--helion-ToggleSwitch-transition), 
		scale var(--helion-ToggleSwitch-splashTransition),
		background-color var(--helion-ToggleSwitch-splashTransition), 
		opacity var(--helion-ToggleSwitch-splashTransition);

	will-change: translate, scale, background-color, opacity;
}

.Splash_visible {
	--helion-ToggleSwitch-splashTransition: .2s ease-in-out;

	scale: 1;
	opacity: var(--helion-ToggleSwitch-splashOpacity);
}
</style>