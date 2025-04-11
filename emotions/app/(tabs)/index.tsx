import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { Link } from "expo-router";
import Categories from '@/components/Home/Categories';
import { Feather } from "@expo/vector-icons";
import NotificationIcon from "@/assets/icons/Bellicon"
import ActivityCard from "@/components/Home/ActivityCard";
import { useAuthStore } from "@/store/authStore";
import ActivityService from "@/lib/activity"; // Import the service we created earlier
import { ActivityType } from "@/types/activitycard.types";


export default function Indexscreen() {
  const userprofile = useAuthStore(state => state.userProfile);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 10; // Number of items per page

  // Fetch activities with pagination
  const fetchActivities = useCallback(async (pageNum: number, isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const newActivities = await ActivityService.getActivities({
        limit,
        offset: (pageNum - 1) * limit,
        filters: searchQuery ? {
          // Add search filters here based on your requirements
          // For example, search by title or tags
          type: searchQuery,
        } : {},
        sortField: "title",
        sortOrder: "asc",
      });

      if (newActivities.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setActivities(newActivities);
          //console.log("Activities fetched:", newActivities[0].redirect);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }
      }
    } catch (err) {
      setError("Failed to fetch activities. Please try again.");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchActivities(1, true);
  }, [fetchActivities]);

  // Handle infinite scroll
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchActivities(page + 1);
    }
  };

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    fetchActivities(1);
  };

  if (error && activities.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => fetchActivities(1)} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F0FFFA" }}
    >
      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/chatlogo.png')}
            style={styles.logo}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{userprofile?.firstname} {userprofile?.lastname}</Text>
            <View style={styles.flexbox}>
              <Text style={styles.statusText}>
                <Text style={{ color: "#04714A", marginRight: 2 }}>• </Text>Meditation
              </Text>
            </View>
          </View>
        </View>
        <Pressable style={styles.menuButton}>
          <NotificationIcon />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleSearch}
          >
            <Feather
              name="search"
              size={20}
              color={"#ffffff"}
            />
          </Pressable>
        </View>
      </View>

      <Categories />

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trainings</Text>
        <Link href={"/Trainings"} style={styles.seeAllLink}>
          See All
        </Link>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#04714A"]}
            tintColor="#04714A"
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !loading && hasMore) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {activities.map(activity => (
          <ActivityCard
            id={activity.$id}
            redirect={`Trainings/${activity.redirect}?id=${activity.$id}`}
            key={activity.$id}
            title={activity.title}
            description={activity.description}
            tags={activity.tags}
            duration={activity.duration}
            image={activity.image}
            colors={activity.colors}
          />
        ))}

        {loading && activities.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#04714A" />
          </View>
        )}

        {!hasMore && (
          <View style={styles.endOfListContainer}>
            <Text style={styles.endOfListText}>No more activities to show</Text>
          </View>
        )}
      </ScrollView>

      {/* Full screen loading indicator */}
      {loading && activities.length === 0 && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#04714A" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// Helper function to check if scroll is near bottom
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};


const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2; // 2 cards per row

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    borderRadius: 30,
    padding: 5,
    borderColor: "#04714A",
    backgroundColor: 'white',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    paddingHorizontal: 12,
    fontWeight: "800",
    paddingVertical: 14,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#04714A",
    color: "ffffff",
    borderRadius: 30,
    padding: 10,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuter: {
    position: 'relative',
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleMiddle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  circleInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#888',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    backgroundColor: 'white',
    height: 40,
    marginRight: 12,
    borderRadius: 5, // Circular logo
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  headerText: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiText: {
    color: '#04714A',
    fontWeight: 'bold',
  },
  flexbox: {
    height: "auto",
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 12,
    color: '#6C6C6C',
  },
  menuButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 10,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: '#555',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This will properly space the items
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    zIndex: 1,
    backgroundColor: '#F0FFFA', // Match your background color
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 20,
    flex: 1,
    textAlign: 'center', // Center the text
  },
  backButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton2: {
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingTop: 4, // Space for header
    paddingBottom: 70,
    paddingHorizontal: CARD_MARGIN,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 20,
  },
  seeAllLink: {
    color: "#04714A",
    fontWeight: '800',
    fontSize: 15,
    paddingVertical: 2.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#F0FFFA",
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#04714A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endOfListContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endOfListText: {
    color: '#666',
    fontSize: 14,
  },
  fullScreenLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});