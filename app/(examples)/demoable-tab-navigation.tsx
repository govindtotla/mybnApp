import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TabNavigationDemo() {
  const [activeTab, setActiveTab] = useState('home');
  const [indicatorAnim] = useState(new Animated.Value(0));

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
  // Tab data
  const tabs = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'explore', label: '🔍 Explore', icon: '🔍' },
    { id: 'cart', label: '🛒 Cart', icon: '🛒', badge: 3 },
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  // Tab content
  const tabContents = {
    home: {
      title: 'Welcome Home',
      content: 'This is your home screen with latest updates.',
      color: '#4CAF50',
    },
    explore: {
      title: 'Explore Products',
      content: 'Discover amazing products and services.',
      color: '#2196F3',
    },
    cart: {
      title: 'Your Cart',
      content: 'You have 3 items in your cart. Ready to checkout?',
      color: '#FF9800',
    },
    profile: {
      title: 'User Profile',
      content: 'Manage your account and preferences.',
      color: '#9C27B0',
    },
    settings: {
      title: 'App Settings',
      content: 'Customize your app experience.',
      color: '#607D8B',
    },
  };

  // Handle tab change with animation
  const handleTabChange = (tabId, index) => {
    Animated.spring(indicatorAnim, {
      toValue: index * (width / tabs.length),
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();

    setActiveTab(tabId);
  };

  // Render tab bar
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tabButton}
          onPress={() => handleTabChange(tab.id, index)}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[
            styles.tabLabel,
            activeTab === tab.id && styles.activeTabLabel
          ]}>
            {tab.label.replace(/[^\w\s]/g, '')} {/* Remove emoji from label */}
          </Text>

          {/* Badge */}
          {tab.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tab.badge}</Text>
            </View>
          )}

          {/* Active indicator */}
          {activeTab === tab.id && (
            <View style={[styles.activeIndicator, { backgroundColor: tabContents[tab.id].color }]} />
          )}
        </TouchableOpacity>
      ))}

      {/* Animated sliding indicator */}
      <Animated.View
        style={[
          styles.slidingIndicator,
          {
            backgroundColor: tabContents[activeTab].color,
            transform: [{ translateX: indicatorAnim }],
            width: width / tabs.length,
          }
        ]}
      />
    </View>
  );

  // Render tab content
  const renderTabContent = () => {
    const content = tabContents[activeTab];

    return (
      <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentHeader, { backgroundColor: content.color }]}>
          <Text style={styles.contentTitle}>{content.title}</Text>
        </View>

        <View style={styles.contentBody}>
          <Text style={styles.contentText}>{content.content}</Text>

          {/* Sample cards */}
          {activeTab === 'home' && (
            <View style={styles.cardsContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📈 Today's Stats</Text>
                <Text style={styles.cardText}>15 new notifications</Text>
                <Text style={styles.cardText}>3 pending tasks</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🎯 Quick Actions</Text>
                <Text style={styles.cardText}>Add new item</Text>
                <Text style={styles.cardText}>View analytics</Text>
              </View>
            </View>
          )}

          {activeTab === 'explore' && (
            <View style={styles.grid}>
              {['Product A', 'Product B', 'Product C', 'Product D'].map((item, i) => (
                <View key={i} style={styles.gridItem}>
                  <Text style={styles.gridText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'cart' && (
            <View>
              {['Item 1 - $19.99', 'Item 2 - $29.99', 'Item 3 - $14.99'].map((item, i) => (
                <View key={i} style={styles.cartItem}>
                  <Text style={styles.cartItemText}>{item}</Text>
                  <TouchableOpacity style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout - $64.97</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'profile' && (
            <View style={styles.profileSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john@example.com</Text>

              <View style={styles.profileOptions}>
                <TouchableOpacity style={styles.profileOption}>
                  <Text style={styles.profileOptionText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileOption}>
                  <Text style={styles.profileOptionText}>Privacy Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'settings' && (
            <View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <View style={styles.toggle} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <View style={styles.toggle} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingValue}>English</Text>
              </View>
            </View>
          )}

          {/* Bottom padding */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tab Navigation Demo</Text>
        <Text style={styles.headerSubtitle}>Swipe or tap to navigate</Text>
      </View>

      {/* Tab Bar */}
      {renderTabBar()}

      {/* Content Area */}
      <View style={styles.contentArea}>
        {renderTabContent()}
      </View>

      {/* Tab Indicator Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>
          Active Tab: <Text style={{ color: tabContents[activeTab].color, fontWeight: 'bold' }}>
            {tabContents[activeTab].title}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#333',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: '30%',
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '80%',
    height: 3,
    borderRadius: 1.5,
    alignSelf: 'center',
  },
  slidingIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
  },
  contentArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    padding: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentBody: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cartItemText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  profileOptions: {
    width: '100%',
  },
  profileOption: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  legend: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});