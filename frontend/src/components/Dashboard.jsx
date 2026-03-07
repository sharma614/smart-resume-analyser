import React from 'react';
import Plot from 'react-plotly.js';
import { Download, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ result, onReset }) => {
    const { ats_score, skills, missing_keywords, suggestions } = result;

    const handleDownload = async () => {
        try {
            const response = await axios.post('http://localhost:8000/report', result, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume_analysis_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to download report', err);
            alert('Failed to generate report.');
        }
    };

    const categories = ["Programming Languages", "Frameworks", "Databases", "Cloud", "Data Science"];

    const rValues = categories.map(cat => (skills[cat] || []).length);
    const targetValues = categories.map(cat => Math.max(3, (skills[cat] || []).length + 2));

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">ATS Compatibility Score</h2>
                    <p className="text-gray-400">Based on keyword matching, experience, and format.</p>
                </div>
                <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-700 shadow-inner">
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-500 rotate-45 transform duration-1000"></div>
                    <span className="text-4xl font-bold text-blue-400">{ats_score}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Skills Match</h3>
                    <div className="flex justify-center -ml-5">
                        <Plot
                            data={[
                                {
                                    type: 'scatterpolar',
                                    r: rValues,
                                    theta: categories,
                                    fill: 'toself',
                                    name: 'Your Skills',
                                    marker: { color: '#3b82f6' }
                                },
                                {
                                    type: 'scatterpolar',
                                    r: targetValues,
                                    theta: categories,
                                    fill: 'toself',
                                    name: 'Required Skills',
                                    marker: { color: '#ef4444' }
                                }
                            ]}
                            layout={{
                                polar: {
                                    radialaxis: { visible: true, range: [0, Math.max(...targetValues) + 1], color: '#4b5563' },
                                    angularaxis: { color: '#9ca3af' },
                                    bgcolor: '#1f2937'
                                },
                                paper_bgcolor: 'transparent',
                                font: { color: '#e5e7eb' },
                                showlegend: true,
                                legend: { orientation: 'h', y: -0.2 },
                                margin: { l: 40, r: 40, t: 30, b: 30 },
                                width: 350,
                                height: 300
                            }}
                            config={{ displayModeBar: false }}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full">
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-red-400">Missing Keywords</h3>
                        {missing_keywords.length > 0 ? (
                            <ul className="space-y-2 mb-4">
                                {missing_keywords.map((kw, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300">
                                        <XCircle size={16} className="text-red-400" />
                                        <span className="capitalize">{kw}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> No critical missing keywords!</p>
                        )}

                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-yellow-400">Suggestions</h3>
                        <ul className="space-y-3">
                            {suggestions.map((s, i) => (
                                <li key={i} className="text-sm text-gray-400 list-disc ml-4">{s}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                >
                    <Download size={20} /> Download PDF Report
                </button>
                <button
                    onClick={onReset}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                    <RefreshCcw size={20} /> Analyze Another
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
