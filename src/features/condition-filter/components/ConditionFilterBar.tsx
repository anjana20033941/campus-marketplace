import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CONDITIONS } from "../constants";
import { ItemCondition } from "../types";

export function ConditionFilterBar({
  selectedCondition,
  onConditionChange,
}: {
  selectedCondition: ItemCondition;
  onConditionChange: (condition: ItemCondition) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.filterTitle}>CONDITION:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {CONDITIONS.map((cond) => {
          const isActive = selectedCondition === cond;
          return (
            <Pressable
              key={cond}
              onPress={() => onConditionChange(cond)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cond}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#5C7164",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.0,
  },
  scrollList: {
    gap: 8,
  },
  chip: {
    backgroundColor: "#E2EFE7",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: "#134638",
  },
  chipText: {
    fontSize: 12.5,
    color: "#163B30",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },
});
