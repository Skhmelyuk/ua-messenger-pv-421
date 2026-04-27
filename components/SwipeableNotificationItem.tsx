import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/assets/styles/notifications.styles";
import { formatDistanceToNow } from "date-fns";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Link } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface NotificationProps {
  notification: {
    _id: Id<"notifications">;
    type: "like" | "comment" | "follow";
    sender: {
      _id: Id<"users">;
      username: string;
      image: string;
    };
    post: {
      imageUrl: string;
    } | null;
    comment: string | undefined;
    _creationTime: number;
  };
  onDelete: (id: Id<"notifications">) => void;
}

export function SwipeableNotificationItem({
  notification,
  onDelete,
}: NotificationProps) {
  const translateX = useSharedValue(0);

  const handleDelete = () => {
    onDelete(notification._id);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
          runOnJS(handleDelete)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <View style={swipeStyles.container}>
      <Animated.View style={[swipeStyles.deleteButton, deleteButtonStyle]}>
        <Ionicons name="trash-outline" size={24} color={COLORS.white} />
        <Text style={swipeStyles.deleteText}>Delete</Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[swipeStyles.content, animatedStyle]}>
          <View style={[styles.notificationItem, { marginBottom: 0 }]}>
            <View style={styles.notificationContent}>
              <Link href={`/user/${notification.sender._id}`} asChild>
                <TouchableOpacity style={styles.avatarContainer}>
                  <Image
                    source={notification.sender.image}
                    style={styles.avatar}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.iconBadge}>
                    {notification.type === "like" ? (
                      <Ionicons name="heart" size={14} color={COLORS.primary} />
                    ) : notification.type === "follow" ? (
                      <Ionicons name="person-add" size={14} color="#8B5CF6" />
                    ) : (
                      <Ionicons name="chatbubble" size={14} color="#3B82F6" />
                    )}
                  </View>
                </TouchableOpacity>
              </Link>

              <View style={styles.notificationInfo}>
                <Text style={styles.username}>
                  {notification.sender.username}
                </Text>
                <Text style={styles.action}>
                  {notification.type === "follow"
                    ? "started following you"
                    : notification.type === "like"
                      ? "liked your post"
                      : `commented: "${notification.comment}"`}
                </Text>
                <Text style={styles.timeAgo}>
                  {formatDistanceToNow(notification._creationTime, {
                    addSuffix: true,
                  })}
                </Text>
              </View>
            </View>

            {notification.post && (
              <Image
                source={notification.post.imageUrl}
                style={styles.postImage}
                contentFit="cover"
                transition={200}
              />
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const swipeStyles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 20,
  },
  content: {
    backgroundColor: COLORS.background,
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
});
