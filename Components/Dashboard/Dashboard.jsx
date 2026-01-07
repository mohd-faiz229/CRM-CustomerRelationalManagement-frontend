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


// ... (Keep all your Page imports here)

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (authLoading) return <div className="h-screen bg-slate-950" />;
  if (!user) return <Navigate to="/Login" replace />;

  return (
    /* The parent 'flex' ensures children sit side-by-side without gaps */
    <div className="h-screen w-full flex bg-slate-950 text-white overflow-hidden">

      <Sidebar
        userData={user}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* flex-1 tells this div to take up ALL remaining space automatically */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden transition-all duration-500">

        <header className="flex items-center w-full bg-slate-950 border-b border-white/5 z-20">
         
          <div className="flex-1">
            <Header userData={user} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
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