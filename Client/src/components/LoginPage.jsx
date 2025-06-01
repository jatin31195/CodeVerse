import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';
const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setIsLoading(true);

  try {
    const res = await apiRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status >= 200 && res.status < 300) {
      toast.success('Login successful!');
      navigate('/home');
    } else {
      toast.error(res.data.message || 'Authentication failed');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Something went wrong');
  } finally {
    setIsLoading(false);
  }
};

 const handleGoogleSignIn = async (credentialResponse) => {
  setIsLoading(true);
  try {
    const { credential } = credentialResponse;
    if (!credential) throw new Error('No ID token returned');

    let res;
    // Try logging in first
    try {
      res = await apiRequest(`${BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { idToken: credential },
      });
    } catch (err) {
      // If login returns 404, attempt signup
      if (err.response?.status === 404) {
        res = await apiRequest(`${BASE_URL}/api/auth/google-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { idToken: credential },
        });
      } else {
        throw err;
      }
    }

    // If we reach here, status was 2xx on login or signup
    toast.success(res.data.message);
    navigate('/home');
  } catch (err) {
    console.error('Google sign-in error:', err);
    toast.error('Something went wrong during Google sign-in');
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/org_codeverse.png" alt="CodeVerse Logo" className="w-16 h-16" />
          <span className="font-bold text-xl">CodeVerse</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/signup" 
            className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95 text-sm"
          >
            Create account
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full bg-white bg-opacity-70 backdrop-blur-lg border border-white/30 shadow-xl shadow-gray-200/50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="h-11 px-4 py-2 rounded-lg border-2 border-gray-200 w-full transition-all duration-300 outline-none focus:border-[#33C3F0] focus:ring-2 focus:ring-[#33C3F0]/20"
                autoComplete="email"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-11 px-4 py-2 rounded-lg border-2 border-gray-200 w-full transition-all duration-300 outline-none focus:border-[#33C3F0] focus:ring-2 focus:ring-[#33C3F0]/20"
                autoComplete="current-password"
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-[#33C3F0] hover:text-[#A374FF] transition-colors">
                Forgot password?
              </Link>
            </div>
            <motion.button
              type="submit"
              className="w-full px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>
          <div className="mt-6">
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full bg-white rounded-lg shadow border"
  >
    <GoogleLogin
      onSuccess={handleGoogleSignIn}
      onError={() => toast.error("Google sign-in failed")}
      theme="outline"
      shape="pill"
      width="100%"
      text="continue_with"
    />
  </motion.div>
</div>


          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#33C3F0] hover:text-[#A374FF] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
