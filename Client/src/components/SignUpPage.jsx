import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check,X  } from 'lucide-react';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { BASE_URL } from '../config';
const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'At least 3 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'At least 6 characters';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setIsLoading(true);

  const payload = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    dateOfBirth: new Date(formData.dob).toISOString(),
    gender: formData.gender,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
     
      localStorage.setItem("userEmail", data.user.email);
      setShowVerification(true);
    } else {
      
      if (
        data.message === "Email already exists but not verified" &&
        data.user &&
        !data.user.isVerified
      ) {
        localStorage.setItem("userEmail", data.user.email);
        setShowVerification(true);
      } else {
        toast.error(data.message || "Registration failed");
        return ;
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};



  const handleVerificationComplete = async (code) => {
    setVerificationLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: code }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setVerificationSuccess(true);
        setTimeout(() => {
          setShowVerification(false);
           toast.success("Account Created successfully!");
          navigate('/login');
        }, 1500);
      } else {
        toast.error(data.message || "Invalid verification code");
        setVerificationLoading(false);
        return;
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.warning("Something went wrong during verification");
      setVerificationLoading(false);
    }
  };

  const handleGoogleSignUp = async (credentialResponse) => {
  setIsLoading(true);
  try {
    const { credential } = credentialResponse;
    if (!credential) throw new Error("No ID token returned");
    const res = await fetch(`${BASE_URL}/api/auth/google-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: credential }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || 'Signup successful!');
      navigate('/home');
    } else {
      toast.error(data.message || 'Google signup failed');
    }
  } catch (err) {
    console.error('Google sign-up error:', err);
    toast.error('Something went wrong during Google sign-up');
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
            to="/login"
            className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95 text-sm"
          >
            Sign in
          </Link>
        </div>
      </header>

      
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 w-96 h-96 bg-[var(--codeverse-cyan)]/10 rounded-full filter blur-3xl opacity-70 animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[var(--codeverse-purple)]/10 rounded-full filter blur-3xl opacity-70 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
          <div className="absolute left-1/4 bottom-1/3 w-32 h-32 bg-[var(--codeverse-cyan)]/10 rounded-full filter blur-xl opacity-70 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
          <div className="absolute right-1/3 top-1/4 w-48 h-48 bg-[var(--codeverse-purple)]/10 rounded-full filter blur-xl opacity-70 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-md w-full bg-white bg-opacity-70 backdrop-blur-lg border border-white/30 shadow-xl shadow-gray-200/50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Join CodeVerse</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                placeholder="coolcoder"
                value={formData.username}
                onChange={handleChange}
                className="h-11 px-4 py-2 rounded-lg border-2 border-gray-200 w-full transition-all duration-300 outline-none focus:border-[#33C3F0] focus:ring-2 focus:ring-[#33C3F0]/20"
                autoComplete="username"
                required
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
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
                autoComplete="new-password"
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="h-11 px-4 py-2 rounded-lg border-2 border-gray-200 w-full transition-all duration-300 outline-none focus:border-[#33C3F0] focus:ring-2 focus:ring-[#33C3F0]/20"
                required
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="h-11 px-4 py-2 rounded-lg border-2 border-gray-200 w-full transition-all duration-300 outline-none focus:border-[#33C3F0] focus:ring-2 focus:ring-[#33C3F0]/20"
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <motion.button
              type="submit"
              className="w-full px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </motion.button>
          </form>
          <div className="mt-6">
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full"
  >
    <GoogleLogin
      onSuccess={handleGoogleSignUp}
      onError={() => toast.error("Google sign-up failed")}
      theme="outline"       
      shape="pill"
      width="100%"
      text="signup_with"      
    />
  </motion.div>
</div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#33C3F0] hover:text-[#A374FF] transition-colors">
                Sign in
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
                className="text-[#33C3F0] hover:text-[#A374FF] transition-colors"
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

export default SignUpPage;
