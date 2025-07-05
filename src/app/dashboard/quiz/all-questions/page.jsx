'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AllQuizQuestions() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [originalData, setOriginalData] = useState(null);

    const modalRef = useRef(null);

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            try {
                const res = await fetch(`/api/quiz/allquestions?page=${page}`);
                const data = await res.json();
                if (!data.success) throw new Error(data.error);
                setQuestions(data.questions);
                setTotalPages(data.totalPages);
            } catch (err) {
                setErrorMsg(err.message || 'Failed to load questions');
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [page]);


    const openEditModal = (question) => {
        const formatted = {
            ...question,
            QUESTION_DATE: question.QUESTION_DATE?.split('T')[0],
        };
        setEditData(formatted);
        setOriginalData(formatted);
        setShowEditModal(true);
    };

    // Close on click outside modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showEditModal && modalRef.current && !modalRef.current.contains(event.target)) {
                setShowEditModal(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEditModal]);

    // Check if there are changes between originalData and editData
    const hasChanges = () => {
        return JSON.stringify(editData) !== JSON.stringify(originalData);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                code: editData.QUESTION_CODE,
                question: editData.QUESTION,
                optionA: editData.OPTION_A,
                optionB: editData.OPTION_B,
                optionC: editData.OPTION_C,
                optionD: editData.OPTION_D,
                answer: editData.ANSWER,
                date: editData.QUESTION_DATE,
                description: editData.DESCRIPTION,
            };

            const res = await fetch('/api/quiz/editquiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.success) {
                setShowEditModal(false);
                setQuestions((prev) =>
                    prev.map((q) => (q.QUESTION_CODE === editData.QUESTION_CODE ? editData : q))
                );
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const activeQuestions = questions.filter(q => {
        const questionDate = new Date(q.QUESTION_DATE).toISOString().split('T')[0];
        return questionDate === today;
    });
    const otherQuestions = questions.filter(q => q.QUESTION_DATE !== today);

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short',
        });

    const renderQuestionCard = (q, idx, isActive = false) => {
        return (
            <div
                key={q.ID}
                className={`relative p-5 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] duration-200 ease-in-out group
                bg-gradient-to-br from-green-50 via-white to-white border 
                ${isActive ? 'pulse-border' : 'border-green-200'}
            `}
            >
                <div className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-2">
                    <span>#{idx + 1}</span>
                    <span className="text-green-800 font-semibold">Code:</span> {q.QUESTION_CODE}
                    <span className="text-green-800 font-semibold">Date:</span> {formatDate(q.QUESTION_DATE)}
                    {isActive && <span className="text-green-600 text-lg animate-pulse">✅</span>}
                </div>

                <div className="anek-font">
                    <p className="font-semibold text-gray-900 text-base mb-3">{q.QUESTION}</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li><strong>A:</strong> {q.OPTION_A}</li>
                        <li><strong>B:</strong> {q.OPTION_B}</li>
                        <li><strong>C:</strong> {q.OPTION_C}</li>
                        <li><strong>D:</strong> {q.OPTION_D}</li>
                    </ul>
                    <p className="mt-3 text-sm text-green-700 font-medium">✅ Answer: {q.ANSWER}</p>
                    <p className="text-xs text-gray-600 mt-1">💡 {q.DESCRIPTION}</p>
                </div>

                <button
                    onClick={() => openEditModal(q)}
                    title="Edit this question"
                    className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition-all duration-200"
                >
                    <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-150"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                    </svg>
                </button>
            </div>
        );
    };





    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-8">
            <h2 className="text-2xl font-bold text-green-600">🧾 Quiz Questions</h2>

            {loading && <p className="text-gray-500">Loading questions...</p>}
            {errorMsg && <p className="text-red-600">❌ {errorMsg}</p>}

            {!loading && questions.length === 0 && (
                <p className="text-gray-600">No questions found.</p>
            )}

            {!loading && (
                <>
                    {activeQuestions.length > 0 ? (
                        <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold text-center text-green-700 mb-3">🌟 Active Questions (Today)</h3>
                            <div className="space-y-4">
                                {activeQuestions.map((q, idx) => renderQuestionCard(q, idx))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg text-center space-y-4">
                            <p className="text-yellow-800 text-lg font-medium">
                                ⚠️ Today's question not added yet...
                            </p>
                            <button
                                onClick={() => router.push('/dashboard/quiz/add-question')}
                                className="px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition"
                            >
                                ➕ Add Now
                            </button>
                        </div>
                    )}

                    {otherQuestions.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">📋 All Other Questions</h3>
                            <div className="space-y-4">
                                {otherQuestions.map((q, idx) => renderQuestionCard(q, idx))}
                            </div>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                disabled={page === 1}
                            >
                                ⬅️ Prev
                            </button>
                            <span className="font-semibold">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                disabled={page === totalPages}
                            >
                                Next ➡️
                            </button>
                        </div>
                    )}

                </>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-gradient-to-br from-green-100 via-white to-white p-6 rounded-lg shadow-xl max-w-lg w-full relative border border-green-300"
                    >

                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                            onClick={() => setShowEditModal(false)}
                        >
                            ❌
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
                            ✏️ Edit Quiz Question
                        </h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">

                            <textarea
                                className="w-full border border-green-300 p-2 rounded-lg"
                                placeholder="Question"
                                value={editData.QUESTION}
                                onChange={(e) => setEditData({ ...editData, QUESTION: e.target.value })}
                            />

                            {['A', 'B', 'C', 'D'].map((opt) => (
                                <input
                                    key={opt}
                                    className="w-full border border-green-300 p-2 rounded-lg"
                                    placeholder={`Option ${opt}`}
                                    value={editData[`OPTION_${opt}`]}
                                    onChange={(e) => setEditData({ ...editData, [`OPTION_${opt}`]: e.target.value })}
                                />
                            ))}

                            <select
                                className="w-full border border-green-300 p-2 rounded-lg bg-white"
                                value={editData.ANSWER}
                                onChange={(e) => setEditData({ ...editData, ANSWER: e.target.value })}
                            >
                                <option value="A">Correct Answer: A</option>
                                <option value="B">Correct Answer: B</option>
                                <option value="C">Correct Answer: C</option>
                                <option value="D">Correct Answer: D</option>
                            </select>

                            <input
                                type="date"
                                className="w-full border border-green-300 p-2 rounded-lg"
                                value={editData.QUESTION_DATE}
                                onChange={(e) => setEditData({ ...editData, QUESTION_DATE: e.target.value })}
                            />

                            <textarea
                                className="w-full border border-green-300 p-2 rounded-lg"
                                placeholder="Explanation / Description"
                                rows={3}
                                value={editData.DESCRIPTION}
                                onChange={(e) => setEditData({ ...editData, DESCRIPTION: e.target.value })}
                            />

                            <button
                                type="submit"
                                disabled={!hasChanges()}
                                className={`w-full py-2 rounded-lg text-white font-semibold transition ${hasChanges()
                                    ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800'
                                    : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                ✅ Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
