import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getBotResponse, WELCOME_MESSAGE } from "../knowledgeBase";
import { ChatMessage } from "../types";

export function SupportChatScreen({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when message list changes
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Realistic small delay for bot answering (350ms)
    setTimeout(() => {
      const botReply = getBotResponse(text);
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 400);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const latestQuickReplies =
    messages.length > 0 && messages[messages.length - 1].sender === "bot"
      ? messages[messages.length - 1].quickReplies
      : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarIcon}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Support Assistant</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.headerSubtitle}>Always Online · Instant Answers</Text>
            </View>
          </View>
        </View>
        {onClose && (
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </Pressable>
        )}
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => {
          const isUser = item.sender === "user";
          return (
            <View
              style={[
                styles.bubbleWrapper,
                isUser ? styles.bubbleUserWrapper : styles.bubbleBotWrapper,
              ]}
            >
              {!isUser && (
                <Text style={styles.senderLabel}>Campus Assistant</Text>
              )}
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleBot,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.textUser : styles.textBot,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={
          isTyping ? (
            <View style={[styles.bubbleWrapper, styles.bubbleBotWrapper]}>
              <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#1C7057" />
                <Text style={styles.typingText}>Support Bot is replying...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick Reply Chips Bar */}
      {latestQuickReplies && latestQuickReplies.length > 0 && !isTyping && (
        <View style={styles.quickReplyContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesScroll}
          >
            {latestQuickReplies.map((reply, idx) => (
              <Pressable
                key={idx}
                style={styles.chip}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={styles.chipText}>{reply}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask a question about Campus Marketplace..."
          placeholderTextColor="#87918C"
          style={styles.input}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <Pressable
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E7EDE9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E2F0EA",
    alignItems: "center",
    justifyContent: "center",
  },
  botAvatarIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B3A33",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2ECC71",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#67756F",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F4F2",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 20,
    color: "#37474F",
    fontWeight: "700",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bubbleWrapper: {
    marginVertical: 6,
    maxWidth: "82%",
  },
  bubbleBotWrapper: {
    alignSelf: "flex-start",
  },
  bubbleUserWrapper: {
    alignSelf: "flex-end",
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1C7057",
    marginBottom: 3,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  bubbleBot: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2ECE6",
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "#1C7057",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textBot: {
    color: "#1E3B34",
  },
  textUser: {
    color: "#FFF",
  },
  timestamp: {
    fontSize: 10,
    color: "#A2AEA8",
    marginTop: 3,
    marginHorizontal: 4,
    alignSelf: "flex-end",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: "#1C7057",
    fontStyle: "italic",
  },
  quickReplyContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#EAEFEA",
  },
  quickRepliesScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    backgroundColor: "#EEF5F1",
    borderWidth: 1,
    borderColor: "#CFE3D8",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C7057",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E7EDE9",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F8F6",
    borderWidth: 1,
    borderColor: "#DCE5E0",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontSize: 14,
    color: "#1B3A33",
  },
  sendButton: {
    backgroundColor: "#1C7057",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#B4C8BF",
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
