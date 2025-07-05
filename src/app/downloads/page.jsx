'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Downloads from '../../components/Downloads'; // Adjust path based on your folder structure

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true); // For pagination if implemented

    useEffect(() => {
        // In a real application, you'd fetch the login status from an authentication context or API
      

        const fetchDownloads = async () => {
            try {
                setLoading(true);
                // Ensure NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_PASS are correctly set in your .env file
                const response = await axios.get(
                    `/api/downloads/all`,
                    { headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_PASS } }
                );
                setDownloads(response.data);
                setHasMore(false); // Assuming all downloads are fetched initially
            } catch (err) {
                console.error('Error fetching downloads:', err);
                setError('Failed to load downloads. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDownloads();
    }, []);

    const handleDownloadDelete = (deletedDownloadId) => {
        setDownloads((prevDownloads) =>
            prevDownloads.filter((download) => download.DOWNLOAD_ID !== deletedDownloadId)
        );
    };

    const loadMoreDownloads = () => {
        // Implement logic to load more downloads (pagination)
        console.log('Load more downloads functionality to be implemented.');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-[#1A237E]">
                Loading downloads...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Downloads
                    downloads={downloads}
                   
                    onDownloadDelete={handleDownloadDelete}
                    loadMore={loadMoreDownloads}
                    hasMore={hasMore}
                    loading={loading}
                />
            </div>
        </div>
    );
}