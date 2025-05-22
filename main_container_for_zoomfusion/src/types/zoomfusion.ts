/**
 * Types for the ZoomFusion: Advanced Collaboration Suite application
 */

// Participant in a video conference
export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isSpeaking: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  videoStream?: MediaStream;
}

// Current meeting information
export interface MeetingInfo {
  id: string;
  title: string;
  host: Participant;
  participants: Participant[];
  startTime: Date;
  isRecording: boolean;
}

// Available collaboration tools
export type CollaborationToolType = 
  | 'whiteboard'
  | 'document'
  | 'polls'
  | 'chat'
  | 'notes'
  | 'breakoutRooms';

// Collaboration tool item
export interface CollaborationTool {
  id: string;
  type: CollaborationToolType;
  name: string;
  icon: string;
  isActive: boolean;
}

// User settings for the application
export interface UserSettings {
  preferredVideoInput?: string;
  preferredAudioInput?: string;
  preferredAudioOutput?: string;
  defaultMuteVideo: boolean;
  defaultMuteAudio: boolean;
  showParticipantNames: boolean;
  useVirtualBackground: boolean;
  virtualBackgroundUrl?: string;
  enableNoiseReduction: boolean;
  layoutPreference: 'gallery' | 'speaker' | 'sidebar';
}

// Props for the main container component
export interface MainContainerProps {
  className?: string;
}

// Props for header component
export interface HeaderProps {
  meetingInfo?: MeetingInfo;
  onEndMeeting?: () => void;
}

// Props for sidebar component
export interface SidebarProps {
  participants: Participant[];
  collaborationTools: CollaborationTool[];
  onToolSelect: (tool: CollaborationTool) => void;
}

// Props for video area component
export interface VideoAreaProps {
  participants: Participant[];
  activeSpeaker?: Participant;
  layout: 'gallery' | 'speaker' | 'sidebar';
}

// Props for collaboration tools component
export interface CollaborationToolsProps {
  activeTool?: CollaborationTool;
}
