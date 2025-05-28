import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from './MainLayout';
import {toast} from 'react-toastify'
import { Toaster } from 'sonner';
export default function ReportIssuePage() {
 const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const token = sessionStorage.getItem('token');

  const handleFilesChange = (e) => {
    const chosenFiles = Array.from(e.target.files).slice(0, 1); 
    setFiles(chosenFiles);
    setPreviewUrls(chosenFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const formData = new FormData();
    formData.append('description', description);
    if (files[0]) formData.append('screenshot', files[0]);

    try {
      const res = await fetch('http://localhost:8080/api/issue/report-issue', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        Toaster.error('Report failed:', await res.text());
        return ;
      }
    } catch (err) {
      toast.error('Error submitting report:', err);
    }
  };

  if (submitted) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-10 shadow-xl text-center max-w-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Thank you!
            </h2>
            <p className="text-gray-600">
              Your issue report has been submitted. We’ll look into it right away.
            </p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
   <MainLayout>
  <div className="absolute top-0 left-0 w-full h-full m-0 p-0 bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-900 flex items-center justify-center">
    <motion.form
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full space-y-6 mx-4"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
        Report an Issue
      </h1>
      <p className="text-gray-600 text-center">
        Tell us what went wrong and attach screenshots if you have any.
      </p>

      
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Describe the issue
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="I encountered an error when..."
        />
      </div>

      
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Upload screenshots (optional)
        </label>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="hidden"
        />

        <div className="flex items-center gap-4">
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0-6l-3 3m3-3l3 3M8 8h.01M16 8h.01"
              />
            </svg>
            Select Images
          </label>
          <span className="text-gray-200 italic text-sm">
            {files.length > 0
              ? files.map((f) => f.name).join(', ')
              : 'No files selected'}
          </span>
        </div>

        {previewUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`preview-${idx}`}
                className="h-20 w-full object-cover rounded-lg shadow"
              />
            ))}
          </div>
        )}
      </div>

      
      <button
        type="submit"
        className="cursor-pointer mt-4 w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
      >
        Send Report
      </button>
    </motion.form>
  </div>
</MainLayout>

  );
}
