import { FaUserTie } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext.jsx";

const Header = () => {
  // Pulling the full user object from global state
  const { user } = useAuth();

  // Extracting data from the synchronized user object
  const firstName = user?.name?.split(' ')[0] || "User";
  const userRole = user?.role || "Employee";
  // The backend saves it under profileImage.url
  const avatarUrl = user?.profileImage?.url;

  return (
    <header className="h-20 flex items-center justify-end m-3 px-6 bg-white/5 border border-white/10 rounded-[20rem] backdrop-blur-xl text-white">

      {/* --- Right Side: User Capsule --- */}
      <div className="flex items-center gap-4 bg-white/10 border border-white/10 pl-5 pr-2 py-1.5 rounded-full shadow-inner group hover:bg-white/15 transition-all cursor-default">

        <div className="flex flex-col items-end leading-tight">
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
            Hello, {firstName}
          </p>
          <p className="text-sm font-bold text-blue-400 capitalize">
            {userRole}
          </p>
        </div>

        {/* User Icon / Avatar */}
        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border-2 border-white/20 group-hover:border-blue-400 transition-all overflow-hidden shadow-lg">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              // Fallback if the Cloudinary URL fails to load
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <FaUserTie className="text-xl text-white" />
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;