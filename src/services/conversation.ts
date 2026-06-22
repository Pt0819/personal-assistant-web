import { api } from './client';
import type { Conversation, Message, ChatRequest } from '@/types';

export async function fetchConversations(): Promise<Conversation[]> {
  return api.get<Conversation[]>('/conversations');
}

export async function fetchConversation(id: number): Promise<Conversation> {
  return api.get<Conversation>(`/conversations/${id}`);
}

export async function createConversation(): Promise<Conversation> {
  return api.post<Conversation>('/conversations');
}

export async function fetchMessages(conversationId: number): Promise<Message[]> {
  return api.get<Message[]>(`/conversations/${conversationId}/messages`);
}

export async function sendMessage(
  conversationId: number,
  req: ChatRequest,
): Promise<Message> {
  return api.post<Message>(`/conversations/${conversationId}/messages`, req);
}
