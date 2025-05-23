import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate=useNavigate();
    const [userInput, setuserInput]=useState({});
    const [loading, setLoading]=useState(false);
    const handleInput=(e)=>{
        setuserInput({
            ...userInput,[e.target.id]:e.target.value
        })
    }
    console.log(userInput);
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
          const login = await axios.post('/api/auth/login', userInput);
          const data = login.data;
      
          if (data.success === false) {
            setLoading(false);
            toast.error(data.message || "Login failed");
            return; // Stop further execution
          }
      
          toast.success(data.message || "Login successful!");
          localStorage.setItem('chat-app', JSON.stringify(data));
          setLoading(false);
          navigate('/');
        } catch (error) {
          setLoading(false);
          toast.error(error.response?.data?.message || "Something went wrong");
          console.error(error);
        }
      };
      
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login <span className="text-gray-950">Chatters</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black mt-6 space-y-4">
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Email:</span>
            </label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Enter your email"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Password:</span>
            </label>
            <input
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="Enter your password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            {loading ? "Loading...":"Log In"}
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an account?{' '}
            <Link to="/register">
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Register Now!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
