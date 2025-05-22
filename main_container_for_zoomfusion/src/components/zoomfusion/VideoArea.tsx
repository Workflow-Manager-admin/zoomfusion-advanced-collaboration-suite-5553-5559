/**
 * VideoArea.tsx
 * Component for displaying video streams from participants
 */
"use client";

import { useEffect, useRef } from 'react';
import { VideoAreaProps, Participant } from '@/types/zoomfusion';

// PUBLIC_INTERFACE
/**
 * VideoArea component for displaying participant video streams.
 * Supports different layout modes: gallery, speaker, and sidebar.
 */
export default function VideoArea({ participants, activeSpeaker, layout }: VideoAreaProps) {
  return (
    <div className="flex-1 bg-neutral-950 p-2 overflow-hidden">
      {/* Layout controls */}
      <div className="flex justify-end mb-2 space-x-2">
        <button 
          className={`p-1.5 rounded ${layout === 'gallery' ? 'bg-sky-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}
          title="Gallery View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button 
          className={`p-1.5 rounded ${layout === 'speaker' ? 'bg-sky-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}
          title="Speaker View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        </button>
        <button 
          className={`p-1.5 rounded ${layout === 'sidebar' ? 'bg-sky-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}
          title="Sidebar View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className={`h-full w-full ${getLayoutClass(layout)}`}>
        {layout === 'speaker' && activeSpeaker ? (
          <>
            <ActiveSpeakerView participant={activeSpeaker} />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {participants
                .filter(p => p.id !== activeSpeaker.id)
                .map(participant => (
                  <ThumbnailView key={participant.id} participant={participant} />
                ))}
            </div>
          </>
        ) : (
          participants.map(participant => (
            <ParticipantVideo 
              key={participant.id} 
              participant={participant} 
              isActive={activeSpeaker?.id === participant.id}
              layout={layout}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Helper function to determine layout class
function getLayoutClass(layout: string): string {
  switch (layout) {
    case 'speaker':
      return 'relative';
    case 'sidebar':
      return 'flex flex-col space-y-2';
    case 'gallery':
    default:
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2';
  }
}

// Component for displaying an individual participant's video
function ParticipantVideo({ participant, isActive, layout }: { participant: Participant; isActive: boolean; layout: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Connect video stream to video element
  useEffect(() => {
    if (videoRef.current && participant.videoStream) {
      videoRef.current.srcObject = participant.videoStream;
    }
  }, [participant.videoStream]);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${
        isActive ? 'ring-2 ring-sky-500' : ''
      } ${
        layout === 'sidebar' ? 'h-1/3' : 'h-full'
      }`}
    >
      {participant.isVideoOn ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted={!participant.isAudioOn} 
          className="w-full h-full object-cover bg-neutral-800"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
          <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center text-3xl">
            {participant.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white">{participant.name}</span>
            {participant.isHost && (
              <span className="ml-2 bg-sky-500 text-white text-xs px-1 rounded">Host</span>
            )}
            {participant.isSpeaking && (
              <span className="ml-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          
          <div className="flex space-x-1">
            {!participant.isAudioOn && (
              <span className="p-1 bg-red-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {!participant.isVideoOn && (
              <span className="p-1 bg-red-600 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for displaying the active speaker in speaker view
function ActiveSpeakerView({ participant }: { participant: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Connect video stream to video element
  useEffect(() => {
    if (videoRef.current && participant.videoStream) {
      videoRef.current.srcObject = participant.videoStream;
    }
  }, [participant.videoStream]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      {participant.isVideoOn ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted={!participant.isAudioOn} 
          className="w-full h-full object-cover bg-neutral-800"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
          <div className="w-32 h-32 rounded-full bg-neutral-700 flex items-center justify-center text-5xl">
            {participant.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white text-lg">{participant.name}</span>
            {participant.isHost && (
              <span className="ml-2 bg-sky-500 text-white text-xs px-1 rounded">Host</span>
            )}
            {participant.isSpeaking && (
              <span className="ml-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for thumbnail views in speaker layout
function ThumbnailView({ participant }: { participant: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Connect video stream to video element
  useEffect(() => {
    if (videoRef.current && participant.videoStream) {
      videoRef.current.srcObject = participant.videoStream;
    }
  }, [participant.videoStream]);

  return (
    <div className="w-24 h-16 rounded overflow-hidden">
      {participant.isVideoOn ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover bg-neutral-800"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
          <div className="text-sm">
            {participant.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      {!participant.isAudioOn && (
        <div className="absolute bottom-0 right-0 p-0.5 bg-red-600 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
