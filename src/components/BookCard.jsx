import React from "react";

const BookCard = (props) => {
  
  return (
    <div className="h-[385px]  max-w-xs mb-10 sm:max-w-3xs bg-white shadow-xl rounded-xl overflow-hidden">
      <img
        src={props.img}
        alt={props.name}
        className="w-full h-65 object-fill p-3"
      />
      <div className=" sm:pb-2 p-4">
        <h3 className="text-center text-lg sm:text-sm font-bold  text-gray-800 truncate">
          {props.name}
        </h3>
        <p className="text-gray-600 text-sm h-[40px] mt-1 line-clamp-2">{props.desc}</p>
        <p className="text-white font-bold text-xl mt-2 text-center bg-amber-600  rounded-sm">₹{props.price}</p>
      </div>
    </div>
  );
};

export default BookCard;
