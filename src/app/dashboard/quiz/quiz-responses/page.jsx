'use client';

import { useEffect, useState } from 'react';
import React from 'react';

export default function QuizResponses() {
    const LIMIT = 20;
    const [responses, setResponses] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResponses();
    }, []);

    async function loadResponses() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/quiz/getresponses?limit=${LIMIT}&offset=${offset}`);
            const data = await res.json();

            if (!data.success) throw new Error(data.error);
            console.log("Fetched quiz responses:", data.responses);

            setResponses((prev) => [...prev, ...data.responses]);
            setOffset((prev) => prev + LIMIT);
            if (data.responses.length < LIMIT) setHasMore(false);
        } catch (err) {
            setError(err.message || 'Failed to load quiz responses');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-2xl font-bold mb-6 text-green-700">📋 Quiz Responses</h2>

            {error && (
                <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">
                    ⚠️ Error: {error}
                </div>
            )}

            {responses.length === 0 && !loading && <p>No responses found.</p>}

            {responses.length > 0 && (
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Mobile</th>
                                <th className="px-4 py-2 text-left">Location</th>
                                <th className="px-4 py-2 text-left">Mark</th>
                                <th className="px-4 py-2 text-left">Question Code</th>
                                <th className="px-4 py-2 text-left">QDate</th>
                                <th className="px-4 py-2 text-left">Timestamp</th> 
                            </tr>
                        </thead>


                        <tbody>
                            {responses.map((r, idx) => (
                                <React.Fragment key={idx}>
                                    <tr className="hover:bg-green-50 transition-colors even:bg-gradient-to-r even:from-white even:to-green-50">
                                        <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                        <td className="px-4 py-2 text-sm">{r.name || '-'}</td>
                                        <td className="px-4 py-2 text-sm">{r.mobile}</td>
                                        <td className="px-4 py-2 text-sm">
                                            {r.place || "Unknown Place"} &nbsp; | &nbsp; 🏷️ PIN: {r.pincode || "----"}
                                        </td>
                                        <td className="px-4 py-2 text-sm">{r.mark}</td>
                                        <td className="px-4 py-2 text-sm">{r.question_code}</td>
                                        <td className="px-4 py-2 text-sm">
                                            {new Date(r.date).toLocaleDateString()} 
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {new Date(r.created_at).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>


                    </table>
                </div>
            )}

            {loading && <p className="text-gray-500 mt-4">Loading...</p>}

            {hasMore && !loading && (
                <div className="mt-4 text-center">
                    <button
                        onClick={loadResponses}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all shadow-md"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
