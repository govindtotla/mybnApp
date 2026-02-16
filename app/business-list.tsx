import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BusinessCard from '../components/BusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import { businessService } from '../services/api';
import { CATEGORIES, COLORS } from '../utils/constants';
import { Business } from '../utils/types';

const BusinessListScreen = () => {
  const params = useLocalSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalBusinesses, setTotalBusinesses] = useState(0);

  // Load businesses on mount
  useEffect(() => {
    loadBusinesses();
  }, []);

  // Handle search and filter
  useEffect(() => {
    filterBusinesses();
  }, [searchQuery, selectedCategory, businesses]);

  useEffect(() => {
    // Handle back button press
    const backAction = () => {
      router.replace('/(tabs)/profile')
      return true; // Prevent default back behavior
    };

    // Add event listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Cleanup
    return () => backHandler.remove();
  }, []);

  const loadBusinesses = async (pageToLoad: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const response = await businessService.getBusinesses(pageToLoad, 6);

      if (reset) {
        setBusinesses(response.items);
        setFilteredBusinesses(response.items);
        setTotalBusinesses(response.total);
      } else {
        setBusinesses(prev => [...prev, ...response.items]);
        setFilteredBusinesses(prev => [...prev, ...response.items]);
      }

      if (response.items.length === 0 || pageToLoad >= response.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const loadMoreBusinesses = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadBusinesses(nextPage);
    }
  };

  const filterBusinesses = async () => {
    try {
      if (!searchQuery.trim() && selectedCategory === 'All') {
        setFilteredBusinesses(businesses);
        return;
      }

      const results = await businessService.searchBusinesses(
        searchQuery,
        selectedCategory === 'All' ? undefined : selectedCategory
      );
      setFilteredBusinesses(results);
    } catch (error) {
      console.error('Error filtering businesses:', error);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset pagination state and reload from page 1
    loadBusinesses(1, true);
  }, []);

  const handleBusinessPress = (business: Business) => {
    router.push({
      pathname: '/business-detail',
      params: { businessId: business.id },
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <BusinessCard
      business={item}
      onPress={() => handleBusinessPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="business-outline" size={80} color={COLORS.border} />
      <Text style={styles.emptyStateTitle}>
        {searchQuery || selectedCategory !== 'All'
          ? 'No matching businesses found'
          : 'No businesses available'
        }
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery || selectedCategory !== 'All'
          ? 'Try adjusting your search or filter criteria'
          : 'Check back later for new businesses'
        }
      </Text>
      {(searchQuery || selectedCategory !== 'All') && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && businesses.length === 0) {
    return <LoadingSpinner message="Loading businesses..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Business Directory</Text>
          <Text style={styles.headerSubtitle}>
            Discover amazing local businesses
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowCategoryModal(true)}>
          <Ionicons name="filter" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Filter Badge */}
      {selectedCategory !== 'All' && (
        <View style={styles.selectedCategoryContainer}>
          <View style={styles.selectedCategoryBadge}>
            <Text style={styles.selectedCategoryText}>{selectedCategory}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('All')}>
              <Ionicons name="close" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <SearchBar
        placeholder="Search businesses by name, category, or description..."
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* Business List */}
      <FlatList
        data={filteredBusinesses}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={loadMoreBusinesses}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <LoadingSpinner message="Loading more..." />
            </View>
          ) : !hasMore && filteredBusinesses.length > 0 ? (
            <View style={styles.endMessageContainer}>
              <Text style={styles.endMessageText}>You've reached the end of the list</Text>
            </View>
          ) : filteredBusinesses.length > 0 ? (
            <View style={styles.listFooter}>
              <Text style={styles.listFooterText}>
                Showing {filteredBusinesses.length} of {totalBusinesses} businesses
              </Text>
            </View>
          ) : null
        }
      />

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoriesList}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
  },
  selectedCategoryContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  selectedCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  selectedCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: COLORS.text.inverted,
    fontSize: 16,
    fontWeight: '600',
  },
  listFooter: {
    padding: 20,
    alignItems: 'center',
  },
  listFooterText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  endMessageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  categoriesList: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.background,
  },
  categoryItemSelected: {
    backgroundColor: `${COLORS.primary}15`,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  categoryTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default BusinessListScreen;