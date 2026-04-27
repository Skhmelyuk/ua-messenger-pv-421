import { View, Text, FlatList } from "react-native";

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COLORS } from "@/constants/theme";
import { styles } from "@/assets/styles/notifications.styles";
import { Loader } from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { SwipeableNotificationItem } from "@/components/SwipeableNotificationItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Notifications() {
  // Перевірка автентифікації
  const { isAuthenticated } = useConvexAuth();

  // Отримання сповіщень
  const notifications = useQuery(
    api.notifications.getNotifications,
    isAuthenticated ? {} : "skip",
  );

  // Отримуємо функцію для видалення сповіщення
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  // Функція видалення — передається в SwipeableNotificationItem
  const handleDeleteNotification = async (
    notificationId: Id<"notifications">,
  ) => {
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Loading state
  if (notifications === undefined) return <Loader />;

  // Empty state
  if (notifications.length === 0) return <NoNotificationsFound />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {/* NOTIFICATIONS LIST */}
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <SwipeableNotificationItem
              notification={item}
              onDelete={handleDeleteNotification}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </GestureHandlerRootView>
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
