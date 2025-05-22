/**
 * Sidebar.tsx
 * Sidebar component with participants list and collaboration tools
 */
"use client";

import { useState } from 'react';
import { SidebarProps, Participant, CollaborationTool } from '@/types/zoomfusion';

// PUBLIC_INTERFACE
/**
 * Sidebar component displaying participants and available collaboration tools.
 */
export default function Sidebar({ participants, collaborationTools, onToolSelect }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'participants' | 'tools'>('participants');
  
  return (
    <aside className="w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      {/* Tab navigation */}
      <div className="flex border-b border-neutral-800">
        <button 
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'participants' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-neutral-400 hover:text-white'}`}
          onClick={() => setActiveTab('participants')}
        >
          Participants ({participants.length})
        </button>
        <button 
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'tools' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-neutral-400 hover:text-white'}`}
          onClick={() => setActiveTab('tools')}
        >
          Tools
        </button>
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'participants' ? (
          <ParticipantsList participants={participants} />
        ) : (
          <ToolsList tools={collaborationTools} onToolSelect={onToolSelect} />
        )}
      </div>
    </aside>
  );
}

// Component for rendering the participants list
function ParticipantsList({ participants }: { participants: Participant[] }) {
  return (
    <div className="p-2">
      <div className="sticky top-0 bg-neutral-900 py-2 mb-2 flex justify-between items-center">
        <h3 className="font-medium">Participants</h3>
        <button className="text-xs text-neutral-400 hover:text-white">
          Invite
        </button>
      </div>
      
      <ul className="space-y-2">
        {participants.map(participant => (
          <li 
            key={participant.id}
            className={`flex items-center justify-between p-2 rounded ${participant.isSpeaking ? 'bg-neutral-800' : 'hover:bg-neutral-800'} transition-colors`}
          >
            <div className="flex items-center">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                  {participant.isVideoOn ? (
                    <span>👤</span>
                  ) : (
                    participant.name.charAt(0).toUpperCase()
                  )}
                </div>
                {participant.isSpeaking && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              <div className="ml-2">
                <p>{participant.name} {participant.isHost && <span className="text-xs text-sky-400">(Host)</span>}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button className={`p-1 rounded-full ${participant.isAudioOn ? 'bg-neutral-700' : 'bg-red-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
              <button className={`p-1 rounded-full ${participant.isVideoOn ? 'bg-neutral-700' : 'bg-red-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12 0a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component for rendering the tools list
function ToolsList({ tools, onToolSelect }: { tools: CollaborationTool[], onToolSelect: (tool: CollaborationTool) => void }) {
  return (
    <div className="p-2">
      <div className="sticky top-0 bg-neutral-900 py-2 mb-2">
        <h3 className="font-medium">Collaboration Tools</h3>
      </div>
      
      <ul className="space-y-1">
        {tools.map(tool => (
          <li key={tool.id}>
            <button 
              onClick={() => onToolSelect(tool)}
              className={`w-full text-left p-3 rounded flex items-center space-x-3 transition-colors ${tool.isActive ? 'bg-sky-600 hover:bg-sky-700' : 'hover:bg-neutral-800'}`}
            >
              <ToolIcon type={tool.type} />
              <span>{tool.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component for rendering tool icons
function ToolIcon({ type }: { type: string }) {
  // Simple icon mapping
  switch (type) {
    case 'whiteboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
    case 'document':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    case 'polls':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      );
    case 'chat':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      );
    case 'notes':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
        </svg>
      );
    case 'breakoutRooms':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
}
