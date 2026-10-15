import { StyleSheet, Text, View } from "react-native";

export function VerifiedBadge({
  universityName,
  compact = false,
}: {
  universityName?: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.badge, compact && styles.badgeCompact]}>
      <Text style={styles.dot}>🟢</Text>
      <Text style={[styles.text, compact && styles.textCompact]}>
        {compact
          ? "Verified"
          : universityName
          ? `${universityName} Verified`
          : "University Verified"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8F2",
    borderWidth: 1,
    borderColor: "#B7E7D4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    alignSelf: "flex-start",
  },
  badgeCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  dot: {
    fontSize: 9,
  },
  text: {
    fontSize: 11,
    fontWeight: "800",
    color: "#167954",
  },
  textCompact: {
    fontSize: 10,
  },
});
