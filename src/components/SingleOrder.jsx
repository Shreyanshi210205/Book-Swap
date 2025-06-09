import React, { useEffect, useState } from "react";
import OrderedBookCard from "./OrderedBookCard"; // Assuming this is your book card component
import { useFirebase } from "../context/firebase";

function SingleOrder(props) {
  const firebase = useFirebase();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const docSnap = await firebase.getBookById(props.bookId);
        if (docSnap.exists()) {
          setBook({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };

    fetchBook();
  }, [props.bookId, firebase]);

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="mb-4">
        <div className="text-sm text-gray-500 font-medium">
          Ordered on:{" "}
          {props.addedAt?.seconds
            ? new Date(props.addedAt.seconds * 1000).toLocaleString()
            : "Unknown"}
        </div>
        <div className="mt-2 text-gray-700">
          <strong>Delivered to:</strong>
          <div className="ml-2 mt-1">
            <div className="font-semibold">{props.buyerAddress?.name}</div>
            <div>{props.buyerAddress?.address}</div>
            <div>📞 {props.buyerAddress?.phoneno}</div>
          </div>
        </div>
      </div>

      {book ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          <OrderedBookCard {...book} />
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Loading book details...</div>
      )}
    </div>
  );
}


export default SingleOrder;
