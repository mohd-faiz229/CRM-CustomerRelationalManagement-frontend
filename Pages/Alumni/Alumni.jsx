// import React from 'react'

const Alumni = () => {
    const alumniData = [
        {
            name: "Ishaan Malhotra",
            batch: "Full Stack - July 2023",
            company: "Google",
            role: "SDE II",
            status: "Placed",
            lastContact: "2 days ago",
            salary: "₹24 LPA",
            mentorship: true
        },
        {
            name: "Ananya Iyer",
            batch: "AWS - Jan 2023",
            company: "Microsoft",
            role: "Cloud Architect",
            status: "Placed",
            lastContact: "1 week ago",
            salary: "₹18 LPA",
            mentorship: false
        },
        {
            name: "Vikram Singh",
            batch: "UI/UX - Oct 2023",
            company: "Zomato",
            role: "Product Designer",
            status: "Placed",
            lastContact: "Just now",
            salary: "₹14 LPA",
            mentorship: true
        }
    ]

    return (
        <div className="p-10  min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold ">Alumni Database</h2>
                        <p className="mt-2 text-slate-400">Manage placement records and post-hiring career tracking.</p>
                    </div>
                   
                </div>

                {/* CRM Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumniData.map((alumni, index) => (
                        <div
                            key={index}
                            className="bg-[#0F172A] rounded-2xl border border-white/5 p-6 hover:border-blue-500/30 transition-all group"
                        >
                            {/* Top Row: Initial and Status */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#1E293B] border border-white/10 flex items-center justify-center text-blue-400 font-bold">
                                    {alumni.name.charAt(0)}
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${alumni.status === 'Placed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    {alumni.status}
                                </span>
                            </div>

                            {/* Main Info */}
                            <h3 className="text-lg font-bold  group-hover:text-blue-400 transition-colors">{alumni.name}</h3>
                            <p className="text-slate-500 text-xs font-medium mb-4">{alumni.batch}</p>

                            {/* CRM Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Company</p>
                                    <p className="text-sm font-medium text-slate-200">{alumni.company}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Current CTC</p>
                                    <p className="text-sm font-medium text-slate-200">{alumni.salary}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Role</p>
                                    <p className="text-sm text-slate-200 font-medium">{alumni.role}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Mentorship</p>
                                    <p className={`text-sm font-medium ${alumni.mentorship ? 'text-emerald-400' : 'text-slate-600'}`}>
                                        {alumni.mentorship ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>

                            {/* Footer: Last Contact and Action */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] ">
                                    Last Active: <span className="text-white">{alumni.lastContact}</span>
                                </span>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Alumni;