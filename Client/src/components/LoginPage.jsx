import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check,X  } from 'lucide-react';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
const [verificationCode, setVerificationCode] = useState('');
const [verificationLoading, setVerificationLoading] = useState(false);
const [verificationSuccess, setVerificationSuccess] = useState(false);
const [loginEmail, setLoginEmail] = useState('');
  useEffect(() => {
  if (showVerification && !loginEmail && formData.email) {
    setLoginEmail(formData.email);
  }
}, [showVerification, loginEmail, formData.email]);
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

    const data = res.data;

    if (res.status >= 200 && res.status < 300) {
      toast.success('Login successful!');
      navigate('/home');
    } else if (data.message === 'Email not verified. Please verify your email.') {
      const emailToVerify = data.email || formData.email;
      localStorage.setItem('userEmail', emailToVerify);
      setLoginEmail(emailToVerify);
      setShowVerification(true);
    } else {
      toast.error(data.message || 'Authentication failed');
    }
  } catch (error) {
    if (
      error.response &&
      error.response.data?.message === 'Email not verified. Please verify your email.'
    ) {
      const emailToVerify = error.response.data?.email || formData.email;
      localStorage.setItem('userEmail', emailToVerify);
      setLoginEmail(emailToVerify || formData.email); 
      setShowVerification(true);
    } else {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  } finally {
    setIsLoading(false);
  }
};

const handleVerificationComplete = async (code) => {
  setVerificationLoading(true);

  try {

    const response = await apiRequest(
      `${BASE_URL}/api/auth/verify-otp`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email: loginEmail, otp: code },
      }
    );

    if (response.status === 200) {
      // console.log("OTP verify response data:", response.data);
      setVerificationSuccess(true);
      setTimeout(() => {
        setShowVerification(false);
        toast.success('Email verified! You can now log in.');
      }, 1500);
    } else {
      console.warn("OTP verify failed:", response.status, response.data);
      toast.error(response.data.message || 'Invalid or expired OTP');
    }
  } catch (error) {
    
    console.error("HTTP or parsing error during OTP verify:", error);
    toast.error(error.response?.data?.message || 'Something went wrong');
  } finally {
    setVerificationLoading(false);
  }
};


const handleResendOTP = async () => {
  try {
    const res = await apiRequest(`${BASE_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: loginEmail }
    });
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to resend OTP");
  }
};

  const handleGoogleSignIn = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const { credential } = credentialResponse;
      if (!credential) throw new Error('No ID token returned');

      let res;
   
      try {
        res = await apiRequest(`${BASE_URL}/api/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { idToken: credential },
        });
      } catch (err) {
       
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
              <Link
                to="/forgot-password"
                className="text-sm text-[#33C3F0] hover:text-[#A374FF] transition-colors"
              >
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>

       
          <div className="mt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => toast.error('Google sign-in failed')}
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
              <Link
                to="/signup"
                className="text-[#33C3F0] hover:text-[#A374FF] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
            {showVerification && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
    <div className="bg-white rounded p-6 w-96 relative">
      
      <button
        className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full"
        onClick={() => setShowVerification(false)}
        aria-label="Close verification modal"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <h3 className="text-xl font-bold mb-4 text-center">Verify your email</h3>

      {verificationSuccess ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-700 font-medium">Verification successful!</p>
          <p className="text-gray-600">Your account has been created.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-4">
  We've sent a 6-digit verification code to your email.
  <br />
  <span className="text-orange-500 font-medium">
    Check your spam folder too (mark it as “Not Spam” to get future updates).
  </span>
  <br />
  Enter the code below to verify your account.
</p>

          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full h-11 px-4 py-2 rounded-lg border-2 border-gray-200 transition-all duration-300 outline-none focus:border-[#33C3F0] focus:ring-2 focus:ring-[#33C3F0]/20 text-center text-2xl"
          />
          <motion.button
            onClick={() => handleVerificationComplete(verificationCode)}
            className="w-full mt-4 px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={verificationLoading}
          >
            {verificationLoading ? "Verifying..." : "Verify"}
          </motion.button>
          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-[#33C3F0] hover:text-[#A374FF] transition-colors cursor-pointer"
                disabled={verificationLoading}
              >
                Resend
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default LoginPage;
