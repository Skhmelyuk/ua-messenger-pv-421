import React from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/convex/_generated/api";

export default function ChatsListScreen() {
  const { user } = useUser();
  const router = useRouter();

  // Підписка на оновлення чатів у реальному часі
  const conversations = useQuery(api.chat.getConversations, {
    userId: user?.id || "",
  });

  const openChat = (conversationId: string, otherUserId: string, otherUserName: string) => {
    router.push(`/chat/${conversationId}?otherUserId=${otherUserId}&name=${encodeURIComponent(otherUserName)}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16, marginBottom: 5 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 15 }}>
          My Chats
        </Text>
      </View>

      {conversations === undefined ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 50, color: "#888" }}>
              У вас поки немає жодного чату.
            </Text>
          }
          renderItem={({ item }) => {
            const otherUserId =
              item.participantOneId === user?.id
                ? item.participantTwoId
                : item.participantOneId;
            
            const otherUserName = item.otherUser?.fullname || item.otherUser?.username || "Unknown User";

            return (
              <TouchableOpacity
                style={{ padding: 16, borderBottomWidth: 1, borderColor: "#333", flexDirection: "row", alignItems: "center" }}
                onPress={() => openChat(item._id, otherUserId, otherUserName)}
              >
                <Image
                  source={{ uri: item.otherUser?.image || "https://gravatar.com/avatar/placeholder?d=mp" }}
                  style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 16 }}>
                    {otherUserName}
                  </Text>
                  <Text style={{ color: "#aaa", marginTop: 4 }} numberOfLines={1}>
                    {item.lastMessageText || "Немає повідомлень"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
