import React from 'react';
import AudioPlayer from '../AudioPlayer';

const AudioSummaryPage: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Audio Summary</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's AI-Generated Summary</h2>
          <p className="text-gray-600 mb-6">
            Listen to your personalized summary of all your connected services, narrated by an AI voice.
            This audio summary includes insights from your Twitter, Reddit, Gmail, and other connected platforms.
          </p>
          
          <AudioPlayer 
            title="Daily Overview - June 10, 2024"
            subtitle="Summary of your social media and email activity"
          />
        </div>
        
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Summaries</h2>
          
          <div className="space-y-4">
            {[
              { date: 'June 9, 2024', duration: '3:45' },
              { date: 'June 8, 2024', duration: '4:12' },
              { date: 'June 7, 2024', duration: '3:24' }
            ].map((summary, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <button className="bg-indigo-100 rounded-full p-2 mr-4 text-indigo-600 hover:bg-indigo-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div>
                    <h3 className="font-medium text-gray-800">Daily Summary - {summary.date}</h3>
                    <p className="text-sm text-gray-500">Duration: {summary.duration}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AudioSummaryPage; 