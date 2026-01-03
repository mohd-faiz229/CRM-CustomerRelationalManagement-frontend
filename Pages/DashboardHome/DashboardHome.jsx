import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    FaUserGraduate, FaBriefcase, FaFileAlt, FaBookOpen
} from 'react-icons/fa';
import { callApi } from '../../Services/Api';

// Mock Data (replace later if needed)
const enrollmentData = [
    { name: 'Week 1', students: 12 },
    { name: 'Week 2', students: 19 },
    { name: 'Week 3', students: 15 },
    { name: 'Week 4', students: 22 },
];

const placementData = [
    { name: 'Placed', value: 45 },   
    { name: 'Pending', value: 25 },
    { name: 'In Process', value: 30 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const DashboardHome = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await callApi("/counsellor/getAllStudents", "GET");
                setStudents(res?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch students", err);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">CRM Overview</h1>
                <p className="text-gray-400">Welcome back! Here is what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Students',
                        val: students.length,
                        icon: FaUserGraduate,
                        color: 'text-blue-500',
                        bg: 'bg-blue-500/10',
                    },
                    {
                        label: 'Courses Active',
                        val: '24',
                        icon: FaBookOpen,
                        color: 'text-purple-500',
                        bg: 'bg-purple-500/10',
                    },
                    {
                        label: 'Placed Students',
                        val: '856',
                        icon: FaBriefcase,
                        color: 'text-emerald-500',
                        bg: 'bg-emerald-500/10',
                    },
                    {
                        label: 'New Resumes',
                        val: students.length,
                        icon: FaFileAlt,
                        color: 'text-orange-500',
                        bg: 'bg-orange-500/10',
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                            <item.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">{item.label}</p>
                            <p className="text-2xl font-bold">{item.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 h-[400px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-6">Student Enrollment</h2>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer className="h-full" width="100%" height="100%">
                            <BarChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 h-[400px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-6">Placement Distribution</h2>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={placementData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {placementData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
