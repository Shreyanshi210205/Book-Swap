import { useEffect, useState } from 'react';
import React from 'react';
import { useFirebase } from '../context/firebase';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter';
import bgImage from "../assets/bgimg.png";

function BuyBooks() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ genres: [], priceRange: [0, 1000] });
  const [showSidebar, setShowSidebar] = useState(false); 
  const [searchTerm,setSearchTerm]=useState("")

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredBooks = books.filter(book => {
    const data = book.data();
    const matchesGenre = filters.genres.length === 0 || filters.genres.includes(data.genre);
    const matchesPrice = Number(data.price) <= filters.priceRange[1];
    const matchesSearch=(data.name.toLowerCase().includes(searchTerm.toLowerCase())||
      data.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesGenre && matchesPrice&& matchesSearch;
  });

  useEffect(() => {
    setLoading(true);
    firebase.getBuyingBooks().then((books) => {
      setBooks(books.docs);
      setLoading(false);
    });
  }, [firebase]);

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 relative">
      <img src={bgImage} alt="bg-image" className='w-full h-[100vh] object-fill opacity-25 fixed pointer-events-none' />

       <div className="mb-4">
  <input
    type="text"
    placeholder="Search by title,genre..."
    value={searchTerm}
    onChange={(e) => {
  console.log("Input changed:", e.target.value);
  setSearchTerm(e.target.value);
}}

   className="relative w-full lg:w-1/2 p-2 border rounded shadow bg-white text-black  mt-10"
  />
</div>

      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowSidebar(true)}
          className="bg-amber-600 text-white px-4 py-2 rounded shadow mt-3 relative"
        >
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Sidebar - responsive drawer */}
        {/* Mobile sidebar */}
        {showSidebar && (
          <div className="fixed inset-0 bg-opacity-40 z-40 lg:hidden" onClick={() => setShowSidebar(false)}>
            <div
              className="absolute top-0 left-0 w-64 h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}
       

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64">
          <SidebarFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Books Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="text-center text-gray-600 text-lg col-span-full">
              Loading books...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center text-gray-600 text-lg col-span-full">
              No books found matching filters.
            </div>
          ) : (
            filteredBooks.map((book) => (
              <button
                onClick={() => navigate(`/bookPage/${book.id}`)}
                key={book.id}
                className="cursor-pointer"
              >
                <BookCard {...book.data()} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyBooks;
