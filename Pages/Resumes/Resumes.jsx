import React from 'react';
import { FaTools, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Resumes = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center px-4">
      {/* Background Glow Effect */}
      <div className="absolute -z-10 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full" />

      {/* Icon with Animated Ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-blue-500 shadow-2xl">
          <FaTools size={40} className="animate-pulse" />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md space-y-4">
        <h2 className="text-4xl font-black text-white tracking-tight">
          Resumes <span className="text-blue-500">Module</span>
        </h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Under Construction
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          We're currently building a powerful AI-driven resume parser and repository for your students. This feature will be available in the next update.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-10 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 group font-semibold text-sm"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
    </div>
  );
};

export default Resumes;