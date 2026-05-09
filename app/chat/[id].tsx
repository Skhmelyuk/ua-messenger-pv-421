import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams(); // отримуємо id чату з URL
  const { user } = useUser();
  const router = useRouter();
  const [text, setText] = useState("");

  const messages = useQuery(api.chat.getMessages, {
    conversationId: id as Id<"conversations">,
  });
  const sendMessage = useMutation(api.chat.sendMessage);

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({
      conversationId: id as Id<"conversations">,
      senderId: user?.id || "",
      text,
    });

    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: "#333" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
            {name ? decodeURIComponent(name as string) : "Chat"}
          </Text>
        </View>

        <FlatList
        data={messages ? [...messages].reverse() : []}
        inverted
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === user?.id;
          return (
            <View
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#007AFF" : "#1c1c1e",
                padding: 12,
                marginVertical: 4,
                borderRadius: 20,
                borderBottomRightRadius: isMe ? 4 : 20,
                borderBottomLeftRadius: !isMe ? 4 : 20,
                maxWidth: "80%",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>{item.text}</Text>
            </View>
          );
        }}
      />

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          borderTopWidth: 1,
          borderColor: "#222",
          backgroundColor: "#000",
          alignItems: "flex-end"
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#1c1c1e",
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 10,
            marginRight: 10,
            maxHeight: 120,
            color: "#fff",
            fontSize: 16,
          }}
          value={text}
          onChangeText={setText}
          placeholder="Введіть повідомлення..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!text.trim()}
          style={{
            backgroundColor: text.trim() ? "#007AFF" : "#333",
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 2
          }}
        >
          <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
