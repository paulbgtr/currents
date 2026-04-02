<script lang="ts">
	import { PHYSICS } from '$lib/data/physics.js';
	import type { CompType } from '$lib/data/physics.js';

	let { selectedType }: { selectedType: CompType | null } = $props();

	let info = $derived(selectedType ? PHYSICS[selectedType] : null);
</script>

<aside class="panel">
	{#if info && selectedType}
		<!-- Header -->
		<div class="header" style="--c: {info.color}">
			<div class="name">{selectedType[0].toUpperCase() + selectedType.slice(1)}</div>
			<div class="tagline">{info.tagline}</div>
		</div>

		<!-- Characteristic curve -->
		<div class="section">
			<div class="label">Characteristic</div>
			<div class="chart-wrap">
				{#if selectedType === 'resistor'}
					<!-- V vs I: linear through origin -->
					<svg viewBox="0 0 110 70" class="chart">
						<line x1="16" y1="58" x2="98" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<line x1="16" y1="8" x2="16" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<text x="100" y="62" font-size="8" fill="#334155">I →</text>
						<text x="4" y="12" font-size="8" fill="#334155">V</text>
						<line x1="16" y1="58" x2="94" y2="10" stroke={info.color} stroke-width="2.5" />
						<text x="40" y="45" font-size="8" fill={info.color} transform="rotate(-33 40 45)"
							>V = IR</text
						>
					</svg>
				{:else if selectedType === 'capacitor'}
					<!-- V vs t: exponential charge toward Vs -->
					<svg viewBox="0 0 110 70" class="chart">
						<line x1="16" y1="58" x2="98" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<line x1="16" y1="8" x2="16" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<line x1="16" y1="12" x2="98" y2="12" stroke="#1e3a5f" stroke-width="0.5" stroke-dasharray="3 2" />
						<text x="100" y="62" font-size="8" fill="#334155">t →</text>
						<text x="4" y="12" font-size="8" fill="#334155">V</text>
						<text x="99" y="14" font-size="7" fill="#1e3a5f">Vs</text>
						<path
							d="M 16,58 C 28,58 36,20 55,15 S 80,12 98,12"
							stroke={info.color}
							stroke-width="2.5"
							fill="none"
						/>
						<text x="22" y="42" font-size="8" fill={info.color}>charges →</text>
					</svg>
				{:else if selectedType === 'inductor'}
					<!-- I vs t: linear ramp (V/L)·t, flattens at steady state -->
					<svg viewBox="0 0 110 70" class="chart">
						<line x1="16" y1="58" x2="98" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<line x1="16" y1="8" x2="16" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<text x="100" y="62" font-size="8" fill="#334155">t →</text>
						<text x="4" y="12" font-size="8" fill="#334155">I</text>
						<line x1="16" y1="58" x2="72" y2="14" stroke={info.color} stroke-width="2.5" />
						<line
							x1="72"
							y1="14"
							x2="98"
							y2="14"
							stroke={info.color}
							stroke-width="2.5"
							stroke-dasharray="4 2"
						/>
						<text x="22" y="48" font-size="8" fill={info.color} transform="rotate(-38 22 48)"
							>I=(V/L)t</text
						>
					</svg>
				{:else if selectedType === 'voltage'}
					<!-- V vs I: flat horizontal line at Vs -->
					<svg viewBox="0 0 110 70" class="chart">
						<line x1="16" y1="58" x2="98" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<line x1="16" y1="8" x2="16" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<text x="100" y="62" font-size="8" fill="#334155">I →</text>
						<text x="4" y="12" font-size="8" fill="#334155">V</text>
						<line x1="16" y1="22" x2="98" y2="22" stroke={info.color} stroke-width="2.5" />
						<text x="99" y="24" font-size="7" fill="#1e3a5f">Vs</text>
						<text x="30" y="18" font-size="8" fill={info.color}>V = const</text>
					</svg>
				{:else if selectedType === 'ground'}
					<!-- V = 0: dot at origin -->
					<svg viewBox="0 0 110 70" class="chart">
						<line x1="16" y1="58" x2="98" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<line x1="16" y1="8" x2="16" y2="58" stroke="#1e3a5f" stroke-width="1" />
						<text x="100" y="62" font-size="8" fill="#334155">I →</text>
						<text x="4" y="12" font-size="8" fill="#334155">V</text>
						<line x1="16" y1="58" x2="98" y2="58" stroke={info.color} stroke-width="3" />
						<circle cx="16" cy="58" r="3" fill={info.color} />
						<text x="28" y="53" font-size="8" fill={info.color}>V = 0</text>
					</svg>
				{/if}
			</div>
		</div>

		<!-- Physical explanation -->
		<div class="section">
			<div class="label">What's happening physically</div>
			<p class="body">{info.physical}</p>
		</div>

		<!-- Analogy -->
		<div class="section">
			<div class="label">Think of it as...</div>
			<div class="analogy-title">{info.analogy}</div>
			<p class="body">{info.analogyWhy}</p>
		</div>

		<!-- Formula -->
		<div class="section formula-section">
			<div class="label">Key relationship</div>
			<div class="formula">{info.formula}</div>
			<p class="body">{info.formulaNote}</p>
		</div>

		<!-- DC / AC behavior -->
		<div class="section">
			<div class="label">Behavior</div>
			<div class="row">
				<span class="badge">DC</span>
				<span class="body">{info.dc}</span>
			</div>
			<div class="row" style="margin-top:6px">
				<span class="badge">AC</span>
				<span class="body">{info.ac}</span>
			</div>
		</div>

		<!-- Energy -->
		<div class="section">
			<div class="label">Energy</div>
			<p class="body">{info.energy}</p>
		</div>

		<!-- Fun fact -->
		<div class="section fact-section">
			<div class="label">Real-world example</div>
			<p class="body">{info.funFact}</p>
		</div>
	{:else}
		<!-- No selection: overview of circuit fundamentals -->
		<div class="overview">
			<div class="overview-title">Physics Panel</div>
			<p class="overview-sub">Select any component on the canvas to explore its physics — what it does, why it works, and how to reason about it.</p>

			<div class="concepts-label">Core Concepts</div>

			<div class="concept">
				<div class="concept-name">Voltage  V  [Volts]</div>
				<p class="concept-body">
					Electric potential difference — the "pressure" that drives current. Like height difference in a water system: water flows downhill, current flows from high to low potential.
				</p>
			</div>

			<div class="concept">
				<div class="concept-name">Current  I  [Amperes]</div>
				<p class="concept-body">
					Flow of electric charge — electrons moving through a conductor. 1 Ampere = 6.24 × 10¹⁸ electrons per second passing a cross-section.
				</p>
			</div>

			<div class="concept">
				<div class="concept-name">Impedance  Z  [Ohms]</div>
				<p class="concept-body">
					Generalized opposition to current. Resistance (R) is constant. Capacitive reactance (1/ωC) decreases with frequency. Inductive reactance (ωL) increases with frequency.
				</p>
			</div>

			<div class="concept">
				<div class="concept-name">Power  P  [Watts]</div>
				<p class="concept-body">
					Rate of energy flow: P = V × I. Resistors dissipate it as heat. Capacitors and inductors store and return it. Sources supply it.
				</p>
			</div>

			<div class="concept">
				<div class="concept-name">Kirchhoff's Laws</div>
				<p class="concept-body">
					KVL: Voltages around any closed loop sum to zero.<br />
					KCL: Currents into any node sum to zero.<br />
					These two laws, plus component equations, solve any linear circuit.
				</p>
			</div>
		</div>
	{/if}
</aside>

<style>
	.panel {
		width: 260px;
		flex-shrink: 0;
		background: #0d1e3d;
		border-left: 1px solid #1e3a5f;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: #1e3a5f transparent;
	}

	.header {
		padding: 14px 16px 12px;
		border-bottom: 2px solid var(--c, #3b82f6);
		background: color-mix(in srgb, var(--c, #3b82f6) 7%, #0d1e3d);
	}

	.name {
		font-size: 17px;
		font-weight: 700;
		color: var(--c, #3b82f6);
		margin-bottom: 4px;
	}

	.tagline {
		font-size: 11px;
		color: #475569;
		line-height: 1.4;
	}

	.section {
		padding: 11px 16px;
		border-bottom: 1px solid #0f2040;
	}

	.label {
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: #1e3a5f;
		margin-bottom: 7px;
	}

	.body {
		font-size: 11.5px;
		color: #475569;
		line-height: 1.65;
		margin: 0;
	}

	.chart-wrap {
		background: #060f1e;
		border-radius: 5px;
		padding: 6px 4px 2px;
	}

	.chart {
		display: block;
		width: 100%;
	}

	.analogy-title {
		font-size: 13px;
		font-weight: 600;
		color: #64748b;
		margin-bottom: 6px;
	}

	.formula-section {
		background: color-mix(in srgb, #3b82f6 4%, #0d1e3d);
	}

	.formula {
		font-family: 'Courier New', monospace;
		font-size: 14px;
		color: #e2e8f0;
		margin-bottom: 7px;
		letter-spacing: 0.3px;
	}

	.row {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	.badge {
		flex-shrink: 0;
		font-size: 9px;
		font-weight: 700;
		color: #334155;
		background: #0a1628;
		border: 1px solid #1e3a5f;
		padding: 1px 5px;
		border-radius: 3px;
		margin-top: 2px;
		letter-spacing: 0.5px;
	}

	.fact-section {
		background: color-mix(in srgb, #f59e0b 3%, #0d1e3d);
	}

	/* Overview (no selection) */
	.overview {
		padding: 20px 16px;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.overview-title {
		font-size: 14px;
		font-weight: 700;
		color: #1e3a5f;
		margin-bottom: 8px;
	}

	.overview-sub {
		font-size: 11px;
		color: #1e3a5f;
		line-height: 1.6;
		margin-bottom: 20px;
	}

	.concepts-label {
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: #1e3a5f;
		margin-bottom: 10px;
	}

	.concept {
		padding: 10px 12px;
		background: #060f1e;
		border-radius: 5px;
		border-left: 2px solid #1e3a5f;
		margin-bottom: 8px;
	}

	.concept-name {
		font-size: 11px;
		font-weight: 600;
		color: #334155;
		margin-bottom: 4px;
		font-family: monospace;
	}

	.concept-body {
		font-size: 11px;
		color: #1e3a5f;
		line-height: 1.55;
		margin: 0;
	}
</style>
