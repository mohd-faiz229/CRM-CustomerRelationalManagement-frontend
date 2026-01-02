import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../Context/AuthContext.jsx"; // Import Context
import {
    FaHome, FaBriefcase, FaFileAlt, FaUser, FaBars,
    FaSignOutAlt, FaPlusCircle, FaUserPlus, FaGraduationCap,
    FaSearch, FaTimes
} from 'react-icons/fa';
import { FaBookOpen } from "react-icons/fa6";
import { ImBooks } from "react-icons/im";

import { NavTabItems } from '../../utils/NavTabItems.js';

const IconMap = {
    "Dashboard": FaHome,
    "Courses": ImBooks,
    "Add Student": FaPlusCircle,
    "Resumes": FaFileAlt,
    "Add New User": FaUserPlus,
    "Add New Course": FaBookOpen,
    "Placements": FaBriefcase,
    "Profile": FaUser,
    "Alumni": FaGraduationCap,
    "Students": FaGraduationCap
};

const Sidebar = ({ userData }) => {
    
        const { logout } = useAuth();
        const [isCollapsed, setIsCollapsed] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
        const [isMobileOpen, setIsMobileOpen] = useState(false); // New state for mobile toggle
        const location = useLocation();

    // ✅ Match the new data structure (_id instead of id, role trimming)
    const userRole = userData?.role?.toLowerCase().trim() || "";
    const userName = userData?.name || "User";
    const userAvatar = userData?.profileImage?.url; // ✅ Updated to match Cloudinary path

    const filteredLinks = useMemo(() => {
        return Array.from(
            new Map(
                NavTabItems
                    .filter(link => {
                        const isAuthorized =
                            userRole === 'admin' ||
                            link.allowedRoles.some(role => role.toLowerCase() === userRole);

                        // Security check for creating users
                        const isExcluded = link.label === "Add New User" && userRole !== 'admin';
                        const matchesSearch = link.label.toLowerCase().includes(searchQuery.toLowerCase());

                        return isAuthorized && !isExcluded && matchesSearch;
                    })
                    .map(link => [link.path, link])
            ).values()
        );
    }, [userRole, searchQuery]);

    return (
        <>
            {/* Mobile Toggle Button - Only visible on small screens */}
            
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[70] w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
                {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Mobile Overlay Backdrop */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                aria-label="Sidebar Navigation"
                className={`
                    /* Layout & Positioning */
                    h-[calc(100vh-1.5rem)] sticky top-3 m-3 rounded-4xl bg-slate-900/80 backdrop-blur-xl border border-white/5 flex flex-col transition-all duration-500 ease-in-out z-50 shadow-2xl shadow-black/50
                    
                    /* Desktop Width Logic */
                    ${isCollapsed ? 'lg:w-24' : 'lg:w-72'}

                    /* Mobile Transformation Logic */
                    fixed inset-x-3 bottom-3 top-3 lg:static 
                    ${isMobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] lg:translate-y-0 opacity-0 lg:opacity-100'}
                `}
            >
                {/* Header Section */}
                <header className="pt-8 pb-4 px-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                                    <span className="text-white font-black text-sm">R</span>
                                </div>
                                <span className="text-blue-500 ml-1 font-bold">CRM</span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`hidden lg:block p-2.5 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white text-slate-400 transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}
                        >
                            <FaBars size={18} />
                        </button>

                        {/* Mobile Close Button (Inside Sidebar) */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-2.5 rounded-xl bg-white/5 text-slate-400"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div role="search" className="relative group">
                        <div
                            onClick={() => isCollapsed && setIsCollapsed(false)}
                            className={`flex items-center gap-3 rounded-2xl bg-slate-800/50 border border-white/5 transition-all duration-300 ${(isCollapsed && !isMobileOpen) ? 'justify-center p-3.5 cursor-pointer hover:bg-white/10' : 'px-4 py-3 focus-within:border-blue-500/50 focus-within:bg-slate-800'}`}
                        >
                            <FaSearch size={14} className={searchQuery ? 'text-blue-400' : 'text-slate-500'} />
                            {(!isCollapsed || isMobileOpen) && (
                                <div className="flex items-center flex-1">
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Quick search..."
                                        className="bg-transparent border-none outline-none text-[13px] text-slate-200 placeholder:text-slate-600 w-full font-medium"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="ml-2">
                                            <FaTimes size={10} className="text-slate-500 hover:text-white" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Profile Section */}
                <section className="px-4 mb-6 mt-2">
                    <Link
                        to="/dashboard/profile"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group ${(isCollapsed && !isMobileOpen) ? 'justify-center hover:bg-white/5' : 'bg-linear-to-b from-white/3 to-transparent border border-white/5 hover:border-white/10 hover:bg-white/5'}`}
                    >
                        <div className="relative shrink-0">
                            <figure className="w-11 h-11 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser className="text-white text-base" />
                                )}
                            </figure>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-slate-900 rounded-full"></div>
                        </div>

                        {(!isCollapsed || isMobileOpen) && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate leading-tight group-hover:text-blue-400 transition-colors">
                                    {userName}
                                </p>
                                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold uppercase tracking-widest border border-blue-500/20">
                                    {userRole || 'User'}
                                </span>
                            </div>
                        )}
                    </Link>
                </section>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar pt-2">
                    {filteredLinks.length > 0 ? (
                        <ul className="space-y-1.5">
                            {filteredLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                const Icon = IconMap[link.label] || FaFileAlt;

                                return (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${isActive ? 'bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                                        >
                                            <Icon size={19} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            {(!isCollapsed || isMobileOpen) && <span className="font-semibold text-[13.5px]">{link.label}</span>}

                                            {isCollapsed && !isMobileOpen && (
                                                <span className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-60 border border-white/10">
                                                    {link.label}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-xs text-slate-600 italic">No modules found</p>
                        </div>
                    )}
                </nav>

                {/* Footer Section */}
                <footer className="p-4 mt-auto border-t border-white/5">
                    <button
                        type="button"
                        onClick={logout}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group ${(isCollapsed && !isMobileOpen) ? 'justify-center' : ''}`}
                    >
                        <FaSignOutAlt size={20} className="group-hover:-translate-x-1 transition-transform" />
                        {(!isCollapsed || isMobileOpen) && <span className="font-bold text-sm tracking-tight">Log Out</span>}
                    </button>
                </footer>
            </aside>
        </>
    );
};

export default Sidebar;