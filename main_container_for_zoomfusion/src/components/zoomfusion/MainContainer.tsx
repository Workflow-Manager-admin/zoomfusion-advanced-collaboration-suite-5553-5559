/**
 * MainContainer.tsx
 * Primary container for ZoomFusion: Advanced Collaboration Suite
 */
"use client";

import { useState, useEffect } from 'react';
import { MainContainerProps, Participant, CollaborationTool, MeetingInfo } from '@/types/zoomfusion';
import Header from './Header';
import Sidebar from './Sidebar';
import VideoArea from './VideoArea';
import CollaborationTools from './CollaborationTools';

// PUBLIC_INTERFACE
/**
 * Main container component for the ZoomFusion application.
 * Orchestrates the layout and state management for the video conferencing experience.
 */
export default function MainContainer({ className = '' }: MainContainerProps) {
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State for participants
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // State for active speaker
  const [activeSpeaker, setActiveSpeaker] = useState<Participant | undefined>();
  
  // State for meeting information
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | undefined>();
  
  // State for layout preference
  const [layout, setLayout] = useState<'gallery' | 'speaker' | 'sidebar'>('gallery');
  
  // Function to change layout
  const changeLayout = (newLayout: 'gallery' | 'speaker' | 'sidebar') => {
    setLayout(newLayout);
  };
  
  // State for collaboration tools
  const [collaborationTools, setCollaborationTools] = useState<CollaborationTool[]>([
    { id: '1', type: 'whiteboard', name: 'Whiteboard', icon: 'pencil', isActive: false },
    { id: '2', type: 'document', name: 'Documents', icon: 'document', isActive: false },
    { id: '3', type: 'polls', name: 'Polls', icon: 'chart-bar', isActive: false },
    { id: '4', type: 'chat', name: 'Chat', icon: 'chat', isActive: false },
    { id: '5', type: 'notes', name: 'Notes', icon: 'note', isActive: false },
    { id: '6', type: 'breakoutRooms', name: 'Breakout Rooms', icon: 'rooms', isActive: false },
  ]);
  
  // State for active collaboration tool
  const [activeTool, setActiveTool] = useState<CollaborationTool | undefined>();

  // Mock data for initial render
  useEffect(() => {
    // Sample host participant
    const host: Participant = {
      id: '1',
      name: 'John Doe',
      isHost: true,
      isSpeaking: false,
      isVideoOn: true,
      isAudioOn: true,
    };

    // Sample participants
    const sampleParticipants: Participant[] = [
      host,
      {
        id: '2',
        name: 'Jane Smith',
        isHost: false,
        isSpeaking: false,
        isVideoOn: true,
        isAudioOn: true,
      },
      {
        id: '3',
        name: 'Mike Johnson',
        isHost: false,
        isSpeaking: false,
        isVideoOn: false,
        isAudioOn: true,
      },
    ];

    // Set sample meeting info
    const sampleMeetingInfo: MeetingInfo = {
      id: 'meeting-123',
      title: 'Team Sync Meeting',
      host: host,
      participants: sampleParticipants,
      startTime: new Date(),
      isRecording: false,
    };

    setParticipants(sampleParticipants);
    setActiveSpeaker(host);
    setMeetingInfo(sampleMeetingInfo);

    // Simulate active speaker changes
    const speakerInterval = setInterval(() => {
      const speakerIndex = Math.floor(Math.random() * sampleParticipants.length);
      const newSpeaker = { ...sampleParticipants[speakerIndex], isSpeaking: true };
      setActiveSpeaker(newSpeaker);
    }, 5000);

    return () => clearInterval(speakerInterval);
  }, []);

  // Handle collaboration tool selection
  const handleToolSelect = (tool: CollaborationTool) => {
    // Update active state of all tools
    const updatedTools = collaborationTools.map(t => ({
      ...t,
      isActive: t.id === tool.id ? !t.isActive : false
    }));
    
    setCollaborationTools(updatedTools);
    
    // Set the active tool or clear if the same tool was toggled off
    const selectedTool = updatedTools.find(t => t.isActive);
    setActiveTool(selectedTool);
  };

  // Handle ending the meeting
  const handleEndMeeting = () => {
    alert('Meeting ended');
    // In a real application, would handle clean-up and navigation
  };

  return (
    <div className={`flex flex-col h-screen w-full bg-neutral-950 text-white ${className}`}>
      {/* Header with meeting controls */}
      <Header meetingInfo={meetingInfo} onEndMeeting={handleEndMeeting} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with participants and tools */}
        <Sidebar 
          participants={participants} 
          collaborationTools={collaborationTools} 
          onToolSelect={handleToolSelect} 
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Video conferencing area */}
          <VideoArea 
            participants={participants} 
            activeSpeaker={activeSpeaker} 
            layout={layout}
            onLayoutChange={changeLayout}
          />
          
          {/* Collaboration tools area - conditionally rendered when a tool is active */}
          {activeTool && (
            <CollaborationTools activeTool={activeTool} />
          )}
        </div>
      </div>
    </div>
  );
}
