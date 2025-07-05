'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import PostCard from './PostCard'; // Adjust the import path as needed

export default function ManageUpdates({ onUpdateDelete }) {
    const [updates, setUpdates] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [updateToDelete, setUpdateToDelete] = useState(null);
    const [notification, setNotification] = useState(null);

    const loadMoreRef = useRef(null);

    const fetchUpdates = async (page, isRefreshing = false, search = searchQuery) => {
        if (!isRefreshing && loadingMore) return;

        try {
            if (isRefreshing) {
                setLoading(true);
                setPageNum(1);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            const { data } = await axios.get(
                `/api/updates/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
            );

            const newUpdates = Array.isArray(data) ? data : (data.updates || []);
            setUpdates((prevUpdates) => {
                const updatedUpdates = isRefreshing ? newUpdates : [...prevUpdates, ...newUpdates];
                return updatedUpdates;
            });

            if (newUpdates.length < limit) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching updates:', err);
            setError(err.response?.data?.error || 'Failed to fetch updates.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const confirmDelete = (updateId) => {
        setUpdateToDelete(updateId);
        setShowConfirmModal(true);
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setUpdateToDelete(null);
    };

    const deleteUpdate = async () => {
        if (!updateToDelete) return;

        setIsDeleting(updateToDelete);
        setShowConfirmModal(false);

        try {
            const response = await axios.post('/api/updates/delete', { updateId: updateToDelete });

            setUpdates((prevUpdates) => prevUpdates.filter((update) => update.POST_ID !== updateToDelete));
            setNotification({ type: 'success', message: response.data.message });

            if (onUpdateDelete) {
                onUpdateDelete(updateToDelete);
            }
        } catch (error) {
            console.error('Error deleting update:', error);
            setNotification({ type: 'error', message: error.response?.data?.error || 'Failed to delete update' });
        } finally {
            setIsDeleting(null);
            setUpdateToDelete(null);
        }
    };

    useEffect(() => {
        fetchUpdates(pageNum, true);
    }, [searchQuery]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPageNum((prevPage) => prevPage + 1);
                    fetchUpdates(pageNum + 1, false, searchQuery);
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
    }, [pageNum, hasMore, loadingMore, searchQuery]);

    const openPopup = (update) => {
        setSelectedUpdate(update);
    };

    const closePopup = () => {
        setSelectedUpdate(null);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-green-800 mb-8">Manage Updates</h1>

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
                <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-6 shadow-sm">
                    {error}
                </div>
            )}

            {/* Success/Error Notification */}
            {notification && (
                <div
                    className={`p-4 rounded-lg mb-6 shadow-sm flex justify-between items-center ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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

            {updates.length === 0 && !loading && !error && (
                <p className="text-gray-600 text-center py-6">
                    {searchQuery ? 'No matching updates found' : 'No updates found.'}
                </p>
            )}

            {updates.length > 0 && (
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
                            {updates.map((update, index) => {
                                let thumbnail = [];
                                try {
                                    thumbnail = JSON.parse(update.IMAGEURL) || [];
                                } catch (e) {
                                    console.error('Error parsing IMAGEURL for update', update.POST_ID, ':', update.IMAGEURL);
                                    thumbnail = [];
                                }

                                const isLastRow = index === updates.length - 1;

                                return (
                                    <tr
                                        key={index}
                                        className="bg-white hover:bg-green-50 transition-colors duration-200"
                                    >
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap ${isLastRow ? 'rounded-bl-xl' : ''
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
                                            <div className="line-clamp-2 text-gray-800">{update.CAPTION}</div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${isLastRow ? 'rounded-br-xl' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => openPopup(update)}
                                                    className="text-green-600 hover:text-green-800 transition-colors"
                                                    title="View Update"
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
                                                    onClick={() => confirmDelete(update.POST_ID)}
                                                    disabled={isDeleting === update.POST_ID}
                                                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                                    title="Delete Update"
                                                >
                                                    {isDeleting === update.POST_ID ? (
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
            {/* Modal for viewing update */}
            {selectedUpdate && (
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
                    <div className="absolute inset-0 bg-opacity-40 backdrop-blur-sm" onClick={closePopup}></div>
                    <div className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors rounded-full p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {(() => {
                            let thumbnail = [];
                            try {
                                thumbnail = JSON.parse(selectedUpdate.IMAGEURL) || [];
                            } catch (e) {
                                console.error('Error parsing IMAGEURL for modal', selectedUpdate.POST_ID, ':', selectedUpdate.IMAGEURL);
                                thumbnail = [];
                            }
                            const screenWidth = 640;
                            const paddingHorizontal = 16;
                            const adjustedWidth = screenWidth - paddingHorizontal;
                            const aspectRatio = 16 / 9;
                            const normalHeight = selectedUpdate.videoheight || (adjustedWidth / aspectRatio);
                            return selectedUpdate.video ? (
                                <video
                                    src={selectedUpdate.video}
                                    style={{ width: adjustedWidth, height: normalHeight }}
                                    className="rounded-lg w-full"
                                    controls
                                    autoPlay
                                />
                            ) : thumbnail.length > 0 ? (
                                <img
                                    src={thumbnail[0]}
                                    alt="Update"
                                    style={{ width: adjustedWidth, height: normalHeight }}
                                    className="rounded-lg w-full object-cover"
                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/640x360')}
                                />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600">
                                    Text Only Update
                                </div>
                            );
                        })()}
                    </div>
                    <div className="relative mt-4 max-w-md w-full">
                        <p className="text-white bg-black bg-opacity-60 p-3 rounded-lg text-center shadow-md">
                            {selectedUpdate.CAPTION}
                        </p>
                    </div>
                </div>
            )}
            {/* Confirmation Modal for Deletion */}
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
                            Are you sure you want to delete this update? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={deleteUpdate}
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