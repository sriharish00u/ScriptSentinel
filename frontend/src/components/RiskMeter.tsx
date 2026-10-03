import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, XCircle } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  riskLevel: string;
}

export default function RiskMeter({ score, riskLevel }: RiskMeterProps) {
  // Determine color theme based on score
  let strokeColor = '#22c55e'; // Green
  let bgColor = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
  let icon = <CheckCircle className="h-5 w-5 text-emerald-400" />;
  let label = 'Clean & Algo-Safe';

  if (score >= 75) {
    strokeColor = '#ef4444'; // Red
    bgColor = 'bg-red-950/40 text-red-400 border-red-500/30';
    icon = <XCircle className="h-5 w-5 text-red-400" />;
    label = 'Critical Ban Risk';
  } else if (score >= 45) {
    strokeColor = '#f97316'; // Orange
    bgColor = 'bg-orange-950/40 text-orange-400 border-orange-500/30';
    icon = <ShieldAlert className="h-5 w-5 text-orange-400" />;
    label = 'Shadowban Likely';
  } else if (score >= 15) {
    strokeColor = '#eab308'; // Yellow
    bgColor = 'bg-amber-950/40 text-amber-400 border-amber-500/30';
    icon = <AlertTriangle className="h-5 w-5 text-amber-400" />;
    label = 'Caution Advised';
  }

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-5 p-4 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-white font-mono">{score}%</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Risk</span>
        </div>
      </div>

      <div className="space-y-1.5 flex-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bgColor}`}>
          {icon}
          <span>{riskLevel || label}</span>
        </div>
        <p className="text-xs text-slate-400 leading-normal">
          {score >= 75
            ? 'Severe restriction triggers detected. High probability of immediate ad disapproval or account suppression.'
            : score >= 45
            ? 'Algorithms will throttle FYP/Explore distribution and reduce CPM value.'
            : score >= 15
            ? 'Minor sensitive keywords present. Consider substituting flagged terms.'
            : 'Excellent compliance score! Script is ready for publishing across targeted platforms.'}
        </p>
      </div>
    </div>
  );
}
