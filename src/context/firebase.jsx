/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import {initializeApp} from 'firebase/app'
import {getAuth,createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup,
    onAuthStateChanged,
    fetchSignInMethodsForEmail,
signOut} from 'firebase/auth'
import {orderBy,getFirestore,collection,addDoc,getDocs,doc, getDoc, query,where, limit,serverTimestamp, setDoc,deleteDoc} from 'firebase/firestore'


const FirebaseContext=createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyBiD_SkudiqwRgIxSm-GIA0Q_-EayYONJk",
  authDomain: "book-shelf-895cb.firebaseapp.com",
  projectId: "book-shelf-895cb",
  storageBucket: "book-shelf-895cb.firebasestorage.app",
  messagingSenderId: "120302869365",
  appId: "1:120302869365:web:240fa156f12323118f913c"
};

export const useFirebase=()=>useContext(FirebaseContext)

const firebaseApp=initializeApp(firebaseConfig);
const firebaseAuth=getAuth(firebaseApp);
const googleProvider=new GoogleAuthProvider()
const firestore=getFirestore(firebaseApp);

export const FirebaseProvider=(props)=>{
    const [user,setUser]=useState(null)
   const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    setUser(user);
    setLoading(false); // Firebase has finished checking auth state
  });

  return () => unsubscribe(); // Clean up listener on unmount
}, []);

const checkAuth=async(email)=>{
    const methods=await fetchSignInMethodsForEmail(firebaseAuth,email);
    return methods.length;
}
const signupWithEmailAndPassword=(email,password)=>{
  return createUserWithEmailAndPassword(firebaseAuth,email,password)
}
const signinUserWithEmailAndPassword=(email,password)=>{
    return signInWithEmailAndPassword(firebaseAuth,email,password)
}
const signinWithGoogle=()=>{
    return signInWithPopup(firebaseAuth,googleProvider)
}
console.log(user)
const logout=()=>{
    return signOut(firebaseAuth)
}
const addBook=async(name,isbn,price,desc,genre,img)=>{
    return await addDoc(collection(firestore,'books'),{
        name,
        isbn,
        price,
        desc,
        genre,
        img,
        userID:user.uid,
        userEmail:user.email,
        displayName:user.displayName,
        photoURL:user.photoURL,
    })
}
const addToCart=async(bookId,bookData)=>{
    const docRef=doc(firestore,'carts',user.uid,'items',bookId);
    await setDoc(docRef,{
        bookId,
        ...bookData,
        addedAt:serverTimestamp()
    })
}
const placeOrder=async(bookId,buyerAddress)=>{
    const order={
        bookId,
        buyerId:user.uid,
        buyerEmail:user.email,
        buyerAddress:buyerAddress,
        buyerDisplayName:user.displayName,
        buyerPhoto:user.photoURL,
        addedAt:serverTimestamp()
    }

    const buyerOrderRef=collection(firestore,'users',user.uid,'orders')
    await addDoc(buyerOrderRef,order)

    const sellerOrderRef=collection(firestore,'books',bookId,'orders')
    await addDoc(sellerOrderRef,order)
}
const addAddress=async(userId,address,name,phoneno)=>{
    const colRef=collection(firestore,'userAdd',userId,'address')
    const result=await addDoc(colRef,{
        username:user.displayName,
        userID:user.uid,
        userEmail:user.email,
        displayName:user.displayName,
        name,
        address,
        phoneno,
    })
}
const getCurrentUser=()=>{
    if(user)
    return user;
    else return null;
}
const getBuyingBooks=()=>{
    if(user){
    const docsRef=collection(firestore,'books');
    const q=query(docsRef,where("userEmail","!=",user.email))
    return getDocs(q);}
    else {
        return getDocs(collection(firestore, "books"));
    }
}
const getBookById=async(id)=>{//pass book id and get its details
    const docRef=doc(firestore,'books',id);
    const result=await getDoc(docRef)
    return result
}
const getSellingBooks=()=>{
    const docsRef=collection(firestore,'books');
    const q=query(docsRef,where("userEmail","==",user.email))
    return getDocs(q);
}
const getFiveBooks=()=>{
    if(!user){
    const docsRef=collection(firestore,'books');
    const q=query(docsRef,limit(5));
    return getDocs(q);}
    else{
        const docsRef=collection(firestore,'books');
    const q=query(docsRef,where("userEmail","!=",user.email),limit(5));
    return getDocs(q);
    }
}
const getCart=async()=>{
  if (!user) throw new Error("User not logged in");
    const cartRef=collection(firestore,'carts',user.uid,'items')
    return getDocs(cartRef)
}
const getAddresses=async()=>{
    if (!user) throw new Error("User not logged in");
    const addRef=collection(firestore,'userAdd',user.uid,'address')
    return getDocs(addRef)
}
const getOrdersBuyer=async()=>{
    const orderRef=collection(firestore,'users',user.uid,'orders')
    const q = query(orderRef, orderBy("addedAt", "desc"));
    return await getDocs(q)
}
const getOrdersSeller=async(bookId)=>{
    const orderRef=collection(firestore,'books',bookId,'orders')
    const snapshot = await getDocs(orderRef);
    if(!snapshot.empty)
        return snapshot
    else return null
}

const deleteAddress=async(userId,addressId)=>{
    const addressRef = doc(firestore, 'userAdd', userId, 'address', addressId);
  await deleteDoc(addressRef);
}
const deleteFromCart = async (userId) => {
  const cartCollectionRef = collection(firestore, 'carts', userId, 'items');
  const snapshot = await getDocs(cartCollectionRef);

  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};
const deleteSingleFromCart = async (bookId) => {
  console.log("User:", user);
  console.log("Book ID:", bookId);

  if (!user || !user.uid || !bookId) {
    throw new Error("Missing user or bookId");
  }

  const cartRef = doc(firestore, 'carts', user.uid, 'items', bookId);
  await deleteDoc(cartRef);
};


const isLoggedIn=user?true:false;

    return(
        <FirebaseContext.Provider 
        value={{signupWithEmailAndPassword,
                signinUserWithEmailAndPassword,
                signinWithGoogle,
                isLoggedIn,
                logout,
                addBook,
                getBuyingBooks,
                getCurrentUser,
                getBookById,
                getSellingBooks,
                getFiveBooks,
                checkAuth,
                addToCart,
                placeOrder,
                user,
                getCart,
                addAddress,
                getAddresses,
                deleteAddress,
                loading,
                deleteFromCart,
                getOrdersBuyer,
                getOrdersSeller,
                deleteSingleFromCart}}>
            {props.children}
        </FirebaseContext.Provider>
    )
}
