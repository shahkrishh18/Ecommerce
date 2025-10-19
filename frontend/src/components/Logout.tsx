import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <button className="flex items-center gap-2 bg-white text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm border hover:bg-gray-50 transition" onClick={handleLogout}>
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )
}

export default Logout
