import React from "react";
import { Trash2 } from "lucide-react";
import { useFirebase } from "../context/firebase";
import { toast } from "react-toastify";

const CartBook = (props) => {
  const firebase = useFirebase();

  const handleDelete = async (bookId) => {
    try {
      await firebase.deleteSingleFromCart(bookId);
      toast.success("Removed from cart")
          props.onDelete?.(); // <- trigger local UI update

    } catch(err) {
      console.error(err)
      toast.error("Failed to remove from cart");
    }
  };
  return (
    <div className="flex items-start gap-4 p-4 border rounded-2xl shadow-sm bg-white">
      <img
        src={props.img}
        alt={props.name}
        className="w-20 h-28 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{props.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{props.desc}</p>
        <div className="mt-2 text-base font-bold text-green-600">
          ₹{props.price}
        </div>
      </div>
      <button className="text-gray-400 hover:text-red-500 transition"
      onClick={async (e) => {
            e.stopPropagation();
            handleDelete(props.bookId);
          }}>
        <Trash2
          
          className="w-5 h-5"
        />
      </button>
    </div>
  );
};

export default CartBook;
