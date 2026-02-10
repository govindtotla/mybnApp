import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function DrawerNavigationDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Menu items
  const menuItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'messages', label: '💬 Messages', icon: '💬', badge: 3 },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔', badge: 12 },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
    { id: 'help', label: '❓ Help & Support', icon: '❓' },
    { id: 'logout', label: '🚪 Logout', icon: '🚪', type: 'danger' },
  ];

  const [activeItem, setActiveItem] = useState('home');

  // Open drawer animation
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Close drawer animation
  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerOpen(false);
    });
  };

  // Handle menu item press
  const handleMenuItemPress = (itemId) => {
    setActiveItem(itemId);
    if (itemId === 'logout') {
      alert('Logout pressed!');
    }
    closeDrawer();
  };

  // Handle back button press
  const handleBackPress = () => {
    if (drawerOpen) {
      closeDrawer();
      return true; // Prevent default back action
    }
    return false; // Let system handle back action
  };

  // Setup BackHandler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, [drawerOpen]);

  // Render drawer content
  const renderDrawer = () => (
    <Animated.View
      style={[
        styles.drawerContainer,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeItem === item.id && styles.activeMenuItem,
              item.type === 'danger' && styles.dangerMenuItem,
            ]}
            onPress={() => handleMenuItemPress(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Text style={[
                styles.menuIcon,
                item.type === 'danger' && styles.dangerIcon,
              ]}>
                {item.icon}
              </Text>
              <Text style={[
                styles.menuLabel,
                activeItem === item.id && styles.activeMenuLabel,
                item.type === 'danger' && styles.dangerLabel,
              ]}>
                {item.label}
              </Text>
            </View>

            {/* Badge */}
            {item.badge && (
              <View style={[
                styles.menuBadge,
                item.type === 'danger' && styles.dangerBadge,
              ]}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}

            {/* Active indicator */}
            {activeItem === item.id && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>v1.0.0 • React Native Demo</Text>
      </View>
    </Animated.View>
  );

  // Render overlay
  const renderOverlay = () => (
    drawerOpen && (
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={closeDrawer}
          activeOpacity={1}
        />
      </Animated.View>
    )
  );

  // Render main content based on active item
  const renderContent = () => {
    const content = {
      home: { title: 'Home Dashboard', color: '#4CAF50' },
      profile: { title: 'User Profile', color: '#2196F3' },
      messages: { title: 'Messages', color: '#9C27B0' },
      notifications: { title: 'Notifications', color: '#FF9800' },
      settings: { title: 'Settings', color: '#607D8B' },
      help: { title: 'Help & Support', color: '#009688' },
      logout: { title: 'Login Screen', color: '#F44336' },
    }[activeItem];

    return (
      <View style={[styles.contentContainer, { backgroundColor: content.color + '10' }]}>
        <View style={styles.contentHeader}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.contentTitle}>{content.title}</Text>
          <View style={{ width: 44 }} /> {/* Spacer for alignment */}
        </View>

        <View style={styles.contentBody}>
          <Text style={styles.welcomeText}>Welcome to {content.title}</Text>
          <Text style={styles.contentText}>
            This is the main content area for the {content.title.toLowerCase()}.
            Tap the menu icon to open the navigation drawer.
          </Text>

          {/* Sample content cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📊 Quick Stats</Text>
              <Text style={styles.cardText}>• 15 new notifications</Text>
              <Text style={styles.cardText}>• 3 pending tasks</Text>
              <Text style={styles.cardText}>• 7 unread messages</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚀 Recent Activity</Text>
              <Text style={styles.cardText}>• Profile updated</Text>
              <Text style={styles.cardText}>• Settings changed</Text>
              <Text style={styles.cardText}>• New login detected</Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>How to use:</Text>
            <Text style={styles.instructionsText}>1. Tap ☰ to open drawer</Text>
            <Text style={styles.instructionsText}>2. Tap menu items to navigate</Text>
            <Text style={styles.instructionsText}>3. Tap overlay or press back to close</Text>
            <Text style={styles.instructionsText}>4. Try Android back button!</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Main Content */}
      {renderContent()}

      {/* Drawer */}
      {renderDrawer()}

      {/* Overlay */}
      {renderOverlay()}

      {/* Back Button Indicator (for demo purposes) */}
      <View style={styles.backIndicator}>
        <Text style={styles.backIndicatorText}>
          {drawerOpen ? 'Back Button: Will close drawer' : 'Back Button: Normal behavior'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Drawer Styles
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  drawerHeader: {
    backgroundColor: '#4285F4',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 2,
    position: 'relative',
  },
  activeMenuItem: {
    backgroundColor: '#f5f5f5',
  },
  dangerMenuItem: {
    marginTop: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 15,
    width: 30,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeMenuLabel: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
  dangerIcon: {
    color: '#F44336',
  },
  dangerLabel: {
    color: '#F44336',
  },
  menuBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dangerBadge: {
    backgroundColor: '#F44336',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#4285F4',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  // Overlay Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999,
    elevation: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  // Content Styles
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
  },
  menuButtonText: {
    fontSize: 24,
    color: '#333',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contentBody: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 30,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  // Back Indicator
  backIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
     padding: 12,
    alignItems: 'center',
  },
  backIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});