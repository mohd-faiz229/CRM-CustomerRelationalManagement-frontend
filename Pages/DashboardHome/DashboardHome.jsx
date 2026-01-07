import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    FaUserGraduate, FaBriefcase, FaFileAlt, FaBookOpen
} from 'react-icons/fa';
import { callApi } from '../../Services/Api';

const enrollmentData = [
    { name: 'W1', students: 12 }, // Shortened labels for mobile
    { name: 'W2', students: 19 },
    { name: 'W3', students: 15 },
    { name: 'W4', students: 22 },
];

const placementData = [
    { name: 'Placed', value: 45 },
    { name: 'Pending', value: 25 },
    { name: 'In Process', value: 30 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const DashboardHome = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
               const res = await callApi.get('/counsellor/students');
                
                setStudents(res?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const stats = [
        { label: 'Total Students', val: students.length, icon: FaUserGraduate, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Courses Active', val: '3', icon: FaBookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Placed Students', val: '5', icon: FaBriefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'New Resumes', val: students.length, icon: FaFileAlt, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="space-y-6 md:space-y-10 pb-10 px-2 sm:px-0">
            {/* Header - Centered on mobile, left-aligned on desktop */}
            <header className="flex flex-col gap-2 text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">CRM Overview</h1>
                <p className="text-sm md:text-base text-gray-400">Welcome back! Here's your real-time performance data.</p>
            </header>

            {/* Stat Cards - 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className={`p-3 md:p-4 rounded-xl ${item.bg} ${item.color} shrink-0`}>
                            <item.icon className="text-xl md:text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs md:text-sm text-gray-400 truncate uppercase tracking-wider font-semibold">{item.label}</p>
                            <p className="text-xl md:text-2xl font-bold text-white leading-none mt-1">
                                {loading ? "..." : item.val}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section - Stacks on mobile */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

                {/* Bar Chart Container */}
                <div className="p-4 md:p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
                    <h2 className="text-lg md:text-xl font-semibold mb-6 text-white">Student Enrollment</h2>
                    <div className="h-[250px] md:h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollmentData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Container */}
                <div className="p-4 md:p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
                    <h2 className="text-lg md:text-xl font-semibold mb-6 text-white text-center md:text-left">Placement Distribution</h2>
                    <div className="h-[250px] md:h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={placementData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="60%"
                                    outerRadius="85%"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {placementData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;