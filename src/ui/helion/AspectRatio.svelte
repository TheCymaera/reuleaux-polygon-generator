<script lang="ts">
	export let aspectRatio: number = 1;

	let boxSize: ResizeObserverSize[] = [];
</script>
<helion-aspect-ratio
	bind:borderBoxSize={boxSize}
	style:--aspect-ratio={aspectRatio}
>
	<div
		style:--_contentWidth={(boxSize[0]?.inlineSize ?? 0) + "px"}
		style:--_contentHeight={(boxSize[0]?.blockSize ?? 0) + "px"}
	>
		<slot />
	</div>
</helion-aspect-ratio>
<style>
helion-aspect-ratio {
	position: relative;

	display: grid;
	place-items: center;
}

div {
	--width: min(100%, calc(var(--_contentHeight) * var(--aspect-ratio)));
	--height: min(100%, calc(var(--_contentWidth) / var(--aspect-ratio)));
	min-width: var(--width);
	max-width: var(--width);
	min-height: var(--height);
	max-height: var(--height);
	box-sizing: border-box;

	display: grid;
}
</style>