import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import SingleOrder from '../components/SingleOrder';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const snapshot = await firebase.getOrdersBuyer();
        setOrders(snapshot.docs);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [firebase]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-purple-700">My Orders</h2>

      {loading && <p className="text-gray-500">Loading your orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500 text-lg font-medium mt-10">
          No orders placed yet 🛒
        </p>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const data = order.data();
            return (
              <button
                onClick={() => navigate(`/bookPage/${data.bookId}`)}
                key={order.id}
                className="w-full text-left"
              >
                <SingleOrder {...data} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
