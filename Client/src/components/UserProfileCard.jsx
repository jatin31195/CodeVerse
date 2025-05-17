import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Calendar, User, Edit2, X } from "lucide-react";

const API_BASE = "http://localhost:8080/api/auth";

const UserProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    dob: "",
    gender: "",
    avatarUrl: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const token = sessionStorage.getItem("token");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: token }
        });
        const user = res.data.data.user;
        setEditData({
          name:      user.name || "",
          dob:       user.dateOfBirth?.slice(0, 10) || "",
          gender:    user.gender || "",
          email:     user.email || "", 
          avatarUrl: user.profilePic || ""
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setAvatarFile(files[0]);
      // Show preview immediately
      setEditData((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(files[0])
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Save updates
  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (editData.name)   formData.append("name", editData.name);
      if (editData.dob)    formData.append("dob", editData.dob);
      if (editData.gender) formData.append("gender", editData.gender);
      if (avatarFile)      formData.append("profilePic", avatarFile);

      await axios.patch(
        `${API_BASE}/update-profile`,
        formData,
        {
          headers: {
            Authorization: token // raw token, no Content-Type override
          }
        }
      );

      // Re-fetch to get any server‑normalized data
      setIsEditing(false);
      const res = await axios.get(`${API_BASE}/profile`, {
        headers: { Authorization: token }
      });
      const user = res.data.data.user;
      setEditData({
        name:      user.name || "",
        dob:       user.dateOfBirth?.slice(0, 10) || "",
        gender:    user.gender || "",
        avatarUrl: user.profilePic || ""
      });
      setAvatarFile(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <>
      {/* Profile Card */}
      <motion.div
        className="w-full overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 blur-sm opacity-70"></div>
            <div className="h-24 w-24 border-2 border-white rounded-full overflow-hidden relative">
              {editData.avatarUrl ? (
                <img
                  src={editData.avatarUrl}
                  alt={editData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <span className="text-xl font-bold text-gray-600">
                    {editData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700">
              {editData.name}
            </h2>
            <p className="flex items-center justify-center md:justify-start text-gray-700 mb-4">
              <Mail className="h-4 w-4 mr-1 opacity-70" />
              {editData.email}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2 border">
                <Calendar className="h-4 w-4 text-gray-700" />
                <span className="text-gray-600">Born:</span>
                <span className="font-medium text-gray-800">{editData.dob}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2 border">
                <User className="h-4 w-4 text-purple-500" />
                <span className="text-gray-700">Gender:</span>
                <span className="font-medium text-gray-800">{editData.gender}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-purple-50 transition-colors text-sm"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative"
          >
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-purple-600">
                  {editData.avatarUrl && (
                    <img
                      src={editData.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer text-white opacity-0 hover:opacity-100 transition">
                  Upload
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={editData.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={editData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded mt-1"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UserProfileCard;
