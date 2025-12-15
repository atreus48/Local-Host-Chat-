export interface UserIdentity {
  id: string; // UUID
  nickname: string;
  publicKey: string; // PEM format or JWK string
  privateKey?: string; // Stored only locally
  avatarColor: string;
}

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED'
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string; // Encrypted string in transit, Decrypted in memory
  timestamp: number;
  status: MessageStatus;
  type: 'text' | 'image' | 'file';
  isMe: boolean;
}

export interface ChatSession {
  id: string; // Peer ID
  peerNickname: string;
  peerAvatarColor: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  isOnline: boolean;
  encryptionKey?: string; // Symmetric key for this session (simulated for demo)
}

export enum AppRoute {
  ONBOARDING = 'onboarding',
  HOME = 'home',
  CHAT = 'chat',
  SETTINGS = 'settings',
  PAIRING = 'pairing'
}

export interface ConnectionState {
  isLanAvailable: boolean;
  isRelayConnected: boolean;
}