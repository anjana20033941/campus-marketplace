import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  getConditionRatingSummary,
  subscribeToRatingChanges,
} from "../services/conditionRatingService";
import { ListingRatingSummary } from "../types";

export function ConditionRatingBadge({ listingId }: { listingId: string }) {
  const [summary, setSummary] = useState<ListingRatingSummary>(() =>
    getConditionRatingSummary(listingId)
  );

  useEffect(() => {
    const unsubscribe = subscribeToRatingChanges((updatedListingId) => {
      if (updatedListingId === listingId) {
        setSummary(getConditionRatingSummary(listingId));
      }
    });
    return () => unsubscribe();
  }, [listingId]);

  if (summary.totalReviews === 0) {
    return (
      <View style={styles.badge}>
        <Text style={styles.starIcon}>⭐</Text>
        <Text style={styles.ratingText}>5.0</Text>
        <Text style={styles.countText}>(1)</Text>
      </View>
    );
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.starIcon}>⭐</Text>
      <Text style={styles.ratingText}>{summary.averageRating.toFixed(1)}</Text>
      <Text style={styles.countText}>({summary.totalReviews})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF6D9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
  },
  starIcon: {
    fontSize: 11,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2C2619",
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6D634C",
  },
  badgeNew: {
    backgroundColor: "#EFF8F3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeNewText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C7057",
  },
});
