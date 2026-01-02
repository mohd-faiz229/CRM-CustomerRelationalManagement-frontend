import React from 'react'

const Placements = () => {
  const placements = [
    {
      name: "Aarav Sharma",
      course: "Full Stack Web Development",
      company: "Infosys",
      role: "Software Engineer"
    },
    {
      name: "Priya Verma",
      course: "AWS Solutions Architect",
      company: "Amazon",
      role: "Cloud Engineer"
    },
    {
      name: "Rahul Mehta",
      course: "UI/UX Design Masterclass",
      company: "Adobe",
      role: "Product Designer"
    },
    {
      name: "Sneha Kapoor",
      course: "Full Stack Web Development",
      company: "TCS",
      role: "Frontend Developer"
    }
  ]

  return (
    <div className="p-10 bg-[#0F172A] min-h-screen font-sans">
      {/* Main Card Container - Dark Navy */}
      <div className="max-w-6xl mx-auto bg-[#1E293B] rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">

        {/* Header Section */}
        <div className="p-8 border-b border-slate-700/50 bg-[#1E293B]">
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Placements</h2>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Header row - Slightly darker/lighter navy */}
              <tr className="bg-[#0F172A]/50">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Student Name</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Course</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Company</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {placements.map((student, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-800/50 transition-colors duration-200 group"
                >
                  <td className="px-8 py-6 text-sm font-semibold text-slate-100">
                    {student.name}
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400">
                    {student.course}
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400">
                    {student.company}
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 whitespace-nowrap">
                      {student.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Placements