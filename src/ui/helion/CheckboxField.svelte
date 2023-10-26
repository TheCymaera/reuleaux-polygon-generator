<script lang="ts">
	import CheckboxFieldIntermediate from "./CheckboxFieldIntermediate.svelte";

	export let checked: boolean;
	export let label: string;
	export let readonly = false;
	export let level = 0;
	export let hint = "";
	export let onChange = (event: { checked: boolean }) => { };
</script>
<CheckboxFieldIntermediate bind:checked={checked} label={label} readonly={readonly} level={level} hint={hint} onChange={onChange} />