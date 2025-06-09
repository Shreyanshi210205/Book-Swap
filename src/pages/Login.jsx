import React, {  useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bgImage from '../assets/loginbg.png'
import googleImg from "../assets/google.png";


function Login() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(()=>{
    if(firebase.isLoggedIn) navigate('/')
  },[firebase,navigate])

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading]=useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const user = await firebase.signinUserWithEmailAndPassword(email, password);
    if (user) {
      toast.success("Logged in successfully!", {
        autoClose: 1000,
        position: "bottom-right",
      });
      navigate('/'); 
    } 
    // else {
    //   toast.error("Login failed.You are not signed up!");
    // }
  } catch (err) {
    console.error(err);
    toast.error("Invalid email or password", {
      autoClose: 2000,
      position: "bottom-right",
    });
  }
  setLoading(false);
};

  const handleGoogleLogin=async()=>{
    try {
      const user=await firebase.signinWithGoogle()
      if(user) {
        toast.success("Logged in successfully!", {
        autoClose: 1000,
        position: "bottom-right",
      });
      navigate('/'); 
      }
    } catch (err) {
      console.error(err);
    toast.error("Invalid email or password", {
      autoClose: 2000,
      position: "bottom-right",
    });
    }
    
  }


  return (
     <div
      className="relative min-h-screen flex items-center justify-center  ">
      <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{ backgroundImage: `url(${bgImage})` }}
  ></div>

  <div className="absolute inset-0 bg-white/20 z-10"></div>

    <div className="relative z-20 max-w-md w-full mx-auto mt-25 bg-white/65 backdrop-saturate-150 backdrop-blur-sm shadow-md rounded-lg p-8 pt-16 ">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {loading ? (
            <div className="text-center text-purple-700 font-semibold">
              Logging in...
            </div>
          ) : (<button
          type="submit"
          className="cursor-pointer w-full bg-violet-600 text-white font-semibold py-3 rounded-md hover:bg-violet-700 transition"
        >
          Login
        </button>
      )}
        
      </form>

      <div className="text-center my-6">
        <span className="text-gray-500 font-medium">OR</span>
      </div>

      <button
  onClick={handleGoogleLogin}
  className="flex items-center w-full bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
>
  {/* Left: Google logo box */}
  <div className="bg-white w-12 h-12 flex items-center justify-center rounded-l-md">
    <img src={googleImg} alt="Google logo" className="w-6 h-6" />
  </div>

  {/* Right: Button text */}
  <div className="flex-1 text-center pr-4">
    Continue with Google
  </div>
</button>

      <div className='mt-2 text-center'>
      <span>Not signed up?</span> <Link to="/signup"><button className='text-red-600 cursor-pointer font-bold'>SignUp now!</button></Link>
      </div>
    </div>
    </div>
  );
}

export default Login;
