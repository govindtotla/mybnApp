import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { authService, User } from '../services/authService';
import { COLORS } from '../utils/constants';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
      loadUserData();
    }, []);

    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

  const handleSignOut = async () => {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await authService.signOut();
              router.replace('/welcome');
            },
          },
        ]
      );
    };

  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>{user?.name.charAt(0).toUpperCase()}</Text>
            <View style={styles.userNameGroup}>
              <Text style={styles.userName}>{user?.name}sdfsdf</Text>
              <Text style={styles.userEmail}>{user?.email}sdfsdfsdf</Text>
            </View>
          </View>
        </View>

        <DrawerContentScrollView {...props}>
        {/* Menu Items */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/business-list')}>
              <View style={styles.menuItemContent}>
                <Ionicons name="list-circle-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>Home</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/business-profile')}>
              <View style={styles.menuItemContent}>
                <Ionicons name="business-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>My Business</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/business-banners')}>
              <View style={styles.menuItemContent}>
                <Ionicons name="image-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>My Banners</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/business-products')}>
              <View style={styles.menuItemContent}>
                <Ionicons name="cart-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>My Products</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Ionicons name="language-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>Language</Text>
              </View>
              <Text style={styles.menuItemValue}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Ionicons name="moon-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Ionicons name="help-circle-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Ionicons name="document-text-outline" size={24} color={COLORS.text.primary} />
                <Text style={styles.menuItemText}>Terms & Policies</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>
          </DrawerContentScrollView>
        {/* Drawer Footer */}
        <View style={styles.drawerFooter}>
            {/* Sign Out */}
            <TouchableOpacity
              style={[styles.menuItem, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
                <Text style={[styles.menuItemText, styles.signOutText]}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          <Text style={styles.footerText}>v1.0.0 • MYBN</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
  },

  drawerHeader: {
    backgroundColor: '#4285F4',
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  userAvatar: {
    flexDirection: 'row',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userNameGroup: {
    flex:1,
    flexDirection: 'column',
    borderWidth:1,
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
    section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 8,
    marginBottom: 10,
    borderRadius: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  menuItemValue: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
    signOutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0,
  },
  signOutText: {
    color: COLORS.error,
  },
});
