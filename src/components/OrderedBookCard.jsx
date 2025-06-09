import React from "react";

function OrderedBookCard({ name, price, desc, img }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md border transition">
      <img
        src={img}
        alt={name}
        className="w-20 h-28 object-cover rounded-md border"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {desc}
        </p>
        <div className="mt-2 text-green-700 font-bold">₹{price}</div>
      </div>
    </div>
  );
}

export default OrderedBookCard;
