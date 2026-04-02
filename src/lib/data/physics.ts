export type CompType = 'resistor' | 'capacitor' | 'inductor' | 'voltage' | 'ground';

export interface PhysicsEntry {
	color: string;
	tagline: string;
	physical: string;
	analogy: string;
	analogyWhy: string;
	formula: string;
	formulaNote: string;
	dc: string;
	ac: string;
	energy: string;
	funFact: string;
}

export const DEFAULT_DISPLAY: Record<CompType, string> = {
	resistor: '1 kΩ',
	capacitor: '100 nF',
	inductor: '10 mH',
	voltage: '5 V',
	ground: ''
};

export const PHYSICS: Record<CompType, PhysicsEntry> = {
	resistor: {
		color: '#f59e0b',
		tagline: 'Opposes current flow, converting electrical energy to heat',
		physical:
			'When electrons move through a material, they collide with atoms and lose kinetic energy as heat. More collisions per unit length = higher resistance. The ratio of voltage to current stays constant at a fixed temperature — this is Ohmic behavior.',
		analogy: 'A narrow section of pipe',
		analogyWhy:
			'A narrow pipe creates a pressure drop (voltage) proportional to the flow rate (current). Double the narrowing, halve the flow for the same pressure. The pipe dissipates energy as heat — it stores nothing.',
		formula: 'V = I × R',
		formulaNote:
			"Ohm's Law. Voltage drop across a resistor equals current through it times resistance. Double R → half the current for the same voltage. The slope of the V–I curve IS the resistance.",
		dc: 'Limits current proportionally. Acts as a linear current controller — predictable and frequency-independent.',
		ac: 'Behaves identically to DC. Resistance does not change with frequency (ideal resistors).',
		energy: 'None stored. All energy is dissipated as heat: P = I²R watts, every second.',
		funFact:
			"An incandescent bulb's tungsten filament is a resistor that reaches 2500°C — hot enough to glow white. 95% of its energy becomes heat, only 5% becomes light."
	},

	capacitor: {
		color: '#06b6d4',
		tagline: 'Stores energy in an electric field — blocks DC, passes AC',
		physical:
			'Two conductive plates face each other with an insulating gap. As charge accumulates on the plates, an electric field builds between them. That field stores energy and creates a voltage. Current flows in while charging, then stops when the plate voltage equals the source voltage.',
		analogy: 'An elastic membrane across a pipe',
		analogyWhy:
			"Water (current) flows in and stretches the membrane, building pressure (voltage). Once fully stretched, flow stops. But if pressure oscillates (AC), the membrane flexes back and forth — transmitting the wave even though no water crosses the gap.",
		formula: 'Q = C·V    →    I = C · dV/dt',
		formulaNote:
			'Current only flows when voltage is changing. At steady DC, dV/dt = 0 so I = 0. At high AC frequency, V changes rapidly so large current flows.',
		dc: 'Charges up to the source voltage then blocks all further current. Open circuit in steady state.',
		ac: 'Passes AC with impedance Xc = 1/(2πfC). Higher frequency → lower impedance → more current passes.',
		energy: 'Stores energy in electric field: E = ½CV² joules. Can release it very quickly.',
		funFact:
			'Camera flash capacitors charge over 3–4 seconds then dump all energy in under 1 ms — delivering instantaneous power 1000× higher than the battery could provide directly.'
	},

	inductor: {
		color: '#a78bfa',
		tagline: 'Stores energy in a magnetic field — passes DC, opposes AC',
		physical:
			"Current through a coil creates a magnetic field that stores energy. When current tries to change, the collapsing or expanding field induces a voltage that opposes the change (Lenz's Law). This is electromagnetic inertia — the inductor 'wants' to keep the current constant.",
		analogy: 'A heavy flywheel in a pipe',
		analogyWhy:
			"A flywheel resists speed changes because of rotational inertia. An inductor resists current changes. Once spinning (DC flowing), the flywheel keeps going even after you stop pushing — once current flows, the inductor keeps driving it even after voltage is removed.",
		formula: 'V = L · dI/dt',
		formulaNote:
			'Voltage only appears across an inductor when current is changing. Steady DC → zero voltage (short circuit). Rapidly changing current → large opposing voltage.',
		dc: 'In DC steady state, acts like a plain wire — zero voltage drop, zero impedance.',
		ac: 'Opposes AC with impedance XL = 2πfL. Higher frequency → higher impedance → harder to pass.',
		energy: "Stores energy in magnetic field: E = ½LI² joules. Current can't change instantaneously.",
		funFact:
			"Phone charger bricks use inductors in switching circuits to convert voltages efficiently without heavy iron transformers. The high-pitched whine is the inductor vibrating at its ~100 kHz switching frequency."
	},

	voltage: {
		color: '#34d399',
		tagline: 'Maintains a fixed potential difference — the circuit energy driver',
		physical:
			"An ideal voltage source maintains exactly V volts between its terminals regardless of current drawn. Real sources (batteries, regulators) have internal resistance that limits maximum current. The source converts stored energy (chemical, mechanical, solar) into electrical energy.",
		analogy: 'A water pump',
		analogyWhy:
			"A centrifugal pump maintains constant pressure difference between inlet and outlet, circulating water no matter what the pipe resistance is. A voltage source maintains constant electrical pressure (voltage), driving current through whatever circuit is connected.",
		formula: 'V = constant    P = V × I',
		formulaNote:
			"The source delivers whatever current the external circuit demands while holding V fixed. Power supplied equals voltage times current. The '+' terminal is at higher potential — conventional current exits from '+'.",
		dc: "Provides constant drive voltage. Circuit current = V ÷ R_total. The source supplies all the power consumed.",
		ac: 'AC source: V(t) = Vpeak × sin(2πft). Frequency and amplitude are fixed; phase is relative to the reference.',
		energy: 'Supplies energy — converts stored energy (chemical, mechanical) into electrical energy: P = V·I watts.',
		funFact:
			"A USB-C charger's 5V output is maintained by a feedback loop that adjusts thousands of times per second, compensating for cable resistance and load changes to always deliver exactly 5.00 V."
	},

	ground: {
		color: '#64748b',
		tagline: 'Zero-volt reference point — all voltages measured relative to this',
		physical:
			"Ground is a defined reference, not a physical law. By convention V_ground = 0 V. This lets us assign meaningful numbers to voltages — '3.3V' means 3.3V above ground. Without a reference, voltages have no absolute meaning, only differences matter.",
		analogy: 'Sea level for altitude measurement',
		analogyWhy:
			"Mountains are 'X meters above sea level' — sea level is 0m by definition, even though it's just an agreed reference. Similarly, ground is 0V by agreement. A '9V battery' has 9V between its terminals — whichever terminal you call ground, the other is ±9V.",
		formula: 'V_gnd = 0 V  (by definition)',
		formulaNote:
			'Ground defines the reference node in circuit analysis (KVL, KCL). In nodal analysis, the ground node is the only node whose voltage is known by definition — all others are solved relative to it.',
		dc: 'Provides the current return path. In a complete circuit, current flows from source (+) through components and returns via ground.',
		ac: 'Acts as signal reference. Poor grounding causes noise, hum, and signal corruption. RF circuits require solid ground planes.',
		energy: 'No energy storage or dissipation. Purely a reference node and return conductor.',
		funFact:
			'"Chassis ground", "digital ground", and "analog ground" are often separate on PCBs to prevent digital noise from corrupting analog signals, then joined at a single star-ground point.'
	}
};
