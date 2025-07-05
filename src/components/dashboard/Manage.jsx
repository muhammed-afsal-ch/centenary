'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

export default function ManagePosts({ onPostDelete, onUpdateDelete }) {
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null); // Renamed from deleting to isDeleting
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal
  const [postToDelete, setPostToDelete] = useState(null); // Track post to delete
  const [notification, setNotification] = useState(null); // For success/error messages

  const fetchPosts = async (page) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.get(`/api/posts/all?page=${page}&limit=${limit}`);
      //console.log(`Fetched posts for page ${page}:`, data);

      const newPosts = Array.isArray(data) ? data : (data.posts || []);
      //console.log('New posts:', newPosts);

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...newPosts];
       // console.log('Updated posts state:', updatedPosts);
        return updatedPosts;
      });

      const totalPosts = data.total || (newPosts.length < limit ? posts.length + newPosts.length : Infinity);
      if (newPosts.length === 0 || newPosts.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.error || 'Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setShowConfirmModal(true);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setPostToDelete(null);
  };

  const deletePost = async () => {
    if (!postToDelete) return;

    setIsDeleting(postToDelete);
    setShowConfirmModal(false); // Close the confirmation modal

    try {
      const response = await axios.post('/api/posts/delete', { postId: postToDelete });

      // Update the local state to remove the deleted post
      setPosts((prevPosts) => prevPosts.filter((post) => post.POST_ID !== postToDelete));

      // Show success notification
      setNotification({ type: 'success', message: response.data.message });

      // Call optional callbacks if provided
      if (onPostDelete) {
        onPostDelete(postToDelete);
      }
      if (onUpdateDelete) {
        onUpdateDelete(postToDelete);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // Show error notification
      setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to delete post' });
    } finally {
      setIsDeleting(null);
      setPostToDelete(null);
    }
  };

  useEffect(() => {
    fetchPosts(pageNum);
  }, [pageNum]);

  const loadMore = () => {
    setPageNum((prevPage) => prevPage + 1);
  };

  const openPopup = (post) => {
    setSelectedPost(post);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8">Manage Posts</h1>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-6 shadow-sm">
          {error}
        </div>
      )}

      {/* Success/Error Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg mb-6 shadow-sm flex justify-between items-center ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-sm font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {posts.length === 0 && !loading && !error && (
        <p className="text-gray-600 text-center py-6">No posts found.</p>
      )}

      {posts.length > 0 && (
        <div
          className="overflow-x-auto rounded-xl shadow-lg"
          style={{
            background: 'linear-gradient(to bottom, #e6f4ea, #ffffff)',
            border: '1px solid #d1e7dd',
          }}
        >
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-100 text-green-800 uppercase text-xs font-semibold">
                <th className="px-6 py-4 text-left rounded-tl-xl">Thumbnail</th>
                <th className="px-6 py-4 text-left">Caption</th>
                <th className="px-6 py-4 text-left rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => {
                let thumbnail = [];
                try {
                  thumbnail = JSON.parse(post.IMAGEURL) || [];
                } catch (e) {
                  console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
                  thumbnail = [];
                }

                const isLastRow = index === posts.length - 1;

                return (
                  <tr
                    key={index}
                    className="bg-white hover:bg-green-50 transition-colors duration-200"
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        isLastRow ? 'rounded-bl-xl' : ''
                      }`}
                    >
                      {thumbnail.length > 0 ? (
                        <img
                          src={thumbnail[0]}
                          alt="Thumbnail"
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/48')}
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-600 text-xs rounded-full border-2 border-green-200">
                          Text
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="line-clamp-2 text-gray-800">{post.CAPTION}</div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${isLastRow ? 'rounded-br-xl' : ''}`}>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openPopup(post)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="View Post"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(post.POST_ID)}
                          disabled={isDeleting === post.POST_ID}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="Delete Post"
                        >
                          {isDeleting === post.POST_ID ? (
                            <svg
                              className="animate-spin h-5 w-5 text-red-500"
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
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M5 7h14"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-6">
          <svg
            className="animate-spin h-6 w-6 text-green-600"
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
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modal for viewing post */}
      {selectedPost && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4">
          {/* Blurred background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              filter: 'blur(10px) brightness(0.5)',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />
          {/* Semi-transparent overlay for better readability */}
          <div className="absolute inset-0 bg-opacity-40 backdrop-blur-sm" onClick={closePopup}></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Post content (image or video) */}
            {(() => {
              let thumbnail = [];
              try {
                thumbnail = JSON.parse(selectedPost.IMAGEURL) || [];
              } catch (e) {
                console.error('Error parsing IMAGEURL for modal', selectedPost.POST_ID, ':', selectedPost.IMAGEURL);
                thumbnail = [];
              }

              const screenWidth = 640;
              const paddingHorizontal = 16;
              const adjustedWidth = screenWidth - paddingHorizontal;
              const aspectRatio = 16 / 9; // Fallback aspect ratio
              const normalHeight = selectedPost.videoheight || (adjustedWidth / aspectRatio);

              return selectedPost.video ? (
                <video
                  src={selectedPost.video}
                  style={{ width: adjustedWidth, height: normalHeight }}
                  className="rounded-lg w-full"
                  controls
                  autoPlay
                />
              ) : thumbnail.length > 0 ? (
                <img
                  src={thumbnail[0]}
                  alt="Post"
                  style={{ width: adjustedWidth, height: normalHeight }}
                  className="rounded-lg w-full object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/640x360')}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
                  Text Only Post
                </div>
              );
            })()}
          </div>

          {/* Caption below the modal */}
          <div className="relative mt-4 max-w-md w-full">
            <p className="text-white bg-black bg-opacity-60 p-3 rounded-lg text-center shadow-md">
              {selectedPost.CAPTION}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              filter: 'blur(10px) brightness(0.5)',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-opacity-40 backdrop-blur-sm" onClick={cancelDelete}></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                No
              </button>
              <button
                onClick={deletePost}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}