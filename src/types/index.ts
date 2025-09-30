export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  code: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github';
}