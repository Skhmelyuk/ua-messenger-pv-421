import { styles } from "@/assets/styles/feed.styles";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function Story({
  story,
  onPress,
}: {
  story: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.storyWrapper} onPress={onPress}>
      <View style={[styles.storyRing, !story.hasStory && styles.noStory]}>
        <Image source={story.avatar} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>{story.username}</Text>
    </TouchableOpacity>
  );
}
