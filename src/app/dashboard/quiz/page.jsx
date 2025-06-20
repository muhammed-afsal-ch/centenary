'use client';

import { useEffect, useState } from 'react';

export default function Settings() {
  const [quizAvailable, setQuizAvailable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchQuizStatus() {
      try {
        const res = await fetch('/api/quiz/available');
        const data = await res.json();

        if (!res.ok || !data.status) {
          throw new Error(data.error || 'Unexpected response');
        }

        setQuizAvailable(data.status === 'yes' ? 'yes' : 'no');
      } catch (err) {
        console.error("❌ Error fetching quiz availability:", err.message);
        setError(err.message || 'Failed to fetch quiz status');
      } finally {
        setLoading(false);
      }
    }

    fetchQuizStatus();
  }, []);

  async function toggleQuizAvailability() {
    const newStatus = quizAvailable === 'yes' ? 'no' : 'yes';

    const confirm = window.confirm(
      `Are you sure you want to turn quiz ${newStatus.toUpperCase()}?`
    );

    if (!confirm) return;

    try {
      setUpdating(true);
      const res = await fetch('/api/quiz/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update quiz status');
      }

      setQuizAvailable(newStatus);
    } catch (err) {
      alert('❌ Update failed: ' + err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Settings</h1>

      {loading ? (
        <p className="text-gray-600">Loading quiz status...</p>
      ) : error ? (
        <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">
          ⚠️ Error: {error}
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Quiz Available:</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={quizAvailable === 'yes'}
              onChange={toggleQuizAvailability}
              disabled={updating}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
          <span className="text-sm text-gray-500">
            {quizAvailable === 'yes' ? 'ON' : 'OFF'}
          </span>
        </div>
      )}
    </div>
  );
}
