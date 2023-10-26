<script lang="ts">
	export let onPress: () => void;
	export let label: string;
</script>
<button 
	on:click={onPress}
	title={label}
	class="
	text-lg bg-primary-500 text-onPrimary rounded-full w-12 h-12 grid place-items-center
	hover:bg-primary-400 active:bg-primary-600
">
	<slot />
</button>