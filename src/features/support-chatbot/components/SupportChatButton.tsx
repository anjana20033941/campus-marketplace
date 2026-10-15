import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export function SupportChatButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.floatingButton} onPress={onPress}>
      <Text style={styles.icon}>🤖</Text>
      <View>
        <Text style={styles.text}>Need Help?</Text>
        <Text style={styles.subtext}>Chat with Bot</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 102 : 90, // Neatly above Android bottom nav bar
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B3A33",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#2D5C51",
    zIndex: 999,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  subtext: {
    color: "#84D8B9",
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 12,
  },
});
