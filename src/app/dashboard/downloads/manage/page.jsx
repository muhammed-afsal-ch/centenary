// app/dashboard/downloads/manage/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ManageDownloads({ onDownloadDelete }) {
    const [downloads, setDownloads] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDownload, setSelectedDownload] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [downloadToDelete, setDownloadToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const loadMoreRef = useRef(null);
    const modalRef = useRef(null);

    const fetchDownloads = async (page, isRefreshing = false, search = searchQuery) => {
        if (!isRefreshing && loadingMore) return;

        try {
            if (isRefreshing) {
                setLoading(true);
                setPageNum(1);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            const { data } = await axios.get(`/api/downloads/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
            const newDownloads = Array.isArray(data) ? data : (data.downloads || []);
            setDownloads((prevDownloads) => (isRefreshing ? newDownloads : [...prevDownloads, ...newDownloads]));

            if (newDownloads.length < limit) setHasMore(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch downloads.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const confirmDelete = (downloadId) => {
        setDownloadToDelete(downloadId);
        setShowConfirmModal(true);
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setDownloadToDelete(null);
    };

    const deleteDownload = async () => {
        if (!downloadToDelete) return;

        setIsDeleting(downloadToDelete);
        setShowConfirmModal(false);

        try {
            const response = await axios.post('/api/downloads/delete', { downloadId: downloadToDelete });
            setDownloads((prevDownloads) => prevDownloads.filter((download) => download.DOWNLOAD_ID !== downloadToDelete));
            setNotification({ type: 'success', message: response.data.message });
            if (onDownloadDelete) onDownloadDelete(downloadToDelete);
        } catch (error) {
            setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to delete download' });
        } finally {
            setIsDeleting(null);
            setDownloadToDelete(null);
        }
    };

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
            alert('Failed to download file.');
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
            setIsEditing(false);
            setEditFormData(null);
        }
    };

    const handleEdit = (download) => {
        setEditFormData({
            DOWNLOAD_ID: download.DOWNLOAD_ID || '',
            TITLE: download.TITLE || '',
            DESCRIPTION: download.DESCRIPTION || '',
            PREVIEW_IMAGE: download.PREVIEW_IMAGE || 'https://via.placeholder.com/640x360',
            DOWNLOAD_LINK: download.DOWNLOAD_LINK || '',
            LAST_UPDATED: download.LAST_UPDATED || new Date().toISOString(),
        });
        setIsEditing(true);
        setSelectedDownload(download);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => {
            const newData = { ...prev, [name]: value };
            console.log('Updated editFormData:', newData); // Debug log
            return newData;
        });
    };

    const saveEdit = async () => {
        if (!editFormData) return;
        const { DOWNLOAD_ID, TITLE, DESCRIPTION, PREVIEW_IMAGE, DOWNLOAD_LINK, LAST_UPDATED } = editFormData;
        console.log('Submitting editFormData:', editFormData); // Debug log
        if (!DOWNLOAD_ID || !TITLE || !DESCRIPTION || !PREVIEW_IMAGE || !DOWNLOAD_LINK) {
            setNotification({ type: 'error', message: 'All fields are required' });
            return;
        }
        try {
            // Convert keys to lowercase to match server expectations
            const payload = {
                downloadId: DOWNLOAD_ID,
                title: TITLE,
                description: DESCRIPTION,
                previewImage: PREVIEW_IMAGE || 'https://via.placeholder.com/640x360', // Fallback to valid URL
                downloadLink: DOWNLOAD_LINK,
                lastUpdated: LAST_UPDATED,
            };
            const response = await axios.patch('/api/downloads/edit', payload);
            setDownloads((prevDownloads) =>
                prevDownloads.map((download) =>
                    download.DOWNLOAD_ID === payload.downloadId ? { ...download, ...payload } : download
                )
            );
            setNotification({ type: 'success', message: response.data.message });
            setIsEditing(false);
            setEditFormData(null);
            setSelectedDownload(null);
        } catch (error) {
            setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to update download' });
        }
    };

    useEffect(() => {
        fetchDownloads(pageNum, true);
        setIsLogged(!!process.env.NEXT_PUBLIC_API_PASS);
    }, [searchQuery]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPageNum((prevPage) => prevPage + 1);
                    fetchDownloads(pageNum + 1, false, searchQuery);
                }
            },
            { threshold: 0.5 }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
        };
    }, [pageNum, hasMore, loadingMore, searchQuery]);

    useEffect(() => {
        if (selectedDownload || isEditing) {
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
    }, [selectedDownload, isEditing]);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const openPopup = (download) => setSelectedDownload(download);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#1A237E] to-[#2E7D32] bg-clip-text text-transparent"
            >
                Manage Downloads
            </motion.h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-6 shadow-sm">{error}</div>
            )}

            {notification && (
                <div
                    className={`p-4 rounded-lg mb-6 shadow-sm flex justify-between items-center ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                >
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="text-sm font-semibold hover:underline">
                        Dismiss
                    </button>
                </div>
            )}

            {downloads.length === 0 && !loading && !error && (
                <p className="text-center text-[#1A237E]/70 text-lg py-6 bg-white/30 backdrop-blur-md rounded-xl shadow-sm">
                    {searchQuery ? 'No matching downloads found' : 'No downloads found.'}
                </p>
            )}

            {downloads.length > 0 && (
                <div
                    className="overflow-x-auto rounded-xl shadow-lg"
                    style={{ background: 'linear-gradient(to bottom, #e6f4ea, #ffffff)', border: '1px solid #d1e7dd' }}
                >
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-green-100 text-green-800 uppercase text-xs font-semibold">
                                <th className="px-6 py-4 text-left rounded-tl-xl">Thumbnail</th>
                                <th className="px-6 py-4 text-left">Title</th>
                                <th className="px-6 py-4 text-left rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {downloads.map((download, index) => {
                                const isLastRow = index === downloads.length - 1;

                                return (
                                    <tr key={index} className="bg-white hover:bg-green-50 transition-colors duration-200">
                                        <td className={`px-6 py-4 whitespace-nowrap ${isLastRow ? 'rounded-bl-xl' : ''}`}>
                                            {download.PREVIEW_IMAGE ? (
                                                <img
                                                    src={download.PREVIEW_IMAGE}
                                                    alt="Thumbnail"
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/48')}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-600 text-xs rounded-full border-2 border-green-200">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <div className="line-clamp-2 text-gray-800">{download.TITLE}</div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${isLastRow ? 'rounded-br-xl' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => openPopup(download)}
                                                    className="text-green-600 hover:text-green-800 transition-colors p-2 rounded-full bg-green-100 hover:bg-green-200"
                                                    title="View Download"
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
                                                    onClick={() => handleEdit(download)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full bg-blue-100 hover:bg-blue-200"
                                                    title="Edit Download"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(download.DOWNLOAD_ID)}
                                                    disabled={isDeleting === download.DOWNLOAD_ID}
                                                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full bg-red-100 hover:bg-red-200 disabled:opacity-50"
                                                    title="Delete Download"
                                                >
                                                    {isDeleting === download.DOWNLOAD_ID ? (
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
                <div ref={loadMoreRef} className="flex justify-center mt-8">
                    {loadingMore ? (
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
                    ) : (
                        <button
                            onClick={() => setPageNum((prevPage) => prevPage + 1)}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                        >
                            Load More
                        </button>
                    )}
                </div>
            )}

            {selectedDownload && (
                <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            filter: 'blur(10px) brightness(0.5)',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        }}
                    />
                    <div className="absolute inset-0 bg-opacity-40 backdrop-blur-sm" onClick={handleClickOutside}></div>
                    <div ref={modalRef} className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <button
                            onClick={() => {
                                setSelectedDownload(null);
                                setIsEditing(false);
                                setEditFormData(null);
                            }}
                            className="absolute top-4 right-4 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors rounded-full p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {!isEditing ? (
                            <>
                                {selectedDownload.PREVIEW_IMAGE ? (
                                    <img
                                        src={selectedDownload.PREVIEW_IMAGE}
                                        alt="Download Preview"
                                        className="rounded-lg w-full object-cover"
                                        style={{ width: 640 - 16, height: (640 - 16) / (16 / 9) }}
                                        onError={(e) => (e.target.src = 'https://via.placeholder.com/640x360')}
                                    />
                                ) : (
                                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
                                        No Preview Image
                                    </div>
                                )}
                                <div className="relative mt-4 max-w-md w-full">
                                    <p className="text-white bg-black bg-opacity-60 p-3 rounded-lg text-center shadow-md">
                                        {selectedDownload.TITLE}
                                    </p>
                                    <p className="text-white bg-black bg-opacity-60 p-3 rounded-lg text-center shadow-md mt-2">
                                        {selectedDownload.DESCRIPTION}
                                    </p>
                                </div>
                                {isLogged && (
                                    <button
                                        onClick={() => handleEdit(selectedDownload)}
                                        className="mt-4 w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Edit Download
                                    </button>
                                )}
                                {isLogged && (
                                    <button
                                        onClick={() => confirmDelete(selectedDownload.DOWNLOAD_ID)}
                                        disabled={isDeleting === selectedDownload.DOWNLOAD_ID}
                                        className="mt-2 w-full py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isDeleting === selectedDownload.DOWNLOAD_ID ? 'Deleting...' : 'Delete Download'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="TITLE"
                                    value={editFormData?.TITLE || ''}
                                    onChange={handleFormChange}
                                    placeholder="Title"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    name="DESCRIPTION"
                                    value={editFormData?.DESCRIPTION || ''}
                                    onChange={handleFormChange}
                                    placeholder="Description"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="PREVIEW_IMAGE"
                                    value={editFormData?.PREVIEW_IMAGE || ''}
                                    onChange={handleFormChange}
                                    placeholder="Preview Image URL (e.g., https://via.placeholder.com/640x360)"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    name="DOWNLOAD_LINK"
                                    value={editFormData?.DOWNLOAD_LINK || ''}
                                    onChange={handleFormChange}
                                    placeholder="Download Link (e.g., https://example.com/file.pdf)"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                               
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditFormData(null);
                                        }}
                                        className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            filter: 'blur(10px) brightness(0.5)',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        }}
                    />
                    <div className="absolute inset-0 bg-opacity-40 backdrop-blur-sm" onClick={cancelDelete}></div>
                    <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this download? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={deleteDownload}
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