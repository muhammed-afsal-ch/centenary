'use client';

import { useState } from 'react';
import AddPost from '../../../components/dashboard/AddPost';

export default function AddPostPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <div>
      <AddPost setMessage={setMessage} setError={setError} />
      {(message || error) && (
        <div className="max-w-2xl mx-auto mt-4">
          {message && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}