import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/firebase";
import CartBook from "../components/CartBook";
import { toast } from "react-toastify";

function Cart() {
  const firebase = useFirebase();
  const user = firebase.getCurrentUser();
  const [cartBooks, setCartBooks] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [add, setAdd] = useState([]);
  const [total, setTotal] = useState(0);
  const [addingAddress, setAddingAddress] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showExistingAddress, setShowExistingAddress] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    await firebase.addAddress(user.uid, address, name, phoneno);
    toast.success("Address added!", { autoClose: 5000, position: "top-right" });

    setShowAddAddress(false);
    setName("");
    setAddress("");
    setPhoneno("");

    const snapshot = await firebase.getAddresses();
    const addressList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAdd(addressList);
    setAddingAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address first.");
      return;
    }
    try {
      for (const doc of cartBooks) {
        const bookId = doc.id;
        const address = selectedAddress;
        await firebase.placeOrder(bookId, address);
      }
      await firebase.deleteFromCart(user.uid);
      setCartBooks([]);
      setSelectedAddress(null);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Not able to place order");
    }
  };

  const handleDelete = async (addrId) => {
    setDeletingId(addrId);

    try {
      await firebase.deleteAddress(user.uid, addrId);
      toast.success("Address deleted");

      const refreshed = await firebase.getAddresses();
      const addressList = refreshed.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdd(addressList);

      // Deselect the deleted address if it was selected
      if (selectedAddress?.id === addrId) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
        if (!firebase.isLoggedIn || !firebase.getCurrentUser()) return;

    firebase.getAddresses().then((snapshot) => {
      const addressList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdd(addressList);
    });

    firebase.getCart().then((books) => {
      setCartBooks(books.docs);
      const totalAmount = books.docs.reduce((acc, doc) => {
        const book = doc.data();
        return acc + (parseFloat(book.price) || 0);
      }, 0);
      setTotal(totalAmount);
    });
  }, [firebase]);

  if (firebase.loading) return <p> Loading...</p>;

  return (
    <div className="px-6 mt-10 mb-20">
      {cartBooks.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-medium mt-10">
          Your cart is empty 🛒
        </div>
      ) : (
        <>
          <div className="ml-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartBooks.map((book) => (
              <CartBook
                key={book.id}
                {...book.data()}
                onDelete={() =>
                  setCartBooks((prev) =>
                    prev.filter((item) => item.id !== book.id)
                  )
                }
              />
            ))}
          </div>

          {/* Address Buttons */}
          <div className="flex justify-center mt-10 space-x-4">
            <button
              className=" cursor-pointer bg-amber-500 text-white px-6 py-2 rounded-xl hover:bg-amber-600"
              onClick={() => setShowAddAddress(true)}
            >
              Add Address
            </button>
            <button
              className="bg-violet-500 text-white px-6 py-2 rounded-xl hover:bg-violet-600 cursor-pointer"
              onClick={() => setShowExistingAddress(true)}
            >
              Use Existing Address
            </button>
          </div>
        </>
      )}

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
          <div className="bg-purple-50 rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneno}
                onChange={(e) => setPhoneno(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <textarea
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="text-gray-600 hover:underline"
                  onClick={() => setShowAddAddress(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  disabled={addingAddress == true}
                >
                  {addingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Address Modal */}
      {showExistingAddress && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 ">
          <div className="bg-purple-50 rounded-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Select an Existing Address
            </h2>

            <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
              {add.length === 0 ? (
                <div className="text-gray-500 text-center py-10">
                  No addresses available.
                </div>
              ) : (
                add.map((addr, index) => (
                  <div
                    key={index}
                    className={`border p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                      selectedAddress?.id === addr.id
                        ? "border-violet-500 bg-violet-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1"
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowExistingAddress(false);
                        }}
                      >
                        <div className="font-semibold">{addr.name}</div>
                        <div>{addr.address}</div>
                        <div>{addr.phoneno}</div>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          handleDelete(addr.id);
                        }}
                        className="cursor-pointer bg-red-700 p-1 rounded text-white ml-4"
                        title="Delete Address"
                        disabled={deletingId === addr.id}
                      >
                        {deletingId === addr.id ? "Deleting..." : "🗑️"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowExistingAddress(false)}
                className="text-gray-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedAddress && (
        <div className="mt-4 border-t pt-4 text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Selected Address:</h3>
          <div>{selectedAddress.name}</div>
          <div>{selectedAddress.address}</div>
          <div>{selectedAddress.phoneno}</div>
        </div>
      )}
      {cartBooks.length > 0 && (
        <div className="mt-10 border-t pt-6 text-right">
          <div className="text-xl font-bold text-green-700 mb-4">
            Total Amount: ₹{total}
          </div>
          <button
            onClick={handlePlaceOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg w-full"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
