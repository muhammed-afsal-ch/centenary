'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPost({ setMessage, setError }) {
  const [form, setForm] = useState({ images: [], caption: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map((file) => ({ uri: URL.createObjectURL(file), file }))],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('caption', form.caption);
    formData.append('status', 'true');

    form.images.forEach((image, index) => {
      formData.append('images', image.file, `posts_${index}.jpg`);
    });

    try {
      const response = await fetch('/api/posts/add', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit post');
      }

      setMessage('Post uploaded successfully!');
      setForm({ images: [], caption: '' });
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (err) {
      console.error('Error submitting:', err);
      setError(err.message || 'Failed to submit post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white p-6 rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-green-700">Add New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {form.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.uri}
                alt={`Selected ${index}`}
                className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                onClick={() => setSelectedImage(image.uri)}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 rounded-full p-1 transform translate-x-1 -translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => document.getElementById('imageInput').click()}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Choose Images
        </button>
        <input
          id="imageInput"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div>
          <label className="block mb-1 font-medium text-gray-700">Caption</label>
          <textarea
            value={form.caption}
            onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))}
            className="w-full border border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Enter caption"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg text-white transition duration-200 flex items-center justify-center ${
            isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-10 right-5 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Full-screen preview"
            className="max-w-full max-h-[80vh] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}