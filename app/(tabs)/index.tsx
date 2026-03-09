import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useClerk } from "@clerk/expo";

export default function ScreenHome() {
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff", marginBottom: 20 }}>Screen Home</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text
          style={{
            color: "#000",
            fontSize: 16,
            fontWeight: "bold",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 5,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#220000",
  },
});
