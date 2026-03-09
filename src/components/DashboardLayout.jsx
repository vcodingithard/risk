import React from 'react';
import { LayoutDashboard, Map, Activity, GitGraph, Settings, ShieldAlert } from 'lucide-react';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <ShieldAlert className="text-rose-500 w-6 h-6 mr-3" />
          <h1 className="font-bold text-lg tracking-wide text-white">GRIP</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard Overview" active />

        </nav>
        <div className="p-4 border-t border-slate-800">
          <SidebarItem icon={<Settings />} label="Simulation Settings" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-semibold text-slate-100">India System Risk Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-300">
              Update: Live
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-slate-950 to-slate-900">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <span className={`w-5 h-5 mr-3 ${active ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
