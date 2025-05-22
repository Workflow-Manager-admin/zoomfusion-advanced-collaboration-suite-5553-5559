/**
 * Header.tsx
 * Header component for ZoomFusion containing meeting information and controls
 */
"use client";

import { HeaderProps } from '@/types/zoomfusion';

// PUBLIC_INTERFACE
/**
 * Header component displaying meeting information and primary controls.
 */
export default function Header({ meetingInfo, onEndMeeting }: HeaderProps) {
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format meeting duration
  const getMeetingDuration = () => {
    if (!meetingInfo) return '00:00';
    
    const now = new Date();
    const diffInMs = now.getTime() - meetingInfo.startTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return (
    <header className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-neutral-800">
      {/* Left side - Meeting info */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">
            {meetingInfo?.title || 'ZoomFusion Meeting'}
          </h1>
          <div className="flex text-sm text-neutral-400 space-x-4">
            <span>ID: {meetingInfo?.id || 'N/A'}</span>
            <span>Started: {meetingInfo ? formatTime(meetingInfo.startTime) : 'N/A'}</span>
            <span>Duration: {getMeetingDuration()}</span>
          </div>
        </div>
      </div>
      
      {/* Center - Recording indicator */}
      {meetingInfo?.isRecording && (
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
          <span className="text-sm text-red-500">Recording</span>
        </div>
      )}
      
      {/* Right side - Controls */}
      <div className="flex space-x-3">
        <button className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12 0a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        <button className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.5 1a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
        <button 
          onClick={onEndMeeting}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          End Meeting
        </button>
      </div>
    </header>
  );
}
