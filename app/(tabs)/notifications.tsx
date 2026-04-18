import { View, Text, FlatList } from "react-native";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { styles } from "@/assets/styles/notifications.styles";
import { Loader } from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { NotificationItem } from "@/components/NotificationItem";

export default function Notifications() {
  // Перевірка автентифікації
  const { isAuthenticated } = useConvexAuth();

  // Отримання сповіщень
  const notifications = useQuery(
    api.notifications.getNotifications,
    isAuthenticated ? {} : "skip",
  );

  // Loading state
  if (notifications === undefined) return <Loader />;

  // Empty state
  if (notifications.length === 0) return <NoNotificationsFound />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* NOTIFICATIONS LIST */}
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

function NoNotificationsFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name="notifications-outline" size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>
        No notifications yet
      </Text>
    </View>
  );
}
