import React from 'react';
import { Camera, Radio, Server, Microscope, Headphones, ShieldCheck, Check, Sparkles, Cpu, Layers } from 'lucide-react';

export const LabFacilities: React.FC = () => {
  const facilities = [
    {
      id: "optical-rig",
      title: "Contactless Optical Rig",
      tag: "Optics & Vision",
      icon: <Camera className="w-5 h-5 text-maroon-700 dark:text-rose-300" />,
      desc: "Calibrated ambient illumination array with synchronized reference contact PPG for contactless vital sign estimation algorithms.",
      specs: ["4K 120fps Chromatic Sensors", "Calibrated Lux Chamber (0-2000 lx)", "Synchronized Medical ECG/PPG Baseline"],
      status: "Operational"
    },
    {
      id: "wearable-chamber",
      title: "Wearable Telemetry Chamber",
      tag: "Embedded Bio-Sensing",
      icon: <Radio className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      desc: "Micro-power signal acquisition testbench for bio-impedance, galvanic skin response, and motion-artifact simulation.",
      specs: ["Sub-mW Power Analyzers", "Programmable Motion Artifact Gimbal", "Micro-Electrode Skin Interface Bench"],
      status: "Operational"
    },
    {
      id: "sim-cluster",
      title: "Clinical Simulation Cluster",
      tag: "Compute & Streaming",
      icon: <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      desc: "Dedicated high-throughput compute cluster for sequential state-space modeling, triage risk calibration, and synthetic patient generation.",
      specs: ["GPU Inference Blades (48GB VRAM)", "Low-Latency Bedside Stream Pipeline (<16ms)", "Synthetic EHR Sandbox Isolation"],
      status: "24/7 Compute"
    },
    {
      id: "phantom-workstation",
      title: "Phantom Imaging Workstation",
      tag: "Acoustic & Volumetric",
      icon: <Microscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      desc: "Volumetric slice analysis and diffusion prior testbed for synthetic anatomical phantoms and low-dose imaging reconstruction.",
      specs: ["Tissue-Equivalent Polyacrylamide Phantoms", "Sparse-Sampling Simulators", "3D Deformable Motion Visualizers"],
      status: "Operational"
    },
    {
      id: "prosodic-lab",
      title: "Prosodic & Affect Chamber",
      tag: "Acoustic Biomarkers",
      icon: <Headphones className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      desc: "Acoustically isolated chamber for continuous vocal prosody, pupil dilation tracking, and simulated cognitive workload protocols.",
      specs: ["Acoustic Isolation (<22 dBA ambient)", "High-Fidelity Studio Condenser Mics", "Binocular 250Hz Infrared Eye Tracker"],
      status: "Active Protocols"
    },
    {
      id: "xai-bedside",
      title: "XAI Bedside Clinical Suite",
      tag: "Human-in-the-Loop",
      icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      desc: "Clinician-in-the-loop audit suite evaluating concept bottleneck interpretability, counterfactual recourse, and alert fatigue reduction.",
      specs: ["Dual Bedside High-DPI Monitors", "Interactive Saliency Audit Logging", "Clinician Usability Latency Profiler"],
      status: "Clinical Trials"
    }
  ];

  return (
    <section id="facilities" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#15070c] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-100 dark:bg-maroon-950/80 border border-maroon-200 dark:border-maroon-800/80 text-maroon-900 dark:text-maroon-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-maroon-700 dark:text-maroon-400" />
              <span>Research Infrastructure</span>
              <span className="text-maroon-400 dark:text-maroon-600">•</span>
              <span>Experimental Environments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Laboratory Facilities & Testing Rigs
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Specialized benchtop hardware, acoustic isolation chambers, and high-performance computing clusters engineered to bridge raw physiological sensors and hospital bedside deployment.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>6 Active Testbenches</span>
            </div>
          </div>
        </div>

        {/* 6 Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={fac.id}
              id={`facility-card-${fac.id}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#1a0810] p-6 space-y-4 hover:border-maroon-500/80 dark:hover:border-maroon-600 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header: Icon, Tag & Rig Number */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0f0206] border border-slate-200 dark:border-[#881337]/50 shadow-inner group-hover:scale-105 transition-transform">
                    {fac.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {fac.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-rose-300/60 font-bold">
                      RIG-0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-maroon-800 dark:group-hover:text-rose-300 transition-colors">
                    {fac.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {fac.desc}
                  </p>
                </div>
              </div>

              {/* Hardware Specifications Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#881337]/30 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400">
                  Bench Specifications
                </div>
                {fac.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-rose-100/90 font-mono">
                    <Check className="w-3.5 h-3.5 text-maroon-700 dark:text-rose-400 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {fac.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
