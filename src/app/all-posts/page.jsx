'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts/allposts?page=${pageNum}&limit=12`);
      const newPosts = res.data;

      if (newPosts.length < 12) setHasMore(false);
      setPosts(prev => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#E6ECEF] text-[#1A237E] p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-extrabold mb-10 text-center text-[#1A237E]">📢 All News Posts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <div
              key={post.POST_ID}
              className="relative group backdrop-blur-lg bg-white/40 hover:bg-white/70 border border-[#1A237E]/10 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={JSON.parse(post.IMAGEURL)[0]}
                  alt={post.TITLE}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#1A237E] mb-2 line-clamp-2 group-hover:text-[#2E7D32] transition-colors duration-300">
                  {post.TITLE}
                </h3>
                <p className="text-sm text-[#1A237E]/70 mb-3 line-clamp-2">{post.CAPTION}</p>
                <Link
                  href={`/p/${post.POST_ID}`}
                  className="text-sm font-medium text-[#2E7D32] hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-3 bg-white/30 backdrop-blur-xl border border-[#2E7D32]/30 text-[#2E7D32] font-semibold rounded-full shadow-md hover:bg-white/50 hover:shadow-lg transition-all duration-300"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
