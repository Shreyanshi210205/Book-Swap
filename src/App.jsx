import { Outlet, Route,Routes } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register'
import Login from './pages/Login'
import NavBar from "./components/Navbar"
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SellBooks from './pages/SellBooks'
import BuyBooks from './pages/BuyBooks'
import BookPage from './pages/BookPage'
import YourBooks from './pages/YourBooks'
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import MyBookOrders from './pages/MyBookOrders';

function App() {

  return (
    <>
    <NavBar/>
    <Outlet></Outlet>
    <ToastContainer></ToastContainer>
    <Routes>
      <Route path='/'element={<Home></Home>}></Route>
      <Route path='/signup' element={<Register></Register>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>

      <Route path='/dashboard' element={<Dashboard></Dashboard>}>
      <Route path='/dashboard/your-books' element={<YourBooks></YourBooks>}></Route>
      <Route path='/dashboard/my-orders' element={<MyOrders></MyOrders>}></Route>
      <Route path='/dashboard/cart' element={<Cart></Cart>}></Route>
      <Route path='/dashboard/my-book-orders' element={<MyBookOrders></MyBookOrders>}></Route>
      </Route>
      <Route path='/sell' element={<SellBooks></SellBooks>}> </Route>
      <Route path='/buy' element={<BuyBooks></BuyBooks>}> </Route>
      <Route path='/bookPage/:bookId' element={<BookPage></BookPage>}></Route>

    </Routes>
    </>
  )
}

export default App
