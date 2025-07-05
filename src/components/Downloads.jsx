'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Downloads({ downloads, isLogged, onDownloadDelete, loadMore, hasMore, loading }) {
    const [selectedDownload, setSelectedDownload] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const modalRef = useRef(null);

    const handleDownload = async (download, e) => {
        e.stopPropagation();
        if (!download.DOWNLOAD_LINK) {
            alert('No download link provided.');
            return;
        }
        try {
            const response = await fetch(`/api/proxy/download?url=${encodeURIComponent(download.DOWNLOAD_LINK)}`);
            if (!response.ok) throw new Error('Fetch failed for download URL');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `download_${download.DOWNLOAD_ID}.${download.DOWNLOAD_LINK.split('.').pop() || 'file'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            alert('File downloaded successfully!');
        } catch (error) {
            console.error('Error downloading:', error);
            alert('Failed to download file.');
        }
    };

    const deleteDownload = async (downloadId) => {
        setIsDeleting(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/downloads/delete`,
                { downloadId },
                { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_PASS } }
            );
            alert('Success: ' + response.data.message);
            if (onDownloadDelete) {
                onDownloadDelete(downloadId);
            }
            setSelectedDownload(null);
        } catch (error) {
            console.error('Error deleting download:', error);
            alert(error.response?.data?.error || 'Failed to delete download');
        } finally {
            setIsDeleting(false);
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
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setSelectedDownload(null);
        }
    };

    useEffect(() => {
        if (selectedDownload) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('click', handleClickOutside);
        } else {
            document.body.style.overflow = 'auto';
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedDownload]);

    return (
        <div className="mt-6">
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#1A237E] to-[#2E7D32] bg-clip-text text-transparent"
            >
                Downloads
            </motion.h3>
            {downloads.length === 0 ? (
                <p className="text-center text-[#1A237E]/70 text-lg py-6 bg-white/30 backdrop-blur-md rounded-xl shadow-sm">
                    No downloads available
                </p>
            ) : (
                <div className="space-y-4">
                    {downloads.map((download, index) => (
                        <motion.div
                            key={download.DOWNLOAD_ID}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
                            className="relative bg-white/80 backdrop-blur-md border border-[#E0E0E0]/50 rounded-xl p-5 shadow-md hover:shadow-xl hover:ring-4 hover:ring-[#2E7D32]/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                            onClick={() => setSelectedDownload(download)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {download.PREVIEW_IMAGE ? (
                                        <img
                                            src={download.PREVIEW_IMAGE}
                                            alt={download.TITLE}
                                            className="w-12 h-12 rounded-lg object-cover shadow-inner"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-lg flex items-center justify-center shadow-inner">
                                            <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        <p className="text-lg font-semibold text-[#1A237E] group-hover:text-[#2E7D32] transition-colors duration-300 line-clamp-1">
                                            {download.TITLE}
                                        </p>
                                        <p className="text-sm text-[#1A237E]/60 mt-1">{getTimeAgo(download.CREATEDAT)}</p>
                                    </div>
                                </div>
                                {isLogged && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this download?')) {
                                                deleteDownload(download.DOWNLOAD_ID);
                                            }
                                        }}
                                        disabled={isDeleting}
                                        className="p-2 rounded-full bg-red-100/80 hover:bg-red-200/80 text-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-[#1A237E]/70 mt-3 line-clamp-2">{download.DESCRIPTION}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {selectedDownload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A237E]/70 backdrop-blur-md">
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                        className="relative w-full max-w-md mx-4 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-[#E0E0E0]/30"
                    >
                        <div className="flex items-center mb-6">
                            {selectedDownload.PREVIEW_IMAGE ? (
                                <img
                                    src={selectedDownload.PREVIEW_IMAGE}
                                    alt="Preview"
                                    className="w-12 h-12 object-cover rounded-lg shadow-inner"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-lg flex items-center justify-center shadow-inner">
                                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            )}
                            <p className="ml-5 text-xl font-bold text-[#1A237E]">{selectedDownload.TITLE}</p>
                        </div>
                        <p className="text-sm text-[#1A237E]/60 mb-4">{getTimeAgo(selectedDownload.CREATEDAT)}</p>
                        <p className="text-sm text-[#1A237E]/70 mb-6 line-clamp-3">{selectedDownload.DESCRIPTION}</p>
                        {selectedDownload.DOWNLOAD_LINK && (
                            <button
                                onClick={(e) => handleDownload(selectedDownload, e)}
                                className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white rounded-xl font-medium shadow-md hover:from-[#256029] hover:to-[#388E3C] transition-all duration-300"
                            >
                                Download File
                            </button>
                        )}
                        <button
                            className="absolute top-4 right-4 text-[#1A237E] text-2xl bg-white/70 rounded-full p-2.5 hover:bg-white/90 transition-all duration-300 shadow-md"
                            onClick={() => setSelectedDownload(null)}
                        >
                            ✕
                        </button>
                    </motion.div>
                </div>
            )}

            {/* {hasMore && !loading && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white font-medium px-6 py-2.5 rounded-xl shadow-md hover:from-[#256029] hover:to-[#388E3C] hover:shadow-lg transition-all duration-300"
                    >
                        Load More
                    </button>
                </div>
            )} */}
        </div>
    );
}