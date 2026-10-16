import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Listing } from "../types";
import { ConditionRatingBadge } from "../features/condition-rating";

export function ListingCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.photo}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <Pressable
          accessibilityLabel={saved ? "Remove saved item" : "Save item"}
          style={styles.save}
          onPress={onSave}
        >
          <Text style={[styles.heart, saved && styles.red]}>
            {saved ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        <View style={styles.locationPill}>
          <Text style={styles.pinIcon}>📍</Text>
          <Text style={styles.locationText}>{item.campus}</Text>
        </View>
        <View style={styles.ratingRow}>
          <ConditionRatingBadge listingId={item.id} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF3EF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  photo: {
    height: 154,
    backgroundColor: "#E5ECE5",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  save: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  heart: {
    color: "#184638",
    fontSize: 19,
    lineHeight: 22,
  },
  red: {
    color: "#C3535B",
  },
  body: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 4,
  },
  title: {
    flex: 1,
    color: "#0E382B",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },
  price: {
    color: "#0E382B",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 4,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F4EE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    marginTop: 8,
    gap: 4,
    alignSelf: "flex-start",
  },
  pinIcon: {
    fontSize: 10,
  },
  locationText: {
    color: "#1A5240",
    fontSize: 11,
    fontWeight: "700",
  },
  ratingRow: {
    marginTop: 6,
  },
});
