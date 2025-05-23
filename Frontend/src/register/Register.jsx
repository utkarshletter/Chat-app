import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Register = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };
  console.log(userInput);
  const selectGender=(selectedGender)=>{
    setUserInput((prev)=>({
        ...prev,gender:selectedGender===userInput.gender?'':selectedGender
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(userInput.password!=userInput.confpassword){
        setLoading(false);
        return toast.error("Password doesn't match")
    }
    try {
        const { confpassword, ...userDataToSend } = userInput;
      const reg = await axios.post('/api/auth/register', userInput);
      const data = reg.data;
      if (data.success === false) {
        toast.error(data.message || 'Registration failed');
        setLoading(false);
        return;
      }
      toast.success(data.message || 'Registered successfully!');
      localStorage.setItem('chat-app', JSON.stringify(data));
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Register <span className="text-gray-950">Chatters</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black mt-6 space-y-4">
        <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Fullname:</span>
            </label>
            <input
              id="fullname"
              type="text"
              onChange={handleInput}
              placeholder="Enter fullname"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Username:</span>
            </label>
            <input
              id="username"
              type="text"
              onChange={handleInput}
              placeholder="Enter Username"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
            
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Email:</span>
            </label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Enter email"
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
              placeholder="Enter password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">Confirm Password:</span>
            </label>
            <input
              id="confpassword"
              type="text"
              onChange={handleInput}
              placeholder="Confirm password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div id='gender' className='flex gap-2'>
            <label className='cursor-pointer label flex gap-2'>
                <span className="label-text font-semibold text-gray-950">Male</span>
                <input onChange={()=>selectGender('male')}
                checked={userInput.gender==='male'}
                type='checkbox' className='checkbox checkbox-info'>
                </input>
            </label>
          
            <label className='cursor-pointer label flex gap-2'>
                <span className="label-text font-semibold text-gray-950">Female</span>
                <input onChange={()=>selectGender('female')}
                checked={userInput.gender==='female'}
                type='checkbox' className='checkbox checkbox-info'>
                </input>
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Already have an account?{' '}
            <Link to="/login">
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Log In
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
