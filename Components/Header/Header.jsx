import { FaUserTie } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext.jsx";
import { useState } from "react";
import ThemeToggle from "../ToggleTheme/Toggle.jsx";

const Header = () => {
  // Pulling the full user object from global state
  const { user } = useAuth();

  // Extracting data from the synchronized user object
  const firstName = user?.name?.split(' ')[0] || "User";
  const userRole = user?.role || "Employee";
  // The normalized profileImage from AuthContext is already a URL
  const avatarUrl = user?.profileImage;

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  return (
    <header className="h-20 flex items-center gap-10 m-3 px-6 rounded-[20rem] justify-center gap-2 ALI\ border border-slate-500/30 backdrop-blur-xl">
      {/* --- Right Side: User Capsule --- */}
      <ThemeToggle lightMode={lightMode} setLightMode={setLightMode} />
      <div className="flex ml-10 items-center gap-4 bg-white/10 border-2 border-white/10 pl-5 pr-2 py-1.5 rounded-full shadow-2xl group hover:bg-white/15 transition-all cursor-default">
        <div className="flex flex-col items-end leading-tight">
          <p className="text-[10px] uppercase tracking-widest font-medium">
            Hello, {firstName}
          </p>
          <p className="text-sm font-bold text-blue-400 capitalize">
            {userRole}
          </p>
        </div>

        {/* User Icon / Avatar */}
        <div className="w-10 h-10 rounded-full bg-linear-to-tr text-white from-blue-400 to-blue-600 flex items-center justify-center border-2 border-white/20 group-hover:border-blue-400 transition-all overflow-hidden shadow-lg">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              // Fallback if the image fails to load
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <FaUserTie className="text-xl" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
