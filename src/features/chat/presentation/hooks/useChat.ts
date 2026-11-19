import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';
import { ChatRepositoryImpl } from '../../data/repositories/ChatRepositoryImpl';
import { Message } from '../../domain/entities/Message';
import { SendMessageUseCase } from '../../domain/usecases/SendMessageUseCase';

// Inyección de dependencias: el hook construye el grafo de objetos
const sendMessageUseCase = new SendMessageUseCase(new ChatRepositoryImpl());

// Limpia símbolos de Markdown para que la voz suene natural
const cleanMarkdownForSpeech = (text: string): string => {
  return text
    .replace(/```[\s\S]*?```/g, ' bloque de código ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#*_~>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Detiene la voz si el componente se desmonta
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
    setSpeakingMessageId(null);
  }, []);

  const speakMessage = useCallback((message: Message) => {
    // Si ya está leyendo este mismo mensaje, lo detiene
    if (speakingMessageId === message.id) {
      stopSpeaking();
      return;
    }

    Speech.stop();
    const cleanText = cleanMarkdownForSpeech(message.content);
    setSpeakingMessageId(message.id);

    Speech.speak(cleanText, {
      language: 'es-ES', // Puedes usar 'es-MX' o 'es-EC' según las voces de tu dispositivo
      pitch: 1.0,
      rate: 1.0,
      onDone: () => setSpeakingMessageId(null),
      onStopped: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  }, [speakingMessageId, stopSpeaking]);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => {
      if (prev) Speech.stop();
      return !prev;
    });
    setSpeakingMessageId(null);
  }, []);

  const sendMessage = useCallback(async (userInput: string) => {
    setIsLoading(true);
    setError(null);
    Speech.stop();
    setSpeakingMessageId(null);

    try {
      const { userMessage, assistantMessage } =
        await sendMessageUseCase.execute(userInput, messages);
      setMessages(prev => [...prev, userMessage, assistantMessage]);

      // Lee automáticamente la respuesta de la IA si la voz está activada
      if (isVoiceEnabled) {
        speakMessage(assistantMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isVoiceEnabled, speakMessage]);

  const clearChat = useCallback(() => {
    stopSpeaking();
    setMessages([]);
    setError(null);
  }, [stopSpeaking]);

  return {
    messages,
    isLoading,
    error,
    isVoiceEnabled,
    speakingMessageId,
    sendMessage,
    clearChat,
    speakMessage,
    toggleVoice,
  };
};