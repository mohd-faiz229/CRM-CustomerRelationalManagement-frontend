import React from 'react';
import { FaBuilding, FaUserTie, FaCheckCircle } from 'react-icons/fa';

const Placements = () => {
  const placements = [
    { name: "Aarav Sharma", course: "Full Stack Web Development", company: "Infosys", role: "Software Engineer" },
    { name: "Priya Verma", course: "AWS Solutions Architect", company: "Amazon", role: "Cloud Engineer" },
    { name: "Rahul Mehta", course: "UI/UX Design Masterclass", company: "Adobe", role: "Product Designer" },
    { name: "Sneha Kapoor", course: "Full Stack Web Development", company: "TCS", role: "Frontend Developer" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Minimalist Industrial Header */}
        <header className="flex flex-col gap-1 border-l-4 border-blue-600 pl-6">
          <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
            Placement Records
          </h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">
            Verified Career Transitions // Global Network
          </p>
        </header>

        {/* The Grid / Table Wrapper */}
        <div className="bg-[#121418] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Candidate</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">Specialization</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Organization</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Designation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {placements.map((student, index) => (
                  <tr key={index} className="group hover:bg-white/[0.03] transition-all">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 font-black italic">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white italic tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                            {student.name}
                          </p>
                          <p className="text-[9px] text-gray-600 font-bold md:hidden uppercase mt-0.5">
                            {student.course}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 hidden md:table-cell">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        {student.course}
                      </p>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaBuilding className="text-gray-600 text-[10px]" />
                        <span className="text-xs font-bold uppercase tracking-tight">{student.company}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 text-emerald-500 text-[10px] font-black border border-emerald-500/10 uppercase italic">
                        <FaCheckCircle className="text-[8px]" />
                        {student.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Metadata Footnote */}
      
      </div>
    </div>
  );
};

export default Placements;