import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { Link, RelativePathString, router } from "expo-router";
import Categories from '@/components/Home/Categories';
import { Feather } from "@expo/vector-icons";
import NotificationIcon from "@/assets/icons/Bellicon"
import ActivityCard from "@/components/Home/ActivityCard";
import { useAuthStore } from "@/store/authStore";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/Activitys.types";

export default function Indexscreen() {
  const userprofile = useAuthStore(state => state.userProfile);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Separate state for input

  const limit = 10;

  // In your home screen, update the fetchActivities function:

  const fetchActivities = useCallback(async (pageNum: number, isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const filters: any = {};

      if (searchQuery) {
        filters.search = searchQuery;
      }


      console.log('Fetching activities with filters:', filters);

      const newActivities = await ActivityService.getActivities({
        limit,
        offset: (pageNum - 1) * limit,
        filters,
        sortField: "popularity",
        sortOrder: "desc",
      });

      console.log(`Received ${newActivities.length} activities`);

      if (newActivities.length === 0) {
        setHasMore(false);
        if (pageNum === 1) {
          // No results found
          setActivities([]);
        }
      } else {
        if (pageNum === 1) {
          setActivities(newActivities);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }
      }
    } catch (err) {
      console.error('Error in fetchActivities:', err);

      let errorMessage = "Failed to fetch activities. Please check your connection.";

      if (err instanceof Error) {
        if (err.message.includes('Invalid query') || err.message.includes('search')) {
          errorMessage = "Please use simpler search terms";
        } else if (err.message.includes('network')) {
          errorMessage = "Network error - please check your connection";
        }
      }

      setError(errorMessage);

      if (pageNum === 1) {
        Alert.alert("Search Error", errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery,]);

  // Initial load and when searchQuery changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
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

  // Handle search submission
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        setSearchQuery(searchInput.trim());
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

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
            <Text style={styles.headerTitle}>
              {userprofile?.firstname} {userprofile?.lastname}
            </Text>
            <View style={styles.flexbox}>
              <Text style={styles.statusText}>
                <Text style={{ color: "#04714A", marginRight: 2 }}>• </Text>
                Ready to relax
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notificationContainer}>
          <NotificationIcon />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Feather
            name="search"
            size={20}
            color={"#04714A"}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search activities..."
            placeholderTextColor="#999"
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchInput.length > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <Feather
                name="x"
                size={18}
                color={"#666"}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Categories */}
      <Categories />

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Activities'}
        </Text>
        {!searchQuery && (
          <Link href={"/Trainings"} style={styles.seeAllLink}>
            See All
          </Link>
        )}
      </View>

      {/* Search Results Info */}
      {searchQuery && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchInfoText}>
            Found {activities.length} activity{activities.length !== 1 ? 'ies' : ''}
          </Text>
        </View>
      )}

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
            key={activity.$id}
            id={activity.$id}
            title={activity.title}
            description={activity.description}
            tags={activity.tags}
            duration={activity.duration}
            image={activity.image}
            colors={activity.colors}
            redirect={activity.redirect}
            activitytype={activity.activitytype}
            difficulty={activity.difficulty}
            onPress={() => {
              // You can handle navigation here if needed
              router.push(`/Trainings/${activity.redirect}?id=${activity.$id}` as RelativePathString)
            }}
          />
        ))}

        {loading && activities.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#04714A" />
            <Text style={styles.loadingText}>Loading more activities...</Text>
          </View>
        )}

        {!hasMore && activities.length > 0 && (
          <View style={styles.endOfListContainer}>
            <Text style={styles.endOfListText}>
              {searchQuery ? 'No more activities found' : 'No more activities to show'}
            </Text>
          </View>
        )}

        {activities.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Feather name="search" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No activities found' : 'No activities available'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try adjusting your search terms or browse different categories'
                : 'Check back later for new activities'
              }
            </Text>
            {searchQuery && (
              <Pressable
                style={styles.clearSearchButton}
                onPress={handleClearSearch}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Full screen loading indicator */}
      {loading && activities.length === 0 && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#04714A" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// Helper function to check if scroll is near bottom
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
  const paddingToBottom = 50;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;

const styles = StyleSheet.create({
  // Search Styles
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F0FFFA',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#F0FFFA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 5,
  },
  headerText: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  notificationContainer: {
    padding: 8,
  },

  // Section Styles
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FFFA',
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 20,
    color: '#333',
  },
  seeAllLink: {
    color: "#04714A",
    fontWeight: '800',
    fontSize: 15,
  },

  // Search Info
  searchInfo: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#F0FFFA',
  },
  searchInfoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  // Scroll Container
  scrollContainer: {
    paddingTop: 4,
    paddingBottom: 100,
    paddingHorizontal: CARD_MARGIN,
    minHeight: 200,
  },

  // Loading and Empty States
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#04714A',
    fontSize: 14,
    marginTop: 8,
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
    backgroundColor: '#F0FFFA',
    gap: 15,
  },

  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#F0FFFA",
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#04714A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchButton: {
    marginTop: 20,
    backgroundColor: '#04714A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});