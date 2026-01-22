import { useState } from 'react';
import Sidebar from "../SideBar/SideBar.jsx";
import Header from "../Header/Header.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHome from "../../Pages/DashboardHome/DashboardHome.jsx";
import Profile from "../Profile/Profile.jsx";
import CreateUser from "../../Components/CreateUser/CreateUser.jsx";
import AddCourse from "../../Pages/AddCourse/AddCourse.jsx";
import AddStudent from "../../Pages/AddStudent/AddStudent.jsx";
import Students from "../../Pages/Students/Students.jsx";
import Courses from "../../Pages/Courses/Courses.jsx";
import NewStudents from "../../Pages/NewStudents/NewStudents.jsx";
import Placements from "../../Pages/Placements/Placements.jsx";
import Resumes from "../../Pages/Resumes/Resumes.jsx";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/Login" />;

  return (
    <div className="relative min-h-screen flex font-sans ">
      {/* SIDEBAR */}
      <Sidebar
        userData={user}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 min-w-0 h-screen transition-all duration-300">

        {/* HEADER: Removed the background wrapper so the Header capsule floats naturally */}
        <div className="sticky top-0 w-full z-20 px-4">
          <Header userData={user} />
        </div>

        {/* MAIN CONTENT: Balanced padding and smooth scroll */}
        <main className="flex-1 overflow-y-auto px-6 pb-10 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-[1440px] mx-auto"
            >
              <Routes location={location}>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<Profile />} />
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