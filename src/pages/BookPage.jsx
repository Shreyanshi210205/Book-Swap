import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import { useNavigate, useParams } from "react-router-dom";
import InlineZoom from "../components/InlineZoom";
import bgImage from "../assets/bgimg.png";
import { toast } from "react-toastify";

function BookPage() {
  const params = useParams();
  const firebase = useFirebase();
  const navigate=useNavigate()

  const user=firebase.getCurrentUser()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartBooks, setCartBooks] = useState([]);
  const [isOrdered,setIsOrdered]=useState(false);


  const cartBookIds = cartBooks.map((book) => book.id);

  useEffect(() => {
    setLoading(true);
    if (firebase.user) {
      firebase.getCart().then((cart) => setCartBooks(cart.docs));
    }
    firebase.getBookById(params.bookId).then((value) => {
      setData(value.data());
      setLoading(false);
    });
    firebase.getOrdersSeller(params.bookId).then((order)=>{
      if(order!=null) setIsOrdered(true)
    })
  }, [firebase, params]);

  const handleCart = async (e) => {
    e.preventDefault();
    if(!user) navigate('/signup');
    try {
      await firebase.addToCart(params.bookId, data);
      setCartBooks((prev) => [...prev, params.bookId]);
      toast.success("Added to cart!", {
        autoClose: 5000,
        position: "bottom-right",
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("You are not logged in");
    }
  };

  if (loading) {
    return (
      <div className="text-center pt-16 font-semibold m-auto">Loading...</div>
    );
  }

  return (
    <div className="relative pt-16 px-6 sm:px-10 md:px-20 max-w-7xl mx-auto mt-12">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
      />

      {/* Content */}
      <div className="relative z-10 bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/2 p-6 flex justify-center items-center">
          <div className="w-full max-w-xs">
            <InlineZoom src={data.img} alt={data.name} />
          </div>
        </div>

        {/* Book Info */}
        <div className="md:w-1/2 p-6 space-y-4">
          <h2 className="text-3xl font-bold text-purple-700">{data.name}</h2>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">ISBN:</span> {data.isbn}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Genre:</span> {data.genre}
          </p>
          <p className="text-gray-700 mt-4 whitespace-pre-line">{data.desc}</p>
          <p className="text-xl text-purple-700 font-bold mt-4">
            ₹{data.price}
          </p>
          <button
            onClick={handleCart}
            disabled={cartBookIds.includes(params.bookId)}
            className={`mt-4 py-2 px-6 rounded-md transition ${
              isOrdered?"bg-red-300 cursor-not-allowed":
              (cartBookIds.includes(params.bookId)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white")
            }`}
          >
            {isOrdered?"Sold Out!!":(cartBookIds.includes(params.bookId)
              ? "Added to Cart"
              : "Add to Cart")}
          </button>

          <p className="text-sm text-gray-500 mt-6">
            For more information, you can contact:{" "}
            <a
              href={`mailto:${data.userEmail}`}
              className="text-purple-700 underline hover:text-purple-900 transition"
            >
              {data.userEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookPage;
