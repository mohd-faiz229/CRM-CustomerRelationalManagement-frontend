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

// Page animation variants
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
    <div className="h-screen flex text-white overflow-hidden bg-slate-950 relative">

      {/* Sidebar - Controlled by isMobileOpen */}
      <Sidebar
        userData={user}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header Area */}
        <header className="flex items-center px-4 lg:px-0">
          {/* Mobile Menu Trigger - Visible only on small screens */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-3 mr-2 bg-slate-900 rounded-xl border border-white/5 text-blue-500"
          >
            <FaBars size={20} />
          </button>

          <div className="flex-1">
            <Header userData={user} />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <Routes location={location}>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<Profile employee={user} />} />
                <Route path="create-user" element={<CreateUser />} />
                {/* ... other routes ... */}
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