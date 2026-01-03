import { useState } from 'react';
import Sidebar from "../SideBar/SideBar.jsx";
import Header from "../Header/Header.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHome from "../../Pages/DashboardHome/DashboardHome.jsx";
import Profile from "../Profile/Profile.jsx";
import CreateUser from "../CreateUser/CreateUser.jsx";
 
import { FaBars } from 'react-icons/fa';
import AddCourse from "../../Pages/AddCourse/AddCourse.jsx"
import AddStudent from "../../Pages/AddStudent/AddStudent.jsx"
import Students from "../../Pages/Students/Students.jsx"
import Courses from "../../Pages/Courses/Courses.jsx"

import NewStudents from '../../Pages/NewStudents/NewStudents.jsx';
import Placements from '../../Pages/Placements/Placements.jsx';
import Resumes from '../../Pages/Resumes/Resumes.jsx';

// Page animation variants - Cleaned of invisible characters
const pageTransitionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/Login" replace />;

  return (
    <div className="h-screen w-full flex text-white overflow-hidden bg-slate-950 relative">
      {/* Sidebar - Remains hidden on mobile until isMobileOpen is true */}
      <Sidebar
        userData={user}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden w-full">
        {/* Header Container - Full width, no side margins */}
        <header className="flex items-center w-full bg-slate-950 border-b border-white/5 z-20">
          {/* Hamburger Menu - Visible only on mobile */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-4 text-blue-500 hover:bg-white/5 transition-colors"
          >
            <FaBars size={22} />
          </button>

          <div className="flex-1">
            {/* Ensure Header.jsx internal styles don't have 'm-3' or 'rounded' if you want it flush */}
            <Header userData={user} />
          </div>
        </header>

        {/* Main Section - Full screen width on mobile */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-8 no-scrollbar bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full w-full px-4 pt-4 lg:px-0 lg:pt-0"
            >
              <Routes location={location}>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<Profile employee={user} />} />
                <Route path="create-user" element={<CreateUser />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="add-student" element={<AddStudent />} />
                <Route path="students" element={<Students />} />
                <Route path="courses" element={<Courses />} />
                <Route path="new-students" element={<NewStudents />} />
                <Route path="placements" element={<Placements />} />
                <Route path="resumes" element={<Resumes />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;