import { useEffect, useState } from 'react'
import React from 'react'
import { useFirebase } from '../context/firebase'
import BookCard from '../components/BookCard';
import { NavLink } from 'react-router-dom';


function YourBooks() {
     const firebase=useFirebase();
    const [books,setBooks]=useState([])

    useEffect(()=>{
        firebase.getSellingBooks().then((books)=>setBooks(books.docs))
    },[firebase])

  return (
    <div className="ml-5 mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
       { books.map(book =>( <BookCard key={book.id} {...book.data()}></BookCard>))}
    </div>
  )
}

export default YourBooks