import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { styles } from "@/assets/styles/feed.styles";
import { Loader } from "@/components/Loader";
import { Link } from "expo-router";

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>
        No bookmarked posts yet
      </Text>
    </View>
  );
}

export default function Bookmarks() {
  // Перевірка автентифікації
  const { isAuthenticated } = useConvexAuth();

  // Отримання закладок (skip якщо не авторизований)
  const bookmarkedPosts = useQuery(
    api.bookmarks.getBookmarkedPosts,
    isAuthenticated ? {} : "skip"
  );

  // Loading state
  if (bookmarkedPosts === undefined) return <Loader />;

  // Empty state
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* POSTS GRID */}
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          return (
            <View key={post._id} style={{ width: "33.33%", padding: 1 }}>
              {/* Обгортаємо зображення в Link */}
              <Link href={`/post/${post._id}`} asChild>
                <TouchableOpacity activeOpacity={0.8}>
                  <Image
                    source={post.imageUrl}
                    style={{ width: "100%", aspectRatio: 1 }}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              </Link>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
