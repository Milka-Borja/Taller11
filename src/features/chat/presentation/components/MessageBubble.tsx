import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../../domain/entities/Message';

interface Props { message: Message; }

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {isUser ? (
          <Text style={[styles.text, styles.userText]}>{message.content}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message.content}</Markdown>
        )}
      </View>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString('es-EC', {
          hour: '2-digit', minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const markdownStyles = StyleSheet.create({
  body: { color: '#1E293B', fontSize: 15, lineHeight: 21 },
  heading1: { color: '#1E293B', fontSize: 22, fontWeight: '700' },
  heading2: { color: '#1E293B', fontSize: 19, fontWeight: '700' },
  heading3: { color: '#1E293B', fontSize: 17, fontWeight: '600' },
  heading4: { color: '#1E293B', fontSize: 16, fontWeight: '600' },
  heading5: { color: '#1E293B', fontSize: 15, fontWeight: '600' },
  heading6: { color: '#1E293B', fontSize: 14, fontWeight: '600' },
  paragraph: { marginTop: 0, marginBottom: 8 },
  code_inline: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
    borderRadius: 4,
    padding: 2,
  },
  code_block: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
    borderRadius: 6,
    padding: 8,
  },
  fence: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
    borderRadius: 6,
    padding: 8,
  },
  blockquote: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  link: { color: '#2563EB' },
});

const styles = StyleSheet.create({
  container: { marginVertical: 4, marginHorizontal: 12, maxWidth: '80%' },
  userContainer: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  aiContainer:  { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble:       { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble:   { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
  aiBubble:     { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 4 },
  text:         { fontSize: 15, lineHeight: 21 },
  userText:     { color: '#FFFFFF' },
  timestamp:    { fontSize: 10, color: '#94A3B8', marginTop: 2 },
});
