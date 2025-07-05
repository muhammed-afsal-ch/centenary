// app/dashboard/downloads/add/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AddDownloadPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [downloadFile, setDownloadFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!title || !description || !downloadFile || !previewImage) {
            setError('All fields, including both files, are required.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('download_link', downloadFile); // Append the actual File object
        formData.append('preview_image', previewImage); // Append the actual File object

        try {
            // Point to your Next.js API route
            const response = await fetch('/api/downloads/add', {
                method: 'POST',
                body: formData, // The browser automatically sets Content-Type: multipart/form-data
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Download added successfully!');
                setTitle('');
                setDescription('');
                setDownloadFile(null);
                setPreviewImage(null);
                // Clear file inputs
                if (document.getElementById('downloadFileInput')) {
                    document.getElementById('downloadFileInput').value = '';
                }
                if (document.getElementById('previewImageInput')) {
                    document.getElementById('previewImageInput').value = '';
                }
                router.push('/dashboard/downloads/manage');
            } else {
                setError(data.error || 'Failed to add download.');
            }
        } catch (err) {
            console.error('Client-side error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-8"
        >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Download</h2>

            {message && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
                    role="alert"
                >
                    <p className="font-bold">Success!</p>
                    <p>{message}</p>
                </motion.div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                    role="alert"
                >
                    <p className="font-bold">Error!</p>
                    <p>{error}</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-400"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-400"
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="downloadFileInput" className="block text-gray-700 text-sm font-bold mb-2">
                        Downloadable File:
                    </label>
                    <input
                        type="file"
                        id="downloadFileInput"
                        onChange={(e) => setDownloadFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">Accepted formats: PDF, DOCX, ZIP, etc.</p>
                </div>

                <div>
                    <label htmlFor="previewImageInput" className="block text-gray-700 text-sm font-bold mb-2">
                        Preview Image:
                    </label>
                    <input
                        type="file"
                        id="previewImageInput"
                        onChange={(e) => setPreviewImage(e.target.files[0])}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        accept="image/*"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">Accepted formats: JPG, PNG, GIF, etc.</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 flex items-center justify-center"
                    disabled={loading}
                >
                    {loading && (
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
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
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    )}
                    {loading ? 'Adding Download...' : 'Add Download'}
                </button>
            </form>
        </motion.div>
    );
}