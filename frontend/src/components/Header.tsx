import Logout from "./Logout";

const Header = () => {
  
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex flex-col">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
            QuickCommerce
          </h1>
          <h3 className="text-sm text-gray-600">
            Your one-stop solution for all e-commerce needs
          </h3>
        </div>

        {/* Logout Button */}
        {/* <button className="flex items-center gap-2 bg-white text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm border hover:bg-gray-50 transition" onClick={handleLogout}>
        <LogOut size={16} />
        Logout
      </button> */}
      <Logout />
      </div>
    </header>
  );
};

export default Header;