import { View, Text, StyleSheet } from "react-native";

export default function ScreenHome() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Screen Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
});
