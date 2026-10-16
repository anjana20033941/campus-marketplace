import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ListingCard } from "../components/ListingCard";
import { categories } from "../data";
import { Listing } from "../types";
import { ConditionFilterBar, ItemCondition } from "../features/condition-filter";

export function ExplorePage({
  items,
  query,
  category,
  selectedCondition = "All conditions",
  savedIds,
  onQueryChange,
  onCategoryChange,
  onConditionChange,
  onSave,
  onOpen,
  onProfile,
  onOpenRentRequests,
}: {
  items: Listing[];
  query: string;
  category: string;
  selectedCondition?: ItemCondition;
  savedIds: string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onConditionChange?: (condition: ItemCondition) => void;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onProfile: () => void;
  onOpenRentRequests?: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>CAMPUS MARKETPLACE</Text>
          <View style={styles.topActions}>
            {onOpenRentRequests && (
              <Pressable style={styles.rentReqBtn} onPress={onOpenRentRequests}>
                <Text style={styles.rentReqIcon}>🤝</Text>
                <Text style={styles.rentReqText}>Rent Requests</Text>
              </Pressable>
            )}
            <Pressable style={styles.iconCircle} onPress={onProfile}>
              <Text style={styles.circleIconText}>⚙</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.headlineCol}>
            <Text style={styles.heading}>
              Find your{"\n"}next{"\n"}favorite{"\n"}thing.
            </Text>
          </View>
          <View style={styles.illustrationCol}>
            <Pressable style={styles.questionCircle} onPress={onProfile}>
              <Text style={styles.questionText}>?</Text>
            </Pressable>
            <Image
              source={require("../../assets/header-illustration.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.search}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search textbooks, desks, tech..."
          placeholderTextColor="#86998F"
          style={styles.input}
        />
      </View>

      {/* Browse Near You Section Header */}
      <View style={styles.section}>
        <View>
          <Text style={styles.sectionTitle}>Browse near you</Text>
          <Text style={styles.muted}>Good finds, close by</Text>
        </View>
        <Text style={styles.itemsCount}>{items.length} items</Text>
      </View>

      {/* Category Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map((value) => (
          <Pressable
            key={value}
            onPress={() => onCategoryChange(value)}
            style={[
              styles.category,
              category === value && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === value && styles.activeText,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Condition Filter Bar */}
      {onConditionChange && (
        <ConditionFilterBar
          selectedCondition={selectedCondition}
          onConditionChange={onConditionChange}
        />
      )}

      {/* Listings Grid */}
      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.empty}>No items match your search yet.</Text>
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={savedIds.includes(item.id)}
            onSave={() => onSave(item.id)}
            onOpen={() => onOpen(item)}
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
    backgroundColor: "#F9FAF4",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: "#5C7164",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rentReqBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D6F1E4",
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 20,
    gap: 5,
  },
  rentReqIcon: {
    fontSize: 13,
  },
  rentReqText: {
    color: "#134638",
    fontSize: 11.5,
    fontWeight: "700",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D2EBE0",
    alignItems: "center",
    justifyContent: "center",
  },
  circleIconText: {
    color: "#174637",
    fontSize: 17,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
  },
  headlineCol: {
    flex: 1,
    paddingRight: 4,
  },
  heading: {
    color: "#103C31",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  illustrationCol: {
    width: 175,
    alignItems: "flex-end",
    position: "relative",
  },
  questionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D2EBE0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    marginRight: 2,
  },
  questionText: {
    color: "#174637",
    fontSize: 18,
    fontWeight: "700",
  },
  heroImage: {
    width: 175,
    height: 98,
  },
  search: {
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E7EDE9",
    marginTop: 16,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 9,
    opacity: 0.75,
  },
  input: {
    flex: 1,
    color: "#103C31",
    fontSize: 13.5,
    fontWeight: "500",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#103C31",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  muted: {
    color: "#6B8275",
    fontSize: 13,
    marginTop: 3,
  },
  itemsCount: {
    color: "#103C31",
    fontWeight: "700",
    fontSize: 13,
  },
  categories: {
    gap: 8,
    paddingBottom: 16,
  },
  category: {
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E2EFE7",
  },
  activeCategory: {
    backgroundColor: "#134638",
  },
  categoryText: {
    color: "#163C30",
    fontSize: 13,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFF",
    fontWeight: "700",
  },
  grid: {
    gap: 14,
  },
  columns: {
    gap: 14,
  },
  empty: {
    textAlign: "center",
    color: "#87918C",
    padding: 30,
  },
});
