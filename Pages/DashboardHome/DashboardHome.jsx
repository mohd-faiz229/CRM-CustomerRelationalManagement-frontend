import React, { useEffect, useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    FaUserGraduate, FaBriefcase, FaBookOpen, FaHistory, FaPlus, FaUsers, FaSearch, FaFileInvoice
} from 'react-icons/fa';
import { callApi } from '../../Services/Api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const DashboardHome = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [studentRes, courseRes] = await Promise.all([
                    callApi.get('/counsellor/students'),
                    callApi.get('/counsellor/courses')
                ]);
                setStudents(studentRes?.data?.data || []);
                setCourses(courseRes?.data?.data || []);
            } catch (err) {
                console.error("Sync Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const { chartData, statusDist } = useMemo(() => {
        const months = {};
        const stats = { Placed: 0, Pending: 0, "In Process": 0 };
        students.forEach(s => {
            const month = new Date(s.createdAt).toLocaleString('default', { month: 'short' });
            months[month] = (months[month] || 0) + 1;
            const status = s.status || "Pending";
            if (stats.hasOwnProperty(status)) stats[status]++;
            else stats["In Process"]++;
        });
        return {
            chartData: Object.keys(months).map(m => ({ name: m, students: months[m] })),
            statusDist: Object.keys(stats).map(k => ({ name: k, value: stats[k] }))
        };
    }, [students]);

    if (loading) return <div className="p-20 text-center font-black text-gray-500 animate-pulse uppercase tracking-widest">Fetching Data...</div>;

    return (
        <div className="space-y-6 md:space-y-10 pb-20 px-2 sm:px-0">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white italic">Overview</h1>
                    
                </div>
              
            </header>

            {/* Top Stats - Improved for Mobile Tapping */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                <StatBox label="Students" val={students.length} icon={FaUserGraduate} color="text-blue-500" />
                <StatBox label="Courses" val={courses.length} icon={FaBookOpen} color="text-purple-500" />
                <StatBox label="Placed" val={students.filter(s => s.status === 'Placed').length} icon={FaBriefcase} color="text-emerald-500" className="col-span-2 md:col-span-1" />
            </div>

          
            {/* Main Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* TABLE 1: RECENT STUDENTS */}
                <div className="bg-[#121418] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8">
                    <h3 className="text-[10px] md:text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                        <FaHistory className="text-blue-500" /> Live Feed
                    </h3>
                    <div className="space-y-4">
                        {students.slice(0, 6).map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500">{i + 1}</div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-200">{s.name}</p>
                                        <p className="text-[9px] text-gray-600 uppercase font-black">{s.courseName || 'General'}</p>
                                    </div>
                                </div>
                                <div className={`text-[8px] font-black px-2 py-1 rounded uppercase ${s.status === 'Placed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                    {s.status || 'Pending'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TABLE 2: COURSE STATS */}
                <div className="bg-[#121418] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8">
                    <h3 className="text-[10px] md:text-sm font-black text-white uppercase tracking-widest mb-6">Course Availability</h3>
                    <div className="space-y-3">
                        {courses.slice(0, 5).map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-gray-300">{c.courseName}</span>
                                <span className="text-[10px] font-black text-blue-500 italic">₹{c.courseFee}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DESKTOP ONLY: CHARTS (Hidden on Phone) */}
            <div className="hidden md:grid grid-cols-2 gap-8 h-[400px]">
                <div className="bg-[#121418] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase mb-6 tracking-widest">Growth Analytics</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0c10', border: 'none', borderRadius: '12px' }} />
                            <Bar dataKey="students" fill="#3b82f6" radius={[5, 5, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-[#121418] border border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase mb-6 tracking-widest">Pipeline Health</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie data={statusDist} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// Reusable Components
const StatBox = ({ label, val, icon: Icon, color, className = "" }) => (
    <div className={`bg-[#121418] border border-white/5 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6 shadow-xl ${className}`}>
        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 ${color}`}><Icon size={18} /></div>
        <div>
            <p className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
            <p className="text-xl md:text-3xl font-black text-white italic leading-tight">{val}</p>
        </div>
    </div>
);

const QuickAction = ({ icon, label, bg }) => (
    <div className={`${bg} p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform active:scale-95`}>
        <div className="text-white text-lg">{icon}</div>
        <span className="text-[10px] font-black text-white uppercase tracking-tighter">{label}</span>
    </div>
);

export default DashboardHome;