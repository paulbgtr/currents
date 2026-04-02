<script lang="ts">
	type CompType = 'resistor' | 'capacitor' | 'inductor' | 'voltage' | 'ground';

	interface Comp {
		id: string;
		type: CompType;
		x: number;
		y: number;
		rotation: 0 | 90 | 180 | 270;
		label: string;
	}

	interface WireObj {
		id: string;
		from: { cid: string; ti: number };
		to: { cid: string; ti: number };
	}

	let { tool }: { tool: string } = $props();

	const GRID = 20;
	let uid = 0;
	let comps = $state<Comp[]>([]);
	let wires = $state<WireObj[]>([]);
	let selected = $state<string | null>(null);
	let drag = $state<{ id: string; ox: number; oy: number; cx: number; cy: number } | null>(null);
	let wireFrom = $state<{ cid: string; ti: number } | null>(null);
	let mx = $state(400);
	let my = $state(300);
	let svgEl: SVGSVGElement;

	const LABELS: Record<CompType, string> = {
		resistor: 'R',
		capacitor: 'C',
		inductor: 'L',
		voltage: 'V',
		ground: 'GND'
	};

	function snap(v: number) {
		return Math.round(v / GRID) * GRID;
	}

	function xy(e: MouseEvent): [number, number] {
		const r = svgEl.getBoundingClientRect();
		return [e.clientX - r.left, e.clientY - r.top];
	}

	function termOffsets(type: CompType): [number, number][] {
		return type === 'ground' ? [[0, -30]] : [[-40, 0], [40, 0]];
	}

	function termPos(c: Comp, ti: number): [number, number] {
		const [ox, oy] = termOffsets(c.type)[ti];
		const rad = (c.rotation * Math.PI) / 180;
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		return [c.x + ox * cos - oy * sin, c.y + ox * sin + oy * cos];
	}

	function nearTerm(x: number, y: number, skipCid?: string) {
		let best: { cid: string; ti: number; px: number; py: number } | null = null;
		let bestD = 18;
		for (const c of comps) {
			if (c.id === skipCid) continue;
			const offsets = termOffsets(c.type);
			for (let ti = 0; ti < offsets.length; ti++) {
				const [px, py] = termPos(c, ti);
				const d = Math.hypot(px - x, py - y);
				if (d < bestD) {
					bestD = d;
					best = { cid: c.id, ti, px, py };
				}
			}
		}
		return best;
	}

	function routePath(x1: number, y1: number, x2: number, y2: number): string {
		if (Math.abs(y1 - y2) < 1) return `M ${x1},${y1} L ${x2},${y2}`;
		if (Math.abs(x1 - x2) < 1) return `M ${x1},${y1} L ${x2},${y2}`;
		const mid = (x1 + x2) / 2;
		return `M ${x1},${y1} L ${mid},${y1} L ${mid},${y2} L ${x2},${y2}`;
	}

	function wireCoords(w: WireObj) {
		const cf = comps.find((c) => c.id === w.from.cid);
		const ct = comps.find((c) => c.id === w.to.cid);
		if (!cf || !ct) return null;
		const [x1, y1] = termPos(cf, w.from.ti);
		const [x2, y2] = termPos(ct, w.to.ti);
		return { x1, y1, x2, y2 };
	}

	function onCanvasMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		const [x, y] = xy(e);
		if (tool === 'select') {
			wireFrom = null;
			selected = null;
		} else {
			const type = tool as CompType;
			const n = comps.filter((c) => c.type === type).length + 1;
			comps = [
				...comps,
				{ id: `c${++uid}`, type, x: snap(x), y: snap(y), rotation: 0, label: `${LABELS[type]}${n}` }
			];
		}
	}

	function onCompMouseDown(e: MouseEvent, id: string) {
		if (e.button !== 0 || tool !== 'select') return;
		e.stopPropagation();
		selected = id;
		const [x, y] = xy(e);
		const c = comps.find((c) => c.id === id)!;
		drag = { id, ox: x, oy: y, cx: c.x, cy: c.y };
	}

	function onTerminalClick(e: MouseEvent, cid: string, ti: number) {
		e.stopPropagation();
		if (!wireFrom) {
			wireFrom = { cid, ti };
		} else if (wireFrom.cid === cid && wireFrom.ti === ti) {
			wireFrom = null;
		} else {
			const dup = wires.some(
				(w) =>
					(w.from.cid === wireFrom!.cid &&
						w.from.ti === wireFrom!.ti &&
						w.to.cid === cid &&
						w.to.ti === ti) ||
					(w.to.cid === wireFrom!.cid &&
						w.to.ti === wireFrom!.ti &&
						w.from.cid === cid &&
						w.from.ti === ti)
			);
			if (!dup) {
				wires = [...wires, { id: `w${++uid}`, from: wireFrom, to: { cid, ti } }];
			}
			wireFrom = null;
		}
	}

	function onMouseMove(e: MouseEvent) {
		const [x, y] = xy(e);
		mx = x;
		my = y;
		if (drag) {
			const dx = mx - drag.ox;
			const dy = my - drag.oy;
			comps = comps.map((c) =>
				c.id === drag!.id ? { ...c, x: snap(drag!.cx + dx), y: snap(drag!.cy + dy) } : c
			);
		}
	}

	function onMouseUp() {
		drag = null;
	}

	function onMouseLeave() {
		drag = null;
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			wireFrom = null;
			selected = null;
		} else if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
			wires = wires.filter((w) => w.from.cid !== selected && w.to.cid !== selected);
			comps = comps.filter((c) => c.id !== selected);
			selected = null;
		} else if ((e.key === 'r' || e.key === 'R') && selected) {
			comps = comps.map((c) =>
				c.id === selected
					? { ...c, rotation: ((c.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
					: c
			);
		}
	}

	let pendingWireStart = $derived.by(() => {
		if (!wireFrom) return null;
		const c = comps.find((c) => c.id === wireFrom!.cid);
		return c ? termPos(c, wireFrom.ti) : null;
	});

	let pendingWireEnd = $derived.by(() => {
		if (!wireFrom) return null;
		const near = nearTerm(mx, my, wireFrom.cid);
		return near
			? ([near.px, near.py] as [number, number])
			: ([snap(mx), snap(my)] as [number, number]);
	});
</script>

<svelte:window onkeydown={onKeyDown} />

<svg
	bind:this={svgEl}
	class="canvas"
	role="img"
	aria-label="Circuit canvas"
	onmousedown={onCanvasMouseDown}
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onmouseleave={onMouseLeave}
>
	<defs>
		<pattern id="dotgrid" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
			<circle cx={GRID / 2} cy={GRID / 2} r="1" fill="#1e3a5f" />
		</pattern>
	</defs>
	<rect width="100%" height="100%" fill="#0a1628" />
	<rect width="100%" height="100%" fill="url(#dotgrid)" />

	<!-- Committed wires -->
	{#each wires as w (w.id)}
		{@const c = wireCoords(w)}
		{#if c}
			<path
				d={routePath(c.x1, c.y1, c.x2, c.y2)}
				fill="none"
				stroke="#475569"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/if}
	{/each}

	<!-- Pending wire -->
	{#if pendingWireStart && pendingWireEnd}
		<path
			d={routePath(pendingWireStart[0], pendingWireStart[1], pendingWireEnd[0], pendingWireEnd[1])}
			fill="none"
			stroke="#3b82f6"
			stroke-width="2"
			stroke-dasharray="6 3"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}

	<!-- Components -->
	{#each comps as c (c.id)}
		{@const sel = selected === c.id}
		<g
			transform="translate({c.x},{c.y}) rotate({c.rotation})"
			class="comp"
			onmousedown={(e) => onCompMouseDown(e, c.id)}
			role="button"
			tabindex="-1"
		>
			<!-- Hit area -->
			<rect x="-44" y="-36" width="88" height="72" fill="transparent" />

			<!-- Selection highlight -->
			{#if sel}
				<rect
					x="-47"
					y="-39"
					width="94"
					height="78"
					rx="5"
					fill="rgba(59,130,246,0.07)"
					stroke="#3b82f6"
					stroke-width="1.5"
					stroke-dasharray="5 3"
				/>
			{/if}

			<!-- Resistor: zigzag -->
			{#if c.type === 'resistor'}
				<path
					d="M -40,0 L -20,0 L -15,-10 L -5,10 L 5,-10 L 15,10 L 20,0 L 40,0"
					fill="none"
					stroke="#94a3b8"
					stroke-width="2"
					stroke-linejoin="round"
					stroke-linecap="round"
				/>
			<!-- Capacitor: two plates -->
			{:else if c.type === 'capacitor'}
				<path
					d="M -40,0 L -5,0 M -5,-15 L -5,15 M 5,-15 L 5,15 M 5,0 L 40,0"
					fill="none"
					stroke="#94a3b8"
					stroke-width="2"
					stroke-linecap="round"
				/>
			<!-- Inductor: arcs -->
			{:else if c.type === 'inductor'}
				<path
					d="M -40,0 L -30,0 A 7.5,7.5 0 0 0 -15,0 A 7.5,7.5 0 0 0 0,0 A 7.5,7.5 0 0 0 15,0 A 7.5,7.5 0 0 0 30,0 L 40,0"
					fill="none"
					stroke="#94a3b8"
					stroke-width="2"
					stroke-linecap="round"
				/>
			<!-- Voltage source: circle with +/- -->
			{:else if c.type === 'voltage'}
				<path
					d="M -40,0 L -20,0 M 20,0 L 40,0"
					fill="none"
					stroke="#94a3b8"
					stroke-width="2"
					stroke-linecap="round"
				/>
				<circle cx="0" cy="0" r="20" fill="none" stroke="#94a3b8" stroke-width="2" />
				<!-- + on right side -->
				<line x1="7" y1="-5" x2="7" y2="5" stroke="#94a3b8" stroke-width="1.5" />
				<line x1="2" y1="0" x2="12" y2="0" stroke="#94a3b8" stroke-width="1.5" />
				<!-- - on left side -->
				<line x1="-12" y1="0" x2="-2" y2="0" stroke="#94a3b8" stroke-width="1.5" />
			<!-- Ground: decreasing horizontal lines -->
			{:else if c.type === 'ground'}
				<path
					d="M 0,-30 L 0,0 M -15,0 L 15,0 M -10,8 L 10,8 M -5,16 L 5,16"
					fill="none"
					stroke="#94a3b8"
					stroke-width="2"
					stroke-linecap="round"
				/>
			{/if}

			<!-- Label -->
			<text
				y={c.type === 'ground' ? 32 : -22}
				text-anchor="middle"
				font-size="11"
				fill="#334155"
				font-family="system-ui, sans-serif"
				pointer-events="none"
			>
				{c.label}
			</text>
		</g>
	{/each}

	<!-- Terminal dots (rendered last so they appear on top) -->
	{#each comps as c (c.id)}
		{#each termOffsets(c.type) as _, ti}
			{@const [tx, ty] = termPos(c, ti)}
			{@const isActive = wireFrom?.cid === c.id && wireFrom?.ti === ti}
			<circle
				cx={tx}
				cy={ty}
				r="5"
				fill={isActive ? '#3b82f6' : '#0a1628'}
				stroke={isActive ? '#93c5fd' : '#1e3a5f'}
				stroke-width="2"
				class="term"
				onclick={(e) => onTerminalClick(e, c.id, ti)}
				onkeydown={(e) => e.key === 'Enter' && onTerminalClick(e as unknown as MouseEvent, c.id, ti)}
				role="button"
				tabindex="-1"
			/>
		{/each}
	{/each}
</svg>

<style>
	.canvas {
		display: block;
		width: 100%;
		height: 100%;
		user-select: none;
		cursor: crosshair;
	}

	.comp {
		cursor: move;
	}

	.term {
		cursor: pointer;
		transition:
			fill 0.1s,
			stroke 0.1s;
	}

	.term:hover {
		fill: #1d4ed8;
		stroke: #60a5fa;
	}
</style>
