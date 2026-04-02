<script lang="ts">
	import CircuitCanvas from '$lib/components/CircuitCanvas.svelte';
	import PhysicsPanel from '$lib/components/PhysicsPanel.svelte';
	import type { CompType } from '$lib/data/physics.js';

	type Tool = 'select' | 'resistor' | 'capacitor' | 'inductor' | 'voltage' | 'ground';

	let tool = $state<Tool>('select');
	let selectedType = $state<CompType | null>(null);

	const tools: { id: Tool; label: string }[] = [
		{ id: 'select', label: 'Select' },
		{ id: 'resistor', label: 'Resistor' },
		{ id: 'capacitor', label: 'Capacitor' },
		{ id: 'inductor', label: 'Inductor' },
		{ id: 'voltage', label: 'Voltage Src' },
		{ id: 'ground', label: 'Ground' }
	];
</script>

<svelte:head>
	<title>Circuit Visualizer</title>
</svelte:head>

<div class="app">
	<aside>
		<div class="brand">
			<span class="brand-title">Circuit</span>
			<span class="brand-sub">Visualizer</span>
		</div>

		<nav>
			<p class="section-label">Components</p>
			{#each tools as t}
				<button class:active={tool === t.id} onclick={() => (tool = t.id)}>
					{t.label}
				</button>
			{/each}
		</nav>

		<div class="shortcuts">
			<p class="section-label">Shortcuts</p>
			<div class="shortcut"><kbd>R</kbd> Rotate</div>
			<div class="shortcut"><kbd>Del</kbd> Delete</div>
			<div class="shortcut"><kbd>Esc</kbd> Cancel</div>
		</div>

		<p class="tip">
			{#if tool === 'select'}
				Drag to move components. Click a terminal dot to start wiring.
			{:else}
				Click canvas to place. Click terminal dots to connect wires.
			{/if}
		</p>
	</aside>

	<main>
		<CircuitCanvas {tool} onselect={(t) => (selectedType = t)} />
	</main>
	<PhysicsPanel {selectedType} />
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html, body) {
		height: 100%;
		overflow: hidden;
		background: #0a1628;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.app {
		display: flex;
		height: 100vh;
	}

	aside {
		width: 164px;
		flex-shrink: 0;
		background: #0d1e3d;
		border-right: 1px solid #1e3a5f;
		padding: 16px 12px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.brand-title {
		font-size: 15px;
		font-weight: 700;
		color: #60a5fa;
		letter-spacing: 0.3px;
	}

	.brand-sub {
		font-size: 10px;
		color: #334155;
		text-transform: uppercase;
		letter-spacing: 1.5px;
	}

	.section-label {
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: #1e3a5f;
		margin-bottom: 6px;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	button {
		width: 100%;
		padding: 7px 10px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 5px;
		color: #475569;
		font-size: 13px;
		font-family: inherit;
		cursor: pointer;
		text-align: left;
		transition: all 0.1s;
	}

	button:hover {
		background: #1e3a5f;
		color: #94a3b8;
	}

	button.active {
		background: #1e40af;
		border-color: #3b82f6;
		color: #bfdbfe;
	}

	.shortcuts {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.shortcut {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: #334155;
	}

	kbd {
		display: inline-block;
		padding: 1px 6px;
		background: #0f172a;
		border: 1px solid #1e3a5f;
		border-radius: 3px;
		font-family: monospace;
		font-size: 11px;
		color: #475569;
		min-width: 30px;
		text-align: center;
	}

	.tip {
		font-size: 11px;
		color: #1e3a5f;
		line-height: 1.6;
		margin-top: auto;
	}

	main {
		flex: 1;
		min-width: 0;
	}
</style>
