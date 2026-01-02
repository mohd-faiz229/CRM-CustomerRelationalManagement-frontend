import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "../Context/AuthContext.jsx";
import { Login } from '../Components/Login/Login.jsx';
import { CreateUser } from "../Components/CreateUser/CreateUser.jsx";
import { Otp } from "../Components/OtpComp/Otp.jsx";
import Dashboard from "../Components/Dashboard/Dashboard.jsx";

function App() {
  return (
    // ✅ Wrap your entire app with AuthContextProvider
    <AuthProvider>
      <div className='h-full bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]'>
        <Toaster position='top' />

        <Routes>
          {/* Redirect root "/" to login */}
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
