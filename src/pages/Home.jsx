import React, { useEffect, useRef, useState } from "react";
import bgImage from "../assets/bg.png";
import { useFirebase } from "../context/firebase";
import { NavLink, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { FaLinkedin, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

function Home() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const user=firebase.getCurrentUser();

  const divRef=useRef();

  const handleScroll=()=>{
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    firebase.getFiveBooks().then((books) => setBooks(books.docs));
  }, [firebase]);

  return (
    <div className="font-sans scroll-smooth ">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={bgImage}
          alt="background"
          className="w-full h-[100vh] object-cover opacity-80"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-600 mb-4 drop-shadow-lg">
            Start Swapping Books Today! 📖
          </h2>
          <p className="text-violet-400 text-lg md:text-xl mb-6 drop-shadow">
            Why let your books gather dust when someone else can enjoy them?
          </p>
          {user ? <button className="cursor-pointer bg-purple-600 text-white font-bold px-8 py-3 rounded-full hover:bg-amber-600 transition" onClick={handleScroll}>Explore Top Picks</button>
          :(<NavLink to="/signup">
          <button className="cursor-pointer bg-purple-600 text-white font-bold px-8 py-3 rounded-full hover:bg-amber-600 transition">
            Get Started
          </button>
          </NavLink>)}
        </div>
      </div>

      {/* Buy & Sell Section */}
      <div className="bg-white py-20 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-purple-600 p-10 rounded-3xl shadow-xl text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Buy Books</h2>
            <p className="mb-6">
              Grab amazing books at the lowest prices, from students like you!
            </p>
            <NavLink to="/buy">
            <button className="cursor-pointer bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-300">
              Browse Books
            </button>
            </NavLink>
          </div>
          <div className="  bg-yellow-400 p-10 rounded-3xl shadow-xl text-black text-center">
            <h2 className="text-3xl font-bold mb-4">Sell Books</h2>
            <p className="mb-6">
              Declutter your shelf and earn cash for your old books easily.
            </p>
            <button
              onClick={() => {
                if (firebase.isLoggedIn) {
                  navigate("/sell");
                } else {
                  navigate("/signup");
                }
              }}
              className="cursor-pointer bg-purple-700 text-white font-semibold px-6 py-2 rounded-full hover:bg-purple-600"
            >
              Sell Now
            </button>
          </div>
        </div>
      </div>

      <div ref={divRef} className="py-10 px-6 md:px-20 bg-[#f9f4dc]">
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-12">
          Top Picks for You
        </h2>
        <div className="grid md:grid-cols-5 gap-6 text-center">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => navigate(`/bookPage/${book.id}`)}
              className="cursor-pointer"
            >
              <BookCard {...book.data()}></BookCard>
            </button>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/buy"
            className="inline-block bg-purple-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-purple-600 transition"
          >
            Browse All Books
          </a>
        </div>
      </div>

      {/* How to Buy Section */}
      <div className="py-16 px-6 md:px-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-12">
          How to Buy Books
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Browse Listings",
              desc: "Explore available books posted by fellow students.",
              emoji: "📚",
            },
            {
              title: "Mail & Confirm",
              desc: "Mail sellers and finalize the deal.",
              emoji: "💬",
            },
            {
              title: "Receive Books",
              desc: "Get the book delivered.",
              emoji: "📦",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-[#f1eaff] p-8 rounded-xl shadow-md hover:scale-105 transition"
            >
              <div className="text-5xl mb-4">{step.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-700">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Sell Section */}
      <div className="py-16 px-6 md:px-20 bg-[#fff9e6]">
        <h2 className="text-4xl font-bold text-center text-yellow-600 mb-12">
          How to Sell Books
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "List Your Book",
              desc: "Post details and condition of the book.",
              emoji: "📝",
            },
            {
              title: "Set a Price",
              desc: "Decide how much you want to earn.",
              emoji: "💰",
            },
            {
              title: "Get Paid",
              desc: "Once sold, get money directly to your account.",
              emoji: "🏦",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-[#fff2d8] p-8 rounded-xl shadow-md hover:scale-105 transition"
            >
              <div className="text-5xl mb-4">{step.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-800">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">📚 BookSwap</h3>
            <p className="text-sm">
              Where books find new homes and stories never end.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-yellow-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/buy" className="hover:text-yellow-300">
                  Buy Books
                </a>
              </li>
              <li>
                <a href="/sell" className="hover:text-yellow-300">
                  Sell Books
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-3 text-xl">
              <a
                href="www.linkedin.com/in/shreyanshi-srivastava-774280295"
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-300"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/Shreyanshi210205"
                target="_blank"
                rel="noreferrer"
                className="hover:text-yellow-300"
              >
                <FaGithub />
              </a>
              
            </div>
            <p className="text-sm">shreya.nshi2102@gmail.com</p>
          </div>
        </div>
        <div className="border-t border-purple-700 mt-10 pt-4 text-center text-sm text-purple-300">
          &copy; {new Date().getFullYear()} BookSwap. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
