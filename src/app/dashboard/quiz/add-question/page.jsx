'use client';

import { useState } from 'react';

export default function AddQuestionPage() {
  const [form, setForm] = useState({
    code: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: 'A',
    date: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/quiz/addquestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setSuccessMsg('✅ Question added successfully!');
      setForm({
        code: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: 'A',
        date: '',
        description: ''
      });
    } catch (err) {
      setErrorMsg('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-2xl mx-auto border border-green-200 bg-gradient-to-br from-green-50 via-white to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
    <h2 className="text-xl font-bold mb-4 text-green-700">📝 Add New Quiz Question</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="code"
        value={form.code}
        onChange={handleChange}
        placeholder="Question Code eg: SAM003"
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
      />

      <textarea
        name="question"
        value={form.question}
        onChange={handleChange}
        placeholder="Question"
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
      />

      <input
        name="optionA"
        value={form.optionA}
        onChange={handleChange}
        placeholder="Option A"
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      />
      <input
        name="optionB"
        value={form.optionB}
        onChange={handleChange}
        placeholder="Option B"
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      />
      <input
        name="optionC"
        value={form.optionC}
        onChange={handleChange}
        placeholder="Option C"
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      />
      <input
        name="optionD"
        value={form.optionD}
        onChange={handleChange}
        placeholder="Option D"
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      />

      <select
        name="answer"
        value={form.answer}
        onChange={handleChange}
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      >
        <option value="A">Correct Answer: A</option>
        <option value="B">Correct Answer: B</option>
        <option value="C">Correct Answer: C</option>
        <option value="D">Correct Answer: D</option>
      </select>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Explanation / Description"
        className="w-full border border-green-100 bg-white p-2 rounded shadow-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200 shadow-sm"
      >
        {loading ? 'Submitting...' : '➕ Add Question'}
      </button>
    </form>

    {successMsg && <p className="text-green-700 mt-4 font-medium">{successMsg}</p>}
    {errorMsg && <p className="text-red-600 mt-4 font-medium">{errorMsg}</p>}
  </div>
);

}
