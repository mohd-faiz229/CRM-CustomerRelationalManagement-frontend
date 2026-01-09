import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../Context/AuthContext.jsx";
import {
    FaHome, FaBriefcase, FaFileAlt, FaUser, FaBars,
    FaSignOutAlt, FaPlusCircle, FaUserPlus, FaGraduationCap,
    FaSearch, FaTimes
} from 'react-icons/fa';
import { FaBookOpen, FaS } from "react-icons/fa6";
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

const Sidebar = ({ userData, isMobileOpen, setIsMobileOpen }) => {
    const { logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const userRole = userData?.role?.toLowerCase().trim() || "";
    const userName = userData?.name || "User";
    const userAvatar = userData?.profileImage?.url;

    const filteredLinks = useMemo(() => {
        return Array.from(
            new Map(
                NavTabItems
                    .filter(link => {
                        const isAuthorized = userRole === 'admin' || link.allowedRoles.some(role => role.toLowerCase() === userRole);
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
            {/* Hamburger Trigger - Fixed position, matches Login Button Style */}
            {!isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed top-6 left-6 z-[60] w-12 h-12 bg-[#121418] border border-white/10 text-blue-500 rounded-xl shadow-2xl flex items-center justify-center hover:bg-blue-800 hover:text-white transition-all duration-300 active:scale-90"
                >
                    <FaBars size={18} />
                </button>
            )}

            {/* Backdrop - Smooth Fade Only */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] transition-opacity duration-[.5s] ease-in-out ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar - GPU Accelerated Transform Only (Zero Jitter) */}
            <aside
                className={`
                    fixed top-0 bottom-0 left-0 w-72 
                    bg-[#0a0c10] border-r border-white/5 
                    flex flex-col z-[80] shadow-2xl transition-transform duration-200 m-2 rounded-3xl ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Header */}
                <header className="pt-10 pb-6 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <span className="text-white font-brand font-black text-lg">R</span>
                        </div>
                        <h1 className="text-gray-200 font-brand font-bold tracking-tight text-lg">Relatio <span className='text-blue-600'>CRM</span> </h1>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                    >
                        <FaTimes size={18} />
                    </button>
                </header>

                {/* Search - Deep Dark Style */}
                <div className="px-6 mb-8">
                    <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 focus-within:border-blue-500/40 focus-within:bg-white/[0.05] transition-all">
                        <FaSearch size={12} className="text-gray-600" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Quick search..."
                            className="bg-transparent border-none outline-none text-xs text-gray-300 placeholder:text-gray-600 w-full font-medium"
                        />
                    </div>
                </div>

                {/* Navigation Links - Balanced Dark Theme */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
                    <ul className="space-y-1">
                        {filteredLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = IconMap[link.label] || FaFileAlt;

                            return (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                                                : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-200'
                                            }`}
                                    >
                                        <Icon size={16} className={isActive ? 'text-blue-500' : 'group-hover:text-blue-500 transition-colors'} />
                                        <span className="font-bold text-[13px] tracking-wide">{link.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Profile & Footer */}
                <footer className="p-4 mt-auto space-y-2">
                    <Link
                        to="/dashboard/profile"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                    >
                        <figure className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                            {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" /> : <FaUser className="text-white text-sm" />}
                        </figure>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-200 truncate">{userName}</p>
                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">{userRole}</p>
                        </div>
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-500/5 hover:text-red-500 transition-all font-bold text-[13px]"
                    >
                        <FaSignOutAlt size={16} />
                        <span>Log Out</span>
                    </button>
                </footer>
            </aside>
        </>
    );
};

export default Sidebar;