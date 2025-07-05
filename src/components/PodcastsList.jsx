'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function PodcastsList({ podcasts, isLogged, onPodcastDelete, loadMore, hasMore, loading }) {
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const deleteVideo = async (videoId) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/podcasts/delete`,
        { podcastId: videoId },
        { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_PASS } }
      );
      if (onPodcastDelete) {
        onPodcastDelete(videoId);
      }
      setSelectedPodcast(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      alert(error.response?.data?.error || 'Failed to delete video');
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const created = new Date(date);
    const diffInSeconds = Math.floor((now - created) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleBackdropClick = (e) => {
    // You might want to refine this to use a ref for the modal content as in the previous example
    // This simple check might close the modal if you click on the padding around the modal content
    if (e.target.closest('.modal-content')) return;
    setSelectedPodcast(null);
  };

  // Function to handle redirection
  const handleViewAllClick = () => {
    router.push('/all-podcasts');
  };

  return (
    <div className="mt-8">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#1A237E] to-[#2E7D32] bg-clip-text text-transparent"
      >
        Podcasts
      </motion.h3>
      {podcasts.length === 0 && !loading ? (
        <p className="text-center text-[#1A237E]/70 text-lg py-6 bg-white/30 rounded-2xl shadow-md">No videos available</p>
      ) : (
        <div className="space-y-6">
          {podcasts.map((video, index) => (
            <motion.div
              key={video.VIDEO_ID}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="relative bg-white/90 backdrop-blur-md border border-[#E0E0E0]/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-[#2E7D32]/20 transition-all duration-400 hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedPodcast(video)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {video.THUMBNAIL_URL ? (
                    <img
                      src={video.THUMBNAIL_URL}
                      alt={video.TITLE}
                      className="w-24 h-24 rounded-xl object-cover shadow-inner transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl flex items-center justify-center shadow-inner">
                      <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300 line-clamp-2">
                      {video.TITLE}
                    </h4>
                    <p className="text-md text-[#1A237E]/70 mt-2">{getTimeAgo(video.CREATEDAT)}</p>
                  </div>
                </div>
                {isLogged && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this video?')) {
                        deleteVideo(video.VIDEO_ID);
                      }
                    }}
                    className="p-3 rounded-full bg-red-100/80 hover:bg-red-200/80 text-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {loading && (
        <div className="flex justify-center mt-8">
          <svg className="animate-spin h-10 w-10 text-[#2E7D32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleViewAllClick} 
            className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white px-8 py-3 rounded-2xl shadow-lg hover:from-[#256029] hover:to-[#388E3C] transition-all duration-300 text-lg font-medium"
          >
            View All
          </button>
        </div>
      )}
      {selectedPodcast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A237E]/70 backdrop-blur-md"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="relative w-full max-w-2xl mx-4 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#E0E0E0]/30 modal-content" 
          >
            <button
              className="absolute top-4 right-4 text-[#1A237E] text-3xl bg-white/70 rounded-full p-3 hover:bg-white/90 transition-all duration-300 shadow-md"
              onClick={() => setSelectedPodcast(null)}
            >
              ✕
            </button>
            <div className="flex flex-col items-center">
              <h4 className="text-2xl font-bold text-[#1A237E] mb-4">{selectedPodcast.TITLE}</h4>
              <video
                src={selectedPodcast.VIDEO_URL}
                controls
                className="w-full max-h-[70vh] rounded-lg shadow-inner"
                onError={(e) => console.error('Video load error:', e)}
              />
              <p className="text-md text-[#1A237E]/70 mt-4">{getTimeAgo(selectedPodcast.CREATEDAT)}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}