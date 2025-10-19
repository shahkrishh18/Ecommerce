import { useNavigate } from "react-router-dom";
function AdminDashboard() {

    const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage users, orders, and other administrative tasks.</p>
    </div>
  )
}

export default AdminDashboard
