import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "../../constants/Colors";
import {
  AIMessage,
  CaseSummary,
  Specialty,
  UserContactData,
} from "../../constants/Types";
import { useAIAssistant } from "../../hooks/useAIAssistant";
import RequestUserDataModal from "./RequestUserDataModal";
import FormattedText from "./FormattedText";

interface AIChatProps {
  userId: string;
  onNavigateToExperts?: (data?: {
    specialty?: Specialty;
    caseSummary?: CaseSummary;
    userContactData?: UserContactData;
  }) => void;
}

export default function AIChat({ userId, onNavigateToExperts }: AIChatProps) {
  // Always use dark theme
  const colors = Colors.dark;

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    questionsRemaining,
    isTyping,
    canAskMore,
    sendMessage,
    caseLevel,
    caseSummary,
    userContactData,
    needsUserData,
    generateCaseSummary,
    saveUserContactData,
  } = useAIAssistant(userId);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && canAskMore) {
      sendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleEscalateToExperts = () => {
    const summary = generateCaseSummary();
    const primarySpecialty = summary.detectedSpecialties[0];

    if (onNavigateToExperts) {
      onNavigateToExperts({
        specialty: primarySpecialty,
        caseSummary: summary,
        userContactData: userContactData || undefined,
      });
    }
  };

  const handleUserDataSubmit = (data: UserContactData) => {
    saveUserContactData(data);
  };

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <FormattedText
            content={item.content}
            isUser={isUser}
            colors={colors}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={24} color={colors.background} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Asistente Fiscal IA
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {questionsRemaining}{" "}
              {questionsRemaining === 1
                ? "pregunta restante"
                : "preguntas restantes"}
            </Text>
          </View>
        </View>

        {!canAskMore && onNavigateToExperts && (
          <TouchableOpacity
            style={[styles.expertButton, { backgroundColor: colors.primary }]}
            onPress={onNavigateToExperts}
          >
            <Text style={[styles.expertButtonText, { color: colors.background }]}>
              Ver expertos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <View
            style={[styles.typingBubble, { backgroundColor: colors.backgroundSecondary }]}
          >
            <Text style={[styles.typingText, { color: colors.textSecondary }]}>
              Escribiendo...
            </Text>
          </View>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.cardBackground, borderTopColor: colors.border },
        ]}
      >
        {!canAskMore && (
          <View style={[styles.limitBanner, { backgroundColor: colors.warning }]}>
            <Ionicons name="information-circle" size={16} color="#000" />
            <Text style={styles.limitText}>
              Has usado tus 3 preguntas gratuitas. Conecta con un experto para más ayuda.
            </Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.backgroundSecondary, color: colors.text },
            ]}
            placeholder={
              canAskMore
                ? "Escribe tu pregunta fiscal..."
                : "Límite de preguntas alcanzado"
            }
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            editable={canAskMore}
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit={false}
            // ENTER = Enviar | SHIFT+ENTER = Salto de línea (Web)
            onKeyPress={(e) => {
              if (Platform.OS === 'web') {
                // @ts-ignore - nativeEvent.key existe en web
                if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                  e.preventDefault();
                  if (inputText.trim() && canAskMore) {
                    handleSend();
                  }
                }
                // SHIFT+ENTER permite salto de línea (comportamiento por defecto)
              }
            }}
            // ENTER = Enviar (Mobile)
            onSubmitEditing={() => {
              if (Platform.OS !== 'web' && inputText.trim() && canAskMore) {
                handleSend();
              }
            }}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              (!inputText.trim() || !canAskMore) && { opacity: 0.5 },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || !canAskMore}
          >
            <Ionicons name="send" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {(caseLevel === "yellow" || caseLevel === "red") && onNavigateToExperts && (
        <View
          style={[
            styles.escalationContainer,
            { backgroundColor: colors.cardBackground, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.escalationButton,
              {
                backgroundColor:
                  caseLevel === "red" ? colors.error : colors.warning,
              },
            ]}
            onPress={handleEscalateToExperts}
          >
            <Ionicons
              name={caseLevel === "red" ? "alert-circle" : "warning"}
              size={20}
              color="#FFF"
            />
            <Text style={styles.escalationButtonText}>
              {caseLevel === "red" ? "Atención Prioritaria" : "Validar con Experto"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <RequestUserDataModal
        visible={needsUserData}
        onClose={() => { }}
        onSubmit={handleUserDataSubmit}
        caseLevel={caseLevel}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md, borderBottomWidth: 1 },
  headerContent: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  headerText: { flex: 1 },
  headerTitle: { ...Typography.h3 },
  headerSubtitle: { ...Typography.bodySmall },
  expertButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  expertButtonText: { ...Typography.button, fontSize: 14 },
  messagesList: { padding: Spacing.md },
  messageContainer: { marginBottom: Spacing.md },
  userMessageContainer: { alignItems: "flex-end" },
  aiMessageContainer: { alignItems: "flex-start" },
  messageBubble: { maxWidth: "80%", padding: Spacing.md, borderRadius: BorderRadius.lg },
  messageText: { ...Typography.body },
  typingContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  typingBubble: { alignSelf: "flex-start", paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
  typingText: { ...Typography.bodySmall, fontStyle: "italic" },
  inputContainer: { borderTopWidth: 1 },
  limitBanner: { flexDirection: "row", alignItems: "center", padding: Spacing.sm, gap: Spacing.xs },
  limitText: { ...Typography.caption, color: "#000", flex: 1 },
  inputRow: { flexDirection: "row", padding: Spacing.md, gap: Spacing.sm },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Typography.body,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  escalationContainer: { padding: Spacing.md, borderTopWidth: 1 },
  escalationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  escalationButtonText: { ...Typography.button, color: "#FFF" },
});
