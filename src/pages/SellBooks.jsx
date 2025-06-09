import React, { useState } from "react";
import bgImage from "../assets/bg3.png";
import { useFirebase } from "../context/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function SellBooks() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [isbn, setISBN] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [genre,setGenre]=useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "unsigned_preset");

    try {
      const cloudName = "dsgcb4e9t";
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (!data.secure_url) throw new Error("Image upload failed");

      await firebase.addBook(name, isbn, price, desc,genre, data.secure_url);

      toast.success("Book uploaded!", { autoClose: 5000, position: "top-left" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Something went wrong!!");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Form container */}
      <div className="relative w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md p-6 sm:p-10 rounded-xl shadow-2xl mx-2 sm:mx-0">
        <h2 className="text-3xl font-bold mb-8 text-purple-700 text-center">
          Sell Your Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Grid for inputs: 1 column on mobile, 2 columns on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Book Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Book Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                name="name"
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter book title"
              />
            </div>

            {/* ISBN Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                ISBN Number
              </label>
              <input
                onChange={(e) => setISBN(e.target.value)}
                value={isbn}
                type="text"
                name="isbn"
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. 978-3-16-148410-0"
              />
            </div>

            <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              name="description"
              rows="5"
              required
              className="border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Give a brief description of the book...(3-4 lines)"
            ></textarea>
          </div>

          {/* Genre */}
<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">
    Genre
  </label>
  <select
    onChange={(e) => setGenre(e.target.value)}
    value={genre}
    name="genre"
    required
    className="border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
  >
    <option  value="">Select a genre</option>
    <option value="Academics">Academics</option>
    <option value="Novel">Novel</option>
    <option value="Comic">Comic</option>
    <option value="Magazine">Magazine</option>
  </select>
</div>


            {/* Price */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                name="price"
                required
                className="border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. 250"
              />
            </div>

            {/* Cover Photo */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Cover Photo
              </label>
              <input
                onChange={(e) => setImg(e.target.files[0])}
                type="file"
                name="cover"
                required
                accept="image/*"
                className="text-sm border border-gray-300 rounded-md p-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
            </div>
          </div>

          {/* Description textarea full width */}
          

          {/* Submit Button */}
          {loading ? (
            <div className="text-center text-purple-700 font-semibold">
              Uploading...
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition"
            >
              Submit Book
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default SellBooks;
