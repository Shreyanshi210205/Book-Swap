import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const Sidebar = () => {
  const firebase = useFirebase();
  const currentUser = firebase.getCurrentUser();
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (!firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase.isLoggedIn, navigate]);

  return (
    <div className="fixed h-full w-64 bg-purple-100 flex flex-col px-6 py-8 shadow-lg pt-16">
     
      <div className="mb-10 text-center">
        <img
          src={currentUser?.photoURL}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow"
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          Hello, {currentUser?.displayName || "User"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Welcome back to <span className="font-semibold">Book Swap</span> 📚
          <br />
          Keep swapping!
        </p>
      </div>

      
      <nav className="flex-1 space-y-4">
        {[
          { label: "My Books", path: "/dashboard/your-books" },
          { label: "My Books Ordered", path: "/dashboard/my-book-orders" },
          { label: "My Cart", path: "/dashboard/cart" },
          { label: "My Orders", path: "/dashboard/my-orders" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-2 py-2 font-medium text-gray-700 hover:text-purple-700 relative ${
                isActive ? "border-b-2 border-purple-700" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      
      <button
        className="mt-5 mb-50 bg-red-700 p-1 rounded-md hover:text-white text-white cursor-pointer font-semibold"
        onClick={() => setShowLogout(true)}
      >
        Logout
      </button>
      {showLogout && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 ">
          <div className="flex flex-col bg-purple-200 rounded-lg w-full shadow-lg max-w-md p-10">
            <p className="mb-5 font-bold">Are you sure you want to log out?</p>
            <div className="flex flex-row justify-end text-white font-bold">
              <button
                className="bg-green-600 p-2 rounded-sm m-2 cursor-pointer"
                onClick={async () => {
                  await firebase.logout();
                  navigate("/");
                }}
              >
                YES
              </button>
              <button
                className="bg-red-700 p-2 rounded-sm m-2 cursor-pointer"
                onClick={() => setShowLogout(false)}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
