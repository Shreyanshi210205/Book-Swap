import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import BookCard from "../components/BookCard";

function MyBookOrders() {
  const firebase = useFirebase();
  const [booksWithOrders, setBooksWithOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksAndOrders = async () => {
      setLoading(true);
      const booksSnapshot = await firebase.getSellingBooks();
      const books = booksSnapshot.docs;

      const results = [];

      for (const doc of books) {
        const ordersSnapshot = await firebase.getOrdersSeller(doc.id);
        if (ordersSnapshot && !ordersSnapshot.empty) {
          results.push({
            id: doc.id,
            bookData: doc.data(),
            orders: ordersSnapshot.docs.map((order) => ({
              id: order.id,
              ...order.data(),
            })),
          });
        }
      }

      setBooksWithOrders(results);
      setLoading(false);
    };

    fetchBooksAndOrders();
  }, [firebase]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (booksWithOrders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        No orders placed for your books yet.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-purple-700">
        Orders for Your Books
      </h2>

      {booksWithOrders.map(({ id, bookData, orders }) => (
        <div
          key={id}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row border border-purple-200 rounded-xl bg-purple-50 shadow-sm p-4 gap-4"
        >
          {/* Book Card */}
          <div className="w-full sm:w-1/3 flex justify-center">
            <BookCard {...bookData} />
          </div>

          {/* Orders Info */}
          <div className="flex-1 text-sm text-gray-700">
            <h3 className="font-medium mb-2 text-purple-700">Orders:</h3>
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="p-3 bg-white border rounded-md shadow-sm">
                  <div><strong>Buyer:</strong> {order.buyerDisplayName}</div>
                  <div><strong>Email:</strong> {order.buyerEmail}</div>
                  <div><strong>Address:</strong> {order.buyerAddress?.address}</div>
                  <div><strong>Phone:</strong> {order.buyerAddress?.phoneno}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Ordered on: {new Date(order.addedAt?.seconds * 1000).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyBookOrders;
