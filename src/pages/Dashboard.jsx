import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import { Outlet, useNavigate, useLocation} from 'react-router-dom';
import Sidebar from '../components/SideBar';
import { NavLink } from 'react-router-dom';

function Dashboard() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogout, setShowLogout] = useState(false);


  useEffect(() => {
    if (!firebase.isLoggedIn) {
      navigate('/');
    }
  }, [firebase, navigate]);

  if (firebase.loading) return <p>Loading...</p>;

  const isBaseDashboard = location.pathname === "/dashboard";

  const navLinks = [
    { label: "My Books", path: "/dashboard/your-books" },
    { label: "Books Ordered", path: "/dashboard/my-book-orders" },
    { label: "Cart", path: "/dashboard/cart" },
    { label: "Orders", path: "/dashboard/my-orders" }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-16 relative">

      {/* Sidebar for medium and up */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

{/* Mobile Sidebar Navigation */}
{!firebase.loading && (
  <div className="md:hidden flex flex-col bg-violet-100 p-4 shadow-sm sticky top-16 z-10">
    {/* User Profile */}
    <div className="flex flex-col items-center mb-4">
      <img
        src={firebase.user?.photoURL}
        alt="Profile"
        className="w-16 h-16 rounded-full border-2 border-white shadow"
      />
      <h2 className="mt-2 text-lg font-semibold text-gray-800">
        {firebase.user?.displayName || "Reader"}
      </h2>
      <p className="text-xs text-gray-600">Welcome back to BookSwap 📚</p>
    </div>

    {/* Navigation Links */}
    <div className="flex justify-around flex-wrap gap-2 mb-2">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `text-sm font-medium px-3 py-2 rounded-md ${
              isActive ? "bg-violet-500 text-white" : "bg-white text-violet-600"
            } shadow`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>

    {/* Logout Button */}
    <button
      onClick={() => setShowLogout(true)}
      className="self-center text-sm font-medium px-4 py-2 bg-red-700 text-white rounded-md shadow hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>
)}
{showLogout && (
  <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center px-4">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Are you sure you want to log out?</h2>
      <div className="flex justify-around mt-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
          onClick={async () => {
            await firebase.logout();
            navigate('/');
          }}
        >
          Yes
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
          onClick={() => setShowLogout(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}


      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6 md:p-10">
        {isBaseDashboard ? (
          <div className="bg-white rounded-3xl shadow-lg p-10 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700">
              Welcome back, {firebase.user?.displayName || "Reader"} 📚
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Explore your journey with <span className="font-semibold text-purple-600">BookSwap</span>. 
              Track your books, manage your cart, and keep swapping!
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
