'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PostCard from '../../../../components/dashboard/PostCard';

export default function UpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLogged, setIsLogged] = useState(false); // Placeholder for auth state
  const limit = 10;

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Fetch updates from the Next.js API route
  const fetchData = async (pageNum = 1, isRefreshing = false, search = searchQuery) => {
    if (!isRefreshing && loadingMore) return;

    try {
      if (isRefreshing) {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `/api/updates/all?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(search)}`
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.slice(0, 100));
        throw new Error('Received non-JSON response from server');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch updates');
      }

      if (data.length < limit) setHasMore(false);

      setUpdates((prevUpdates) => (isRefreshing ? data : [...prevUpdates, ...data]));
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch updates');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData(1, true);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchData(1, true, query);
  };

  // Handle update deletion
  const handleUpdateDeleted = (postId) => {
    setUpdates((prevUpdates) => prevUpdates.filter((post) => post.POST_ID !== postId));
  };

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
          fetchData(page + 1, false, searchQuery);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [page, hasMore, loadingMore, searchQuery]);

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-12 w-12 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Updates</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by caption..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
            {error}
          </div>
        )}

        {/* Updates List */}
        {updates.length === 0 && !loading && !error && (
          <p className="text-gray-600">
            {searchQuery ? 'No matching updates found' : 'No updates available'}
          </p>
        )}
        <div className="space-y-4 max-w-[640px] mx-auto">
          {updates.map((update) => {
            let imageUrls = [];
            try {
              imageUrls = JSON.parse(update.IMAGEURL) || [];
            } catch (e) {
              console.error('Invalid IMAGEURL format:', update.IMAGEURL);
            }
            return (
              <PostCard
                key={update.POST_ID}
                thumbnail={imageUrls}
                caption={update.CAPTION}
                postId={update.POST_ID}
                type="updates"
                onUpdateDelete={isLogged ? handleUpdateDeleted : null}
              />
            );
          })}
        </div>

        {/* Load More Indicator */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center mt-4">
            {loadingMore && (
              <svg
                className="animate-spin h-5 w-5 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </div>
        )}
        {!hasMore && updates.length > 5 && (
          <p className="text-center text-gray-600 mt-4">No more updates</p>
        )}

        {/* Add Update Button (for logged-in users) */}
        {isLogged && (
          <Link
            href="/admin/addupdate"
            className="fixed bottom-8 right-8 bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-green-700"
          >
            +
          </Link>
        )}
      </div>
    </div>
  );
}