import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../Context/AuthContext.jsx";
import {
    FaHome, FaBriefcase, FaFileAlt, FaUser, FaBars,
    FaSignOutAlt, FaPlusCircle, FaUserPlus, FaGraduationCap,
    FaSearch, FaTimes
} from 'react-icons/fa';
import { FaBookOpen, } from "react-icons/fa6";
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
        return NavTabItems.filter(link => {
            // 1. Role Authorization (Admin bypasses, others must be in allowedRoles)
            const isAuthorized = userRole === 'admin' || link.allowedRoles.includes(userRole);

            // 2. Specific Business Rules (e.g., hiding specific links from non-admins)
            const isHidden = link.label === "Add New User" && userRole !== 'admin';

            // 3. Search Filter
            const matchesSearch = link.label.toLowerCase().includes(searchQuery.toLowerCase());

            return isAuthorized && !isHidden && matchesSearch;
        });
    }, [userRole, searchQuery]);

    return (
        <>
            {/* Hamburger Trigger - Fixed position, matches Login Button Style */}
            {!isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed top-6 left-6 z-[60] w-12 h-12 m-1 ml-2    rounded-3xl  shadow-2xl flex items-center justify-center   transition-all duration-300 active:scale-90"
                >
                    <FaBars size={18} />
                </button>
            )}

            {/* Backdrop - Smooth Fade Only */}
            <div
                className={`fixed inset-0   transition-opacity duration-[.5s] ease-in-out ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar - GPU Accelerated Transform Only (Zero Jitter) */}
            <aside
                className={`
                    bg-[#0f172a]
                    fixed top-0 bottom-0 left-0 w-72 
                     border-r border-white/5 
                    flex flex-col z-[80] shadow-2xl transition-transform duration-200 m-2 rounded-3xl ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Header */}
                <header className="pt-10 pb-6 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <span className="font-brand text-white font-black text-lg">R</span>
                        </div>
                        <h1 className=" font-brand font-bold text-white tracking-tight text-lg">Relatio <span className='text-blue-600'>CRM</span> </h1>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 rounded-lg    t-white  transition-colors"
                    >
                        <FaTimes size={18} color="white" />
                    </button>
                </header>

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
                                        className={`flex  text-white items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group border
                            ${isActive
                                                ? 'bg-blue-600/10 border-blue-500/30'
                                                : 'bg-transparent border-transparent  hover:bg-blue-50 dark:hover:bg-blue-700/20 '
                                            }`}
                                    >
                                        <Icon
                                            size={18} // Slightly larger for better visual weight
                                            className={`transition-colors duration-300 ${isActive
                                                ? 'text-[var(--accent-color)]'
                                                : ' text-[var(--text-muted)] group-hover:text-[var(--accent-color)] h-4'
                                                }`}
                                        />
                                        <span className="font-bold text-[12px] tracking-wider uppercase">
                                            {link.label}
                                        </span>
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
                        className="flex items-center gap-3 p-3 rounded-xl text-white bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                    >
                        <figure className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                            {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" /> : <FaUser className=" text-sm" />}
                        </figure>
                        <div className="min-w-0">
                            <p className="text-xs font-bold  truncate">{userName}</p>
                            <p className="text-[10px] uppercase font-black tracking-tighter">{userRole}</p>
                        </div>
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full flex text-white items-center gap-3 px-4 py-3 rounded-xl  hover:bg-red-500/5 hover:text-red-500 transition-all font-bold text-[13px]"
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