import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../Context/AuthContext.jsx";
import { Login } from '../Components/Login/Login.jsx';
import { CreateUser } from "../Components/CreateUser/CreateUser.jsx";
import { Otp } from "../Components/OtpComp/Otp.jsx";
import Dashboard from "../Components/Dashboard/Dashboard.jsx";
import { useState, useEffect } from "react";
import ToggleTheme from "../Components/ToggleTheme/Toggle.jsx";


function App() {
  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  return (
    <AuthProvider>
      {/* STRIP OUT the hardcoded 'bg-linear-to-br from-[#0f172a]...' 
          The background is now handled by your CSS variables.
      */}
      <div className="min-h-screen  duration-500">
        <Toaster position="top-center" />
        {/* <ToggleTheme lightMode={lightMode} setLightMode={setLightMode} /> */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp-verify" element={<Otp />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
