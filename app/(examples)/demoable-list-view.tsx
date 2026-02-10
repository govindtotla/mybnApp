import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Sample data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, avatar: '👨‍💻', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, avatar: '👩‍💼', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, avatar: '👴', status: 'inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 23, avatar: '👩‍🎨', status: 'active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 38, avatar: '🧑‍🔬', status: 'active' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 29, avatar: '🦸‍♀️', status: 'inactive' },
  { id: 7, name: 'Ethan Hunt', email: 'ethan@example.com', age: 42, avatar: '🕵️', status: 'active' },
  { id: 8, name: 'Fiona Gallagher', email: 'fiona@example.com', age: 35, avatar: '👩‍🍳', status: 'active' },
  { id: 9, name: 'George Miller', email: 'george@example.com', age: 31, avatar: '👨‍🚀', status: 'inactive' },
  { id: 10, name: 'Hannah Davis', email: 'hannah@example.com', age: 27, avatar: '👩‍🏫', status: 'active' },
  { id: 11, name: 'Ian Curtis', email: 'ian@example.com', age: 39, avatar: '🎤', status: 'active' },
  { id: 12, name: 'Julia Roberts', email: 'julia@example.com', age: 55, avatar: '🎬', status: 'inactive' },
];

export default function DemoableListView() {
  // State Management
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
      // Handle back button press
      const backAction = () => {
        router.replace('/')
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

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Search and Filter Functions
  useEffect(() => {
    let results = users;

    // Apply search filter
    if (searchQuery) {
      results = results.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply active filter
    if (showActiveOnly) {
      results = results.filter(user => user.status === 'active');
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'age') {
        return a.age - b.age;
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    setFilteredUsers(results);
  }, [users, searchQuery, showActiveOnly, sortBy]);

  // User Actions
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setUsers(initialUsers);
      setRefreshing(false);
      Alert.alert('Refreshed', 'List has been refreshed!');
    }, 1500);
  };

  const handleLoadMore = () => {
    if (loading || filteredUsers.length >= 50) return;

    setLoading(true);
    setTimeout(() => {
      const newUsers = Array.from({ length: 5 }, (_, i) => ({
        id: users.length + i + 1,
        name: `New User ${users.length + i + 1}`,
        email: `newuser${users.length + i + 1}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        avatar: '👤',
        status: Math.random() > 0.5 ? 'active' : 'inactive',
      }));

      setUsers([...users, ...newUsers]);
      setLoading(false);
    }, 1000);
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(user => user.id !== userId));
            Alert.alert('Success', 'User deleted successfully!');
          },
        },
      ]
    );
  };

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      age: Math.floor(Math.random() * 50) + 18,
      avatar: '👤',
      status: 'active',
    };

    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    Alert.alert('Success', 'User added successfully!');
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  // Render List Item
  const renderListItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.listItem,
        viewMode === 'grid' && styles.gridItem,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleUserPress(item)}
        onLongPress={() => handleDeleteUser(item.id)}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.userAge}>Age: {item.age}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'active' ? '#4CAF50' : '#F44336' }
            ]}>
              <Text style={styles.statusText}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.statusToggle}
          onPress={() => toggleUserStatus(item.id)}
        >
          <Switch
            value={item.status === 'active'}
            onValueChange={() => toggleUserStatus(item.id)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.status === 'active' ? '#f5dd4b' : '#f4f3f4'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render Header
  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <Text style={styles.headerTitle}>👥 User Directory</Text>
      <Text style={styles.headerSubtitle}>
        {filteredUsers.length} users found
      </Text>
    </Animated.View>
  );

  // Render Footer
  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading more users...</Text>
      </View>
    );
  };

  // Render Empty State
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>😔</Text>
      <Text style={styles.emptyStateTitle}>No users found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or filter
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.container}>
        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.controlsRow}>
            <View style={styles.filterControls}>
              <TouchableOpacity
                style={[styles.filterButton, sortBy === 'name' && styles.activeFilter]}
                onPress={() => setSortBy('name')}
              >
                <Text style={styles.filterButtonText}>Sort by Name</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterButton, sortBy === 'age' && styles.activeFilter]}
                onPress={() => setSortBy('age')}
              >
                <Text style={styles.filterButtonText}>Sort by Age</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.viewControls}>
              <TouchableOpacity
                style={[styles.viewButton, viewMode === 'list' && styles.activeView]}
                onPress={() => setViewMode('list')}
              >
                <Text style={styles.viewButtonText}>☰</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewButton, viewMode === 'grid' && styles.activeView]}
                onPress={() => setViewMode('grid')}
              >
                <Text style={styles.viewButtonText}>⏹️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Show active only:</Text>
            <Switch
              value={showActiveOnly}
              onValueChange={setShowActiveOnly}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={showActiveOnly ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* User List */}
        <FlatList
          data={filteredUsers}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#4285F4']}
              tintColor="#4285F4"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* User Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedUser && (
                <>
                  <Text style={styles.modalTitle}>👤 User Details</Text>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>{selectedUser.avatar}</Text>
                  </View>
                  <View style={styles.modalDetails}>
                    <Text style={styles.modalDetail}>
                      <Text style={styles.detailLabel}>Name: </Text>
                      {selectedUser.name}
                    </Text>
                    <Text style={styles.modalDetail}>
                      <Text style={styles.detailLabel}>Email: </Text>
                      {selectedUser.email}
                    </Text>
                    <Text style={styles.modalDetail}>
                      <Text style={styles.detailLabel}>Age: </Text>
                      {selectedUser.age}
                    </Text>
                    <Text style={styles.modalDetail}>
                      <Text style={styles.detailLabel}>Status: </Text>
                      <Text style={[
                        styles.statusText,
                        { color: selectedUser.status === 'active' ? '#4CAF50' : '#F44336' }
                      ]}>
                        {selectedUser.status.toUpperCase()}
                      </Text>
                    </Text>
                    <Text style={styles.modalDetail}>
                      <Text style={styles.detailLabel}>User ID: </Text>
                      {selectedUser.id}
                    </Text>
                  </View>
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.closeButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.deleteButton]}
                      onPress={() => {
                        handleDeleteUser(selectedUser.id);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalButtonText}>Delete User</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  controlPanel: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterControls: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#4285F4',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  viewControls: {
    flexDirection: 'row',
    gap: 5,
  },
  viewButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  activeView: {
    backgroundColor: '#4285F4',
  },
  viewButtonText: {
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridItem: {
    width: (width - 40) / 2,
    margin: 5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userAge: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  statusToggle: {
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 50,
  },
  emptyStateEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalAvatar: {
    marginBottom: 20,
  },
  modalAvatarText: {
    fontSize: 60,
  },
  modalDetails: {
    width: '100%',
    marginBottom: 25,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});