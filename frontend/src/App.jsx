import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Dashboard from './components/Dashboard';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError('Please provide both a PDF resume and a job description.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Smart Resume Analyzer</h1>

        {!result ? (
          <div className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
              <textarea
                className="w-full h-40 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 resize-none"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF)</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/50'}`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <p className="text-blue-400 font-semibold">{file.name}</p>
                ) : (
                  <p className="text-gray-400">
                    <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop<br />
                    PDF up to 10MB
                  </p>
                )}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg font-semibold transition-colors flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : 'Analyze Resume'}
            </button>
          </div>
        ) : (
          <Dashboard result={result} onReset={() => setResult(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
