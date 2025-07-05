"use client";
import { useState, useEffect, useRef } from 'react'; // Import useRef
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function AllPodcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Create a ref for the modal content
  const modalRef = useRef(null);

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

  const fetchPodcasts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/podcasts/all?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (response.ok) {
        const newPodcasts = data.podcasts || data;
        setPodcasts((prev) => (page === 1 ? newPodcasts : [...prev, ...newPodcasts]));
        setTotalPages(data.totalPages || Math.ceil(data.total / limit));
        setHasMore(page < (data.totalPages || Math.ceil(data.total / limit)));
      } else {
        setError(data.error || 'Failed to fetch podcasts');
      }
    } catch (err) {
      setError('Failed to fetch podcasts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, [page]);

  // Effect for handling click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If modal is open and click is outside the modal content
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedPodcast(null); // Close the modal
      }
    };

    if (selectedPodcast) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedPodcast]); // Re-run effect when selectedPodcast changes

  const loadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <Head>
        <title>All Podcasts</title>
        <meta name="description" content="Browse all available podcasts" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#1A237E] to-[#2E7D32] bg-clip-text text-transparent"
        >
          All Podcasts
        </motion.h1>

        {loading && page === 1 && (
          <div className="flex justify-center mt-8">
            <svg className="animate-spin h-10 w-10 text-[#2E7D32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
        {error && <p className="text-center text-[#1A237E]/70 text-lg py-6 bg-white/30 rounded-2xl shadow-md">{error}</p>}

        {!loading && !error && podcasts.length === 0 && (
          <p className="text-center text-[#1A237E]/70 text-lg py-6 bg-white/30 rounded-2xl shadow-md">No podcasts available</p>
        )}

        <div className="space-y-6">
          {podcasts.map((podcast, index) => (
            <motion.div
              key={podcast.VIDEO_ID}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="relative bg-white/90 backdrop-blur-md border border-[#E0E0E0]/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-[#2E7D32]/20 transition-all duration-400 hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedPodcast(podcast)}
            >
              <div className="flex items-center gap-6">
                {podcast.THUMBNAIL_URL ? (
                  <img
                    src={podcast.THUMBNAIL_URL}
                    alt={podcast.TITLE}
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
                    {podcast.TITLE}
                  </h4>
                  <p className="text-md text-[#1A237E]/70 mt-2">{getTimeAgo(podcast.CREATEDAT)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white px-8 py-3 rounded-2xl shadow-lg hover:from-[#256029] hover:to-[#388E3C] transition-all duration-300 text-lg font-medium"
            >
              View All
            </button>
          </div>
        )}

        {selectedPodcast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A237E]/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="relative w-full max-w-2xl mx-4 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#E0E0E0]/30"
              ref={modalRef}
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
    </>
  );
}