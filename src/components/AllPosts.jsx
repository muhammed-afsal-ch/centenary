'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [limit] = useState(6);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeType, setActiveType] = useState('All');
    const [selectedPost, setSelectedPost] = useState(null);
    const filterOptions = ['All', 'Images', 'video'];

    const fetchUpdates = async (page) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get(`/api/updates/all?page=${page}&limit=${limit}`);
            const newPosts = Array.isArray(data) ? data : (data.posts || []);
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            if (newPosts.length === 0 || newPosts.length < limit) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching updates:', err);
            setError(err.response?.data?.error || 'Failed to fetch updates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpdates(pageNum);
    }, [pageNum]);

    const loadMore = () => {
        setPageNum((prevPage) => prevPage + 1);
    };

    const getTimeAgo = (date) => {
        if (!date) return 'Centenary';
        const now = new Date();
        const created = new Date(date);
        const diffInSeconds = Math.floor((now - created) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleDownload = async (post) => {
        const isVideoPost = post.VIDEOLINK && (post.TYPE === 'video' || post.TYPE.toLowerCase().includes('video'));
        let thumbnail = [];
        try {
            thumbnail = JSON.parse(post.IMAGEURL) || [];
        } catch (e) {
            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
            thumbnail = [];
        }

        const mediaUrl = isVideoPost ? post.VIDEOLINK : thumbnail[0];
        const filename = `samastha_${post.POST_ID}.${isVideoPost ? 'mp4' : 'jpg'}`;

        try {
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            alert(`${isVideoPost ? 'Video' : 'Image'} downloaded successfully!`);
        } catch (error) {
            console.error('Error downloading:', error);
            alert(`Failed to download ${isVideoPost ? 'video' : 'image'}.`);
        }
    };

    const handleShare = async (post) => {
        const isVideoPost = post.VIDEOLINK && (post.TYPE === 'video' || post.TYPE.toLowerCase().includes('video'));
        const isTextOnly = post.TYPE === 'textonly';
        let thumbnail = [];
        try {
            thumbnail = JSON.parse(post.IMAGEURL) || [];
        } catch (e) {
            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
            thumbnail = [];
        }

        const shareData = isTextOnly
            ? { title: 'Samastha Post', text: `${post.CAPTION} @Samastha App`, url: window.location.href }
            : { title: 'Samastha Post', text: `${post.CAPTION} @Samastha App`, url: isVideoPost ? post.VIDEOLINK : thumbnail[0] };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
                alert('Failed to share post.');
            }
        } else {
            alert('Sharing is not supported on this browser.');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(
            () => alert('Text copied to clipboard!'),
            (err) => {
                console.error('Error copying text:', err);
                alert('Failed to copy text.');
            }
        );
    };

    const openModal = (post) => {
        const isTextOnly = post.TYPE === 'textonly';
        if (!isTextOnly) {
            setSelectedPost(post);
        }
    };

    const closeModal = () => {
        setSelectedPost(null);
    };



    function CaptionWithReadMore({ text, maxLength = 300 }) {
        const [expanded, setExpanded] = useState(false);

        // If caption is null, undefined, or only whitespace, return nothing
        if (!text || text.trim() === '') return null;

        const isLong = text.length > maxLength;
        const displayText = expanded ? text : text.slice(0, maxLength);

        return (
            <div className="text-[#1A237E] text-sm leading-relaxed whitespace-pre-line">
                {displayText}
                {isLong && !expanded && '... '}
                {isLong && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="ml-2 text-[#2E7D32] font-semibold hover:underline"
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>
        );
    }


    return (
        <div className="max-w-6xl mx-auto">
            {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            {posts.length === 0 && !loading && !error && (
                <p className="text-center text-[#1A237E]/90">No updates found.</p>
            )}

            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {filterOptions.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border 
                            ${activeType === type
                                ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-lg'
                                : 'bg-white text-[#1A237E] border-[#2E7D32]/20 hover:bg-[#E8F5E9] hover:shadow-md'
                            }`}
                    >
                        {type === 'All' ? 'All Updates' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts
                    .filter((post) => {
                        let thumbnail = [];
                        try {
                            thumbnail = JSON.parse(post.IMAGEURL) || [];
                        } catch (e) {
                            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
                            thumbnail = [];
                        }

                        if (post.TYPE === 'textonly') return false; // 💥 filter out here

                        if (activeType === 'All') return true;
                        if (activeType === 'Images') return !post.VIDEOLINK && thumbnail.length > 0;
                        return post.TYPE?.toLowerCase() === activeType.toLowerCase();
                    })

                    .map((post, index) => {
                        let thumbnail = [];
                        try {
                            thumbnail = JSON.parse(post.IMAGEURL) || [];
                        } catch (e) {
                            console.error('Error parsing IMAGEURL for post', post.POST_ID, ':', post.IMAGEURL);
                            thumbnail = [];
                        }

                        const isVideoPost = post.VIDEOLINK && (post.TYPE === 'video' || post.TYPE.toLowerCase().includes('video'));
                        const isTextOnly = post.TYPE === 'textonly';
                        const displayMedia = isVideoPost ? post.VIDEOLINK : thumbnail[0] || '/images/placeholder.png';

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`bg-white border border-[#2E7D32]/20 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${!isTextOnly ? 'cursor-pointer' : ''}`}
                                onClick={() => openModal(post)}
                            >
                                {/* Post Header */}
                                <div className="flex items-center mb-4">
                                    <Image
                                        src="/images/logo.png"
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-[#1A237E]">
                                            {isVideoPost ? 'Daily Video' : isTextOnly ? 'Daily Nasehath' : 'Updates'}
                                        </p>
                                        <p className="text-xs text-[#1A237E]/80">{getTimeAgo(post.CREATEDAT)}</p>
                                    </div>
                                </div>

                                {/* Media or Text */}
                                {isTextOnly ? (
                                    <p className="text-[#1A237E]/90 text-base">{post.CAPTION}</p>
                                ) : (
                                    <div className="relative rounded-lg overflow-hidden mb-4">
                                        {isVideoPost ? (
                                            <video
                                                src={post.VIDEOLINK}
                                                controls
                                                className="w-full h-48 object-cover rounded-lg"
                                                poster={thumbnail[0] || '/images/placeholder.png'}
                                            />
                                        ) : thumbnail.length > 0 ? (
                                            <img
                                                src={thumbnail[0]}
                                                alt="Update"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <p className="text-[#1A237E]/90">No media available</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Caption */}
                                {!isTextOnly && post.CAPTION && (
                                    <p className="text-[#1A237E]/90 text-base line-clamp-2">{post.CAPTION}</p>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-2 mt-4">
                                    {isTextOnly ? (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopy(post.CAPTION);
                                                }}
                                                className="p-2 rounded-full bg-[#E8F5E9] hover:bg-[#D0E8D4] text-[#2E7D32]"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(post);
                                                }}
                                                className="p-2 rounded-full bg-[#E8F5E9] hover:bg-[#D0E8D4] text-[#2E7D32]"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(post);
                                                }}
                                                className="p-2 rounded-full bg-[#E8F5E9] hover:bg-[#D0E8D4] text-[#2E7D32]"
                                                disabled={!thumbnail && !post.VIDEOLINK}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V3" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(post);
                                                }}
                                                className="p-2 rounded-full bg-[#E8F5E9] hover:bg-[#D0E8D4] text-[#2E7D32]"
                                                disabled={!thumbnail && !post.VIDEOLINK}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
            </div>

            {selectedPost && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                    onClick={closeModal}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-3xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedPost.VIDEOLINK && (selectedPost.TYPE === 'video' || selectedPost.TYPE.toLowerCase().includes('video')) ? (
                            <video
                                src={selectedPost.VIDEOLINK}
                                controls
                                autoPlay
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                                poster={(() => {
                                    let thumbnail = [];
                                    try {
                                        thumbnail = JSON.parse(selectedPost.IMAGEURL) || [];
                                    } catch (e) {
                                        console.error('Error parsing IMAGEURL for modal', selectedPost.POST_ID, ':', selectedPost.IMAGEURL);
                                    }
                                    return thumbnail[0] || '/images/placeholder.png';
                                })()}
                            />
                        ) : (
                            <img
                                src={(() => {
                                    let thumbnail = [];
                                    try {
                                        thumbnail = JSON.parse(selectedPost.IMAGEURL) || [];
                                    } catch (e) {
                                        console.error('Error parsing IMAGEURL for modal', selectedPost.POST_ID, ':', selectedPost.IMAGEURL);
                                    }
                                    return thumbnail[0] || '/images/placeholder.png';
                                })()}
                                alt="Full Update"
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        )}
                        <button
                            className="absolute top-2 right-2 text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/70"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <div className="bg-white mt-4 p-4 rounded-lg max-h-[200px] overflow-y-auto shadow-inner">
                            <CaptionWithReadMore text={selectedPost.CAPTION} />
                        </div>
                    </motion.div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center mt-8">
                    <svg className="animate-spin h-5 w-5 text-[#2E7D32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {hasMore && !loading && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-[#256029] transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}