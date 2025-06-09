import React, { useState } from "react";

const genresList = ["Academics", "Novel", "Comic", "Magazine"];

const SidebarFilter = ({ onFilterChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [price, setPrice] = useState(1000);

  const handleGenreChange = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updatedGenres);
    onFilterChange({ genres: updatedGenres, priceRange: [0, price] });
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value, 10);
    setPrice(newPrice);
    onFilterChange({ genres: selectedGenres, priceRange: [0, newPrice] });
  };
  const handleReset=(e)=>{
    const newGenre=[];
    const newPrice=10000;
    setSelectedGenres(newGenre);
    setPrice(newPrice)
    onFilterChange({genres:newGenre,priceRange:[0,newPrice]})
  }

  return (
    <div className="fixed w-64 p-4 border rounded shadow bg-white mt-10">
      <h3 className="font-bold mb-2">Filter by Genre</h3>
      {genresList.map(genre => (
        <div key={genre}>
          <input
            type="checkbox"
            id={genre}
            value={genre}
            onChange={() => handleGenreChange(genre)}
            checked={selectedGenres.includes(genre)}
          />
          <label htmlFor={genre} className="ml-2">{genre}</label>
        </div>
      ))}

      <h3 className="font-bold mt-4 mb-2">Max Price: ₹{price}</h3>
      <input
        type="range"
        min="0"
        max="1000"
        value={price}
        onChange={handlePriceChange}
        className="w-full"
      />
      <button className="bg-violet-500 p-2 rounded-sm text-white mt-2 ml-18" onClick={handleReset}>Reset</button>
    </div>
  );
};

export default SidebarFilter;
