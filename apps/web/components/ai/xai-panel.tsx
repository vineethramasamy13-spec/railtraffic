"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { X, BrainCircuit, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface XAIPanelProps {
  prediction: {
    value: string | number;
    unit?: string;
    confidence: number; // 0-1
    factors: Array<{
      name: string;
      impact: number; // minutes or percentage
      direction: 'positive' | 'negative';
      description: string;
    }>;
    suggestedActions: string[];
    modelName: string;
    modelVersion: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function XAIPanel({ prediction, isOpen, onClose }: XAIPanelProps) {
  if (!isOpen) return null;

  const confidenceColor = 
    prediction.confidence > 0.8 ? "text-success" :
    prediction.confidence > 0.6 ? "text-warning" : "text-destructive";
    
  const confidenceBg = 
    prediction.confidence > 0.8 ? "bg-success" :
    prediction.confidence > 0.6 ? "bg-warning" : "bg-destructive";

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0D1B2A]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto animate-slide-up flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0D1B2A]/90 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-orange" />
          <h2 className="font-semibold text-lg text-slate-100">AI Analysis</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-slate-400" />
        </Button>
      </div>

      <div className="p-6 flex-1 space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Predicted Outcome</p>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-bold text-white">{prediction.value}</span>
            {prediction.unit && <span className="text-lg text-slate-400 mb-1">{prediction.unit}</span>}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-slate-400">Confidence:</span>
            <span className={cn("text-sm font-bold", confidenceColor)}>
              {(prediction.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={prediction.confidence * 100} indicatorClassName={confidenceBg} className="h-2" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Key Factors</h3>
          <div className="space-y-3">
            {prediction.factors.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-200">{factor.name}</span>
                  <span className={factor.direction === 'negative' ? 'text-destructive' : 'text-success'}>
                    {factor.direction === 'negative' ? '+' : '-'}{factor.impact} {prediction.unit || '%'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 flex">
                  {factor.direction === 'negative' ? (
                    <div className="h-1.5 rounded-full bg-destructive" style={{ width: `${Math.min(factor.impact * 10, 100)}%` }} />
                  ) : (
                    <div className="h-1.5 rounded-full bg-success" style={{ width: `${Math.min(factor.impact * 10, 100)}%` }} />
                  )}
                </div>
                <p className="text-xs text-slate-500">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Suggested Actions</h3>
          <div className="flex flex-wrap gap-2">
            {prediction.suggestedActions.map((action, idx) => (
              <Button key={idx} variant="outline" size="sm" className="bg-slate-800/50 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700">
                {action}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-slate-900/50">
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
          <Activity className="h-3 w-3" />
          <span>Powered by {prediction.modelName} (v{prediction.modelVersion})</span>
        </div>
      </div>
    </div>
  )
}
