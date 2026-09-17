import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Activity, Heart, ShieldCheck, Zap } from 'lucide-react';

type SignalMode = 'rppg' | 'ecg' | 'bp';

export const SignalMonitor: React.FC = () => {
  const [mode, setMode] = useState<SignalMode>('rppg');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [bpm, setBpm] = useState<number>(72);
  const [sqi, setSqi] = useState<number>(98.4);
  const [spo2, setSpo2] = useState<number>(98);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Biological variability jitter
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const baseBpm = mode === 'rppg' ? 72 : mode === 'ecg' ? 70 : 74;
      const jitter = (Math.random() * 2 - 1) * 1.5;
      setBpm(Math.round(baseBpm + jitter));
      setSqi(Number((97.8 + Math.random() * 1.6).toFixed(1)));
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying, mode]);

  // Real-time canvas waveform renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle clinical grid
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Generate waveform path based on mode
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#E11D48'; // Clinical cardiac pulse crimson
      ctx.shadowColor = 'rgba(225, 29, 72, 0.7)';
      ctx.shadowBlur = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const wavelength = mode === 'ecg' ? 140 : mode === 'rppg' ? 110 : 125;
      const centerY = height / 2;

      for (let x = 0; x < width; x++) {
        const t = (x + offset) % wavelength;
        const normT = t / wavelength;
        let y = centerY;

        if (mode === 'rppg') {
          // Photoplethysmography wave (Systolic peak + dicrotic notch)
          const phase = normT * Math.PI * 2;
          const primary = Math.sin(phase) * 32;
          const dicrotic = Math.sin(phase * 2 - 0.9) * 12;
          y = centerY - (primary + dicrotic * 0.7);
        } else if (mode === 'ecg') {
          // Classic P-Q-R-S-T complex
          if (normT < 0.15) {
            y = centerY;
          } else if (normT < 0.25) {
            // P wave
            y = centerY - Math.sin((normT - 0.15) * 10 * Math.PI) * 7;
          } else if (normT < 0.35) {
            // PR segment
            y = centerY;
          } else if (normT < 0.38) {
            // Q wave
            y = centerY + 9;
          } else if (normT < 0.45) {
            // R peak
            y = centerY - 52;
          } else if (normT < 0.50) {
            // S wave
            y = centerY + 16;
          } else if (normT < 0.65) {
            // ST segment
            y = centerY;
          } else if (normT < 0.85) {
            // T wave
            y = centerY - Math.sin((normT - 0.65) * 5 * Math.PI) * 15;
          } else {
            y = centerY;
          }
        } else {
          // Continuous Blood Pressure Waveform
          const phase = normT * Math.PI * 2;
          const arterialPulse = Math.sin(phase) * 35;
          const reflectiveEcho = Math.sin(phase * 2.2 + 0.4) * 10;
          y = centerY - (arterialPulse + reflectiveEcho);
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Second soft glow layer
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.2)';
      ctx.stroke();

      if (isPlaying) {
        offset = (offset + 1.6) % 10000;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, mode]);

  return (
    <div
      id="live-signal-telemetry"
      className="bg-[#14060a] rounded-2xl p-5 sm:p-6 relative overflow-hidden border border-[#301016] shadow-xl text-slate-100 flex flex-col justify-between min-h-[310px]"
    >
      {/* Top Bar: Title & Signal Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-950/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-maroon-600"></span>
            </span>
            <p className="text-rose-300 text-xs font-mono uppercase tracking-wider font-semibold">
              Live Signal: {mode === 'rppg' ? 'rPPG Extraction (Video)' : mode === 'ecg' ? 'Lead-II Telemetry ECG' : 'Continuous BP Wave'}
            </p>
          </div>
          <p className="text-slate-400 text-[11px] font-sans mt-0.5">
            Real-time deep physiological inference at 30 FPS
          </p>
        </div>

        {/* Signal Mode Tabs */}
        <div className="inline-flex bg-slate-950/80 p-1 rounded-lg border border-rose-950/80 text-xs font-medium">
          <button
            id="tab-mode-rppg"
            onClick={() => setMode('rppg')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'rppg' ? 'bg-maroon-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            rPPG
          </button>
          <button
            id="tab-mode-ecg"
            onClick={() => setMode('ecg')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'ecg' ? 'bg-maroon-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ECG
          </button>
          <button
            id="tab-mode-bp"
            onClick={() => setMode('bp')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'bp' ? 'bg-maroon-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Continuous BP
          </button>
        </div>
      </div>

      {/* Center Waveform Canvas */}
      <div className="relative my-3 w-full h-32 sm:h-36 bg-[#0c0305] rounded-xl border border-rose-950/60 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={560}
          height={144}
          className="w-full h-full object-contain"
        />

        {/* Overlay scanning line indicator */}
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#0c0305] to-transparent pointer-events-none" />

        {/* Sampling watermark */}
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-rose-500" />
          <span>Sampling: {mode === 'rppg' ? '30 FPS RGB Sensor' : '250 Hz Multi-Lead'}</span>
        </div>
      </div>

      {/* Bottom Telemetry Metrics & Control Bar */}
      <div className="flex items-center justify-between pt-1 text-slate-300">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Heart Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{bpm}</span>
              <span className="text-xs text-rose-400 font-semibold font-mono">BPM</span>
            </div>
          </div>

          <div className="border-l border-rose-950/80 pl-4">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Signal Quality (SQI)</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-sm sm:text-base font-bold text-slate-100">{sqi}%</span>
              <span className="text-[10px] text-emerald-400 ml-1 hidden sm:inline">Optimal</span>
            </div>
          </div>

          <div className="border-l border-rose-950/80 pl-4">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Est. SpO₂</span>
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-base font-bold text-slate-100">{spo2}%</span>
              <span className="text-[10px] text-slate-400 font-mono">Norm</span>
            </div>
          </div>
        </div>

        {/* Play/Pause & Reset Stream */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-toggle-signal"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause telemetry stream' : 'Resume telemetry stream'}
            className="p-2 rounded-lg bg-slate-900 hover:bg-maroon-950 text-slate-300 hover:text-white transition-colors border border-rose-950/60"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            id="btn-recalibrate-signal"
            onClick={() => {
              setBpm(72);
              setSqi(98.8);
            }}
            title="Recalibrate signal filter"
            className="p-2 rounded-lg bg-slate-900 hover:bg-maroon-950 text-slate-300 hover:text-white transition-colors border border-rose-950/60"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
