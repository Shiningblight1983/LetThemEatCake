import React, { useState, useRef, useEffect } from 'react';
import { Zap, Power, Battery, Cpu, RotateCcw, MapPin, Settings, Eye, EyeOff } from 'lucide-react';

// Circuit symbols mapping to code concepts
const CIRCUIT_SYMBOLS = {
  // Data flow
  wire: { symbol: '━━━', meaning: 'Data Flow', voltage: 'variable assignment', color: '#10b981' },
  ground: { symbol: '⏚', meaning: 'Ground State', voltage: 'return/null', color: '#6b7280' },
  
  // Logic gates
  switch: { symbol: '╱╲', meaning: 'If/Else', voltage: 'conditional logic', color: '#f59e0b' },
  relay: { symbol: '◊━◊', meaning: 'Function Call', voltage: 'transform data', color: '#3b82f6' },
  
  // Storage
  capacitor: { symbol: '||', meaning: 'Variable', voltage: 'store state', color: '#8b5cf6' },
  battery: { symbol: '⚡', meaning: 'Constant', voltage: 'fixed value', color: '#ef4444' },
  
  // Processing
  transformer: { symbol: '◐◑', meaning: 'Function', voltage: 'process/transform', color: '#06b6d4' },
  resistor: { symbol: '~~~~~', meaning: 'Validation', voltage: 'limit/filter', color: '#f97316' },
  
  // Flow control
  oscillator: { symbol: '◯◯◯', meaning: 'Loop', voltage: 'repeat cycle', color: '#84cc16' },
  fuse: { symbol: '─●─', meaning: 'Try/Catch', voltage: 'safety break', color: '#ec4899' },
  
  // Connections
  junction: { symbol: '┼', meaning: 'Merge/Split', voltage: 'data junction', color: '#14b8a6' },
  terminal: { symbol: '●', meaning: 'Input/Output', voltage: 'interface point', color: '#a855f7' }
};

// Sample code visualized as circuit
const SAMPLE_CIRCUIT = `
function calculateVoltage(resistance, current) {
  ⚡ const GROUND = 0;           // Battery (constant)
  || let voltage = GROUND;      // Capacitor (variable)
  
  ╱╲ if (current > 0) {         // Switch (conditional)
    ◐◑ voltage = resistance * current;  // Transformer (function)
    ~~~~~ voltage = Math.max(voltage, 0); // Resistor (validation)
  }
  
  ━━━ return voltage;           // Wire (data flow)
}

◯◯◯ for (let i = 0; i < circuits.length; i++) {  // Oscillator (loop)
  ─●─ try {                     // Fuse (error handling)
    ◊━◊ processCircuit(circuits[i]);  // Relay (function call)
  } catch (error) {
    ⏚ return null;             // Ground (safe return)
  }
}
`;

const VOLTAGE_STATES = {
  ground: { level: 0, color: '#6b7280', label: 'Beach State (0V)' },
  low: { level: 1, color: '#84cc16', label: 'Curious (12V)' },
  medium: { level: 2, color: '#f59e0b', label: 'Engaged (120V)' },
  high: { level: 3, color: '#ef4444', label: 'Focused (2.4kV)' },
  critical: { level: 4, color: '#dc2626', label: 'Life/Death (10kV)' }
};

export default function CircuitCodeVisualizer() {
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [currentVoltage, setCurrentVoltage] = useState('ground');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const circuitRef = useRef(null);

  // Simulate voltage fluctuations
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const states = Object.keys(VOLTAGE_STATES);
      const randomState = states[Math.floor(Math.random() * states.length)];
      setCurrentVoltage(randomState);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  const getVoltageGlow = (voltage) => {
    const state = VOLTAGE_STATES[voltage];
    return `0 0 ${state.level * 5}px ${state.color}`;
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Main circuit display */}
      <div className="flex h-full">
        {/* Code as circuit schematic */}
        <div className="flex-1 p-6 relative">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Circuit Code Visualizer
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Voltage meter */}
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded">
                <Battery 
                  className="w-4 h-4" 
                  style={{ color: VOLTAGE_STATES[currentVoltage].color }}
                />
                <span className="text-sm font-mono">
                  {VOLTAGE_STATES[currentVoltage].label}
                </span>
              </div>
              
              {/* Live mode toggle */}
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-3 py-2 rounded flex items-center gap-2 ${
                  isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Power className="w-4 h-4" />
                {isLive ? 'LIVE' : 'SAFE'}
              </button>
              
              {/* Mini map toggle */}
              <button
                onClick={() => setShowMiniMap(!showMiniMap)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
              >
                {showMiniMap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                Symbol Key
              </button>
            </div>
          </div>

          {/* Circuit schematic */}
          <div 
            ref={circuitRef}
            className="bg-black p-6 rounded-lg border border-slate-700 font-mono text-sm leading-relaxed"
            style={{
              boxShadow: isLive ? getVoltageGlow(currentVoltage) : 'none',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <pre className="whitespace-pre-wrap">
              {SAMPLE_CIRCUIT.split('').map((char, index) => {
                // Find if this character is part of a circuit symbol
                const symbolEntry = Object.entries(CIRCUIT_SYMBOLS).find(([key, data]) => 
                  data.symbol.includes(char) && char !== ' '
                );
                
                if (symbolEntry) {
                  const [symbolKey, symbolData] = symbolEntry;
                  return (
                    <span
                      key={index}
                      className="cursor-pointer hover:bg-slate-800 rounded px-1"
                      style={{ 
                        color: symbolData.color,
                        textShadow: isLive ? `0 0 3px ${symbolData.color}` : 'none'
                      }}
                      onClick={() => setSelectedSymbol(symbolKey)}
                      title={`${symbolData.meaning} - ${symbolData.voltage}`}
                    >
                      {char}
                    </span>
                  );
                }
                return <span key={index}>{char}</span>;
              })}
            </pre>
          </div>

          {/* Selected symbol details */}
          {selectedSymbol && (
            <div className="mt-4 bg-slate-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span style={{ color: CIRCUIT_SYMBOLS[selectedSymbol].color }}>
                  {CIRCUIT_SYMBOLS[selectedSymbol].symbol}
                </span>
                {CIRCUIT_SYMBOLS[selectedSymbol].meaning}
              </h3>
              <p className="text-slate-300 text-sm">
                <strong>Function:</strong> {CIRCUIT_SYMBOLS[selectedSymbol].voltage}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                <strong>Voltage Level:</strong> Represents the energy required to execute this operation
              </p>
            </div>
          )}
        </div>

        {/* Mini map / Symbol key */}
        {showMiniMap && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Circuit Symbol Reference
            </h2>
            
            <div className="space-y-3">
              {Object.entries(CIRCUIT_SYMBOLS).map(([key, data]) => (
                <div
                  key={key}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedSymbol === key 
                      ? 'border-blue-400 bg-slate-700' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedSymbol(key)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span 
                      className="font-mono text-lg"
                      style={{ color: data.color }}
                    >
                      {data.symbol}
                    </span>
                    <span className="font-semibold">{data.meaning}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {data.voltage}
                  </div>
                </div>
              ))}
            </div>

            {/* Voltage states reference */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <h3 className="font-bold mb-3">Mental Voltage States</h3>
              <div className="space-y-2">
                {Object.entries(VOLTAGE_STATES).map(([key, state]) => (
                  <div
                    key={key}
                    className={`p-2 rounded text-xs ${
                      currentVoltage === key ? 'bg-slate-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: state.color }}
                      />
                      <span>{state.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chiral symmetry note */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <h3 className="font-bold mb-2 text-purple-400">Chiral Symmetry</h3>
              <p className="text-xs text-slate-400">
                Code flows like current - input transforms to output through symmetric operations. 
                Each function is its own mirror, reflecting data through logical space.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 bg-slate-800 px-3 py-2 rounded-full text-xs">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: VOLTAGE_STATES[currentVoltage].color }}
          />
          <span>System {isLive ? 'ENERGIZED' : 'DE-ENERGIZED'}</span>
        </div>
      </div>
    </div>
  );
}