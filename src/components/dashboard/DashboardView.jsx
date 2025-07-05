'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard'; // Adjust the import path as needed

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (page) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.get(`/api/posts/all?page=${page}&limit=${limit}`);
      //console.log(`Fetched posts for page ${page}:`, data);

      // Handle direct array response
      const newPosts = Array.isArray(data) ? data : (data.posts || []);
      //console.log('New posts:', newPosts);

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...newPosts];
        //console.log('Updated posts state:', updatedPosts);
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

  useEffect(() => {
    fetchPosts(pageNum);
  }, [pageNum]);

  const loadMore = () => {
    setPageNum((prevPage) => prevPage + 1);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.POST_ID !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">All Posts</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          {error}
        </div>
      )}

      {posts.length === 0 && !loading && !error && (
        <p className="text-gray-600">No posts found.</p>
      )}

      <div className="space-y-4">
        {posts.map((post, index) => {
          let thumbnail = [];
          try {
            thumbnail = JSON.parse(post.IMAGEURL) || [];
          } catch (e) {
            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
            thumbnail = [];
          }

          //console.log('Rendering PostCard for post:', post.POST_ID);

          return (
            <PostCard
              key={index}
              postId={post.POST_ID}
              caption={post.CAPTION}
              thumbnail={thumbnail}
              createdAt={post.CREATEDAT}
              naseehath={post.TYPE}
              video={post.VIDEOLINK}
              videoheight={post.HEIGHT}
              videowidth={post.WIDTH}
              imageheight={post.IMAGEHEIGHT}
              imagewidth={post.IMAGEWIDTH}
              onPostDelete={handlePostDeleted}
            />
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}