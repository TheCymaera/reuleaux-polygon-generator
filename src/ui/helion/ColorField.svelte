<script lang="ts">
	export let value: string;
	export let label: string;
	export let readonly = false;
	export let hint = "";
</script>
<div 
	style:padding=".5em"
	style:padding-left={.5 + "rem"}
>
	<label class="flex items-center gap-2 cursor-pointer pointer-events-none"
		style:pointer-events={readonly ? "none" : ""}
	>
		<input type="color" disabled={readonly} bind:value={value}  class="pointer-events-auto"/>
	
		<span class="pointer-events-auto">{label}</span>
	</label>
	{#if hint}
	<small style:padding-left={1.8 + "rem"}>
		{hint}
	</small>
	{/if}
</div>