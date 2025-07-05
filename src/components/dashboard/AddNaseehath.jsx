'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddNaseehath({ setMessage, setError }) {
  const [caption, setCaption] = useState('');
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null); // Optional image upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasText = caption.trim().length > 0;
    const hasVideo = Boolean(video);
    const hasImage = Boolean(image);

    if (!hasText && !hasVideo && !hasImage) {
      setError('Please enter a caption or upload a video or image.');
      return;
    }

    // If media exists, caption is required
    if ((hasVideo || hasImage) && !hasText) {
      setError('Please add a caption for the uploaded media.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('status', 'true');

    // Determine the type
    const type = hasVideo || hasImage ? 'naseehath' : 'textonly';
    formData.append('type', type);

    if (hasVideo) formData.append('images', video); // Send video as 'images'
    if (hasImage) formData.append('images', image); // Also supports image upload

    try {
      const res = await fetch('/api/posts/add', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit naseehath.');

      setMessage('✅ Naseehath posted successfully!');
      setCaption('');
      setVideo(null);
      setImage(null);

      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to submit naseehath.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white p-6 rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-green-700">Add Naseehath</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Enter naseehath caption..."
            className="w-full border border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Upload Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg text-white flex items-center justify-center transition duration-200 ${
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
              Posting...
            </>
          ) : (
            'Post Naseehath'
          )}
        </button>
      </form>
    </div>
  );
}
