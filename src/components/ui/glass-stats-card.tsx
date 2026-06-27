import React from "react";
import { Calendar, Users, Handshake, Trophy } from "lucide-react";

const StatBlock = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A50000]/20 ring-1 ring-[#E8A020]/20">
      <Icon className="h-5 w-5 text-[#E8A020]" />
    </div>
    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</span>
    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-medium">
      {label}
    </span>
  </div>
);

export default function GlassStatsCard() {
  return (
    <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-[26.4px] shadow-2xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#A50000]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatBlock icon={Calendar} value="20+" label="Events Hosted" />
          <StatBlock icon={Users} value="100+" label="Active Members" />
          <StatBlock icon={Handshake} value="8+" label="Collaborations" />
          <StatBlock icon={Trophy} value="3+" label="Years on Campus" />
        </div>
      </div>
    </div>
  );
}
