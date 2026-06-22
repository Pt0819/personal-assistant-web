import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchConversations,
  createConversation,
  fetchMessages,
  sendMessage,
} from '@/services/conversation';
import type { Message, Conversation } from '@/types';

export function useChat() {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    staleTime: 30_000,
  });

  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: () => (activeConversationId ? fetchMessages(activeConversationId) : Promise.resolve([])),
    enabled: activeConversationId !== null,
    staleTime: 30_000,
  });

  const startConversation = useMutation({
    mutationFn: createConversation,
    onSuccess: (conv: Conversation) => {
      setActiveConversationId(conv.id);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const send = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
      sendMessage(conversationId, { content }),
    onMutate: async ({ conversationId, content }) => {
      const optimisticMsg: Message = {
        id: Date.now(),
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData<Message[]>(['messages', conversationId], (old) => [...(old || []), optimisticMsg]);
    },
    onSuccess: (assistantMsg: Message, { conversationId }) => {
      queryClient.setQueryData<Message[]>(['messages', conversationId], (old) => [...(old || []), assistantMsg]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (assistantMsg.parsed_intent) {
        queryClient.invalidateQueries({ queryKey: ['schedules'] });
      }
    },
  });

  const handleSend = useCallback(
    async (content: string) => {
      let convId = activeConversationId;
      if (!convId) {
        const conv = await startConversation.mutateAsync();
        convId = conv.id;
      }
      setIsStreaming(true);
      try {
        await send.mutateAsync({ conversationId: convId, content });
      } finally {
        setIsStreaming(false);
      }
    },
    [activeConversationId, startConversation, send],
  );

  return {
    conversations, conversationsLoading, conversationsError,
    messages, messagesLoading, messagesError,
    activeConversationId, isStreaming,
    isSending: send.isPending, sendError: send.error,
    setActiveConversationId, sendMessage: handleSend,
  };
}
