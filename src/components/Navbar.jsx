import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoImg from "../assets/logo.png";
import cartImg from "../assets/cart.png";
import { useFirebase } from "../context/firebase";

export default function NavBar() {
  const firebase = useFirebase();
  const [menuOpen, setMenuOpen] = useState(false);

  const user=firebase.getCurrentUser()

  return (
    <nav className="fixed top-0 left-0 w-full bg-violet-500 text-white shadow-md z-50">
  <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
    
    {/* Logo + Title */}
    <div className="flex items-center space-x-3 min-w-0">
      <img src={logoImg} alt="logo" className="h-8 w-8 sm:h-10 sm:w-10" />
      <span className="text-lg sm:text-xl font-bold truncate">BookSwap</span>
    </div>

    {/* Hamburger button (mobile only) */}
    <button
      className="md:hidden text-white text-2xl focus:outline-none"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
    >
      {menuOpen ? "×" : "☰"}
    </button>

    {/* Desktop Menu */}
    <div className="hidden md:flex md:items-center md:space-x-6 font-medium">
      <NavLink to="/" className="hover:bg-amber-600 rounded-xl px-3 py-2">Home</NavLink>
      <NavLink to="/buy" className="hover:bg-amber-600 rounded-xl px-3 py-2">Buy Books</NavLink>
      <NavLink to="/sell" className="hover:bg-amber-600 rounded-xl px-3 py-2">Sell Books</NavLink>

      <NavLink to="/dashboard/cart">
        <img src={cartImg} alt="cart" className="h-6 w-6 ml-2" />
      </NavLink>

      {firebase.isLoggedIn ? (
        <NavLink to="/dashboard" className="bg-amber-600 rounded-xl px-4 py-2">Dashboard</NavLink>
      ) : (
        <>
          <NavLink to="/login" className="px-3 py-2">Login</NavLink>
          <NavLink to="/signup" className="bg-amber-500 rounded-xl px-4 py-2">Sign Up</NavLink>
        </>
      )}
    </div>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden bg-violet-200 text-purple-700 font-medium px-4 py-4 space-y-4">
      <NavLink to="/" className="block px-3 py-2 rounded-xl hover:bg-amber-600" onClick={() => setMenuOpen(false)}>Home</NavLink>
      <NavLink to="/buy" className="block px-3 py-2 rounded-xl hover:bg-amber-600" onClick={() => setMenuOpen(false)}>Buy Books</NavLink>
      <NavLink to="/sell" className="block px-3 py-2 rounded-xl hover:bg-amber-600" onClick={() => setMenuOpen(false)}>Sell Books</NavLink>

      <div className="flex items-center space-x-4 pt-2 border-t border-violet-500">
        {user ? (
          <NavLink to="/dashboard/cart" onClick={() => setMenuOpen(false)}>
            <img src={cartImg} alt="cart" className="h-6 w-6" />
          </NavLink>
        ) : (
          <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
            <img src={cartImg} alt="cart" className="h-6 w-6" />
          </NavLink>
        )}

        {firebase.isLoggedIn ? (
          <NavLink to="/dashboard" className="bg-amber-600 text-black rounded-xl px-4 py-2 flex-grow text-center" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
        ) : (
          <>
            <NavLink to="/login" className="block px-3 py-2 flex-grow text-center" onClick={() => setMenuOpen(false)}>Login</NavLink>
            <NavLink to="/signup" className="bg-amber-500 rounded-xl px-4 py-2 block flex-grow text-center" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
          </>
        )}
      </div>
    </div>
  )}
</nav>

  );
}
