import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Calendar, User, Edit2, X } from "lucide-react";

const API_BASE = "http://localhost:8080/api/auth";

const UserProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    avatarUrl: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: token }
        });
        const user = res.data.data.user;
        setEditData({
          name: user.name || "",
          dob: user.dateOfBirth?.slice(0, 10) || "",
          gender: user.gender || "",
          email: user.email || "",
          avatarUrl: user.profilePic || ""
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setAvatarFile(files[0]);
      setEditData((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(files[0])
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (editData.name) formData.append("name", editData.name);
      if (editData.dob) formData.append("dob", editData.dob);
      if (editData.gender) formData.append("gender", editData.gender);
      if (avatarFile) formData.append("profilePic", avatarFile);

      await axios.patch(`${API_BASE}/update-profile`, formData, {
        headers: { Authorization: token }
      });

      setIsEditing(false);
      const res = await axios.get(`${API_BASE}/profile`, {
        headers: { Authorization: token }
      });
      const user = res.data.data.user;
      setEditData({
        name: user.name || "",
        dob: user.dateOfBirth?.slice(0, 10) || "",
        gender: user.gender || "",
        email: user.email || "",
        avatarUrl: user.profilePic || ""
      });
      setAvatarFile(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto ">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 relative overflow-hidden"
      >
        
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative w-28 h-28 shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-xl opacity-30 z-0"></div>
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              {editData.avatarUrl ? (
                <img
                  src={editData.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {editData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
              {editData.name}
            </h2>
            <p className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
              <Mail className="h-4 w-4 mr-2 opacity-70" />
              {editData.email}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">Born:</span>
                <span className="ml-auto text-sm font-semibold text-gray-800">{editData.dob}</span>
              </div>
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                <User className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-700">Gender:</span>
                <span className="ml-auto text-sm font-semibold text-gray-800">{editData.gender}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>

  
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="h-5 w-5 cursor-pointer" />
              </button>

              <div className="flex flex-col items-center mb-4">
                <label className="relative cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg">
                  <img
                    src={editData.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-sm text-white transition">
                    Upload
                  </div>
                </label>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={editData.dob}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Gender</label>
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileCard;
