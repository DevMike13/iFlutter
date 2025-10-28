import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch, 
  doc 
} from 'firebase/firestore';
import { firestoreDB } from '../../firebase';
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { images } from '../../constants';

export default function AdminTabsLayout() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(firestoreDB, 'notifications'),
      orderBy('date', 'desc')
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setNotifications(notifList);
  
      const unread = notifList.filter(n => !n.isViewed).length;
      setUnreadCount(unread);
    });
  
    return () => unsubscribe();
  }, []);

  const markNotificationsAsViewed = async () => {
    const batch = writeBatch(firestoreDB);
  
    notifications.forEach(n => {
      if (!n.isViewed) {
        const notifRef = doc(firestoreDB, 'notifications', n.id);
        batch.update(notifRef, { isViewed: true });
      }
    });
  
    await batch.commit();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const dateObj = timestamp.toDate();
    return (
      dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) +
      ' ' +
      dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const NotificationDropdown = () => {
    if (!showDropdown) return null;
    return (
      <View style={styles.dropdown}>
        <Text style={styles.dropdownHeaderText}>Notifications</Text>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.dropdownItem}>
                <Text
                  style={[
                    styles.dropdownText,
                    !item.isViewed && styles.unreadText,
                  ]}
                >
                  {item.content}
                </Text>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.dropdownText}>No notifications</Text>
        )}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          height: 70,
          marginHorizontal: 20,
          marginBottom:50,
          borderRadius: 60,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20, // helps center vertically
        },
        headerShown: true,
        headerTitle: '',
        headerLeft: () => (
          <View style={styles.headerContainer}>
            <Image 
              source={images.logo}
              style={styles.imageLogo}
              resizeMode='contain'
            />
            <Text style={styles.appNameText}>iFlutter</Text>
          </View>
        ),
        headerRight: () => (
          <View>
            <TouchableOpacity
              onPress={() => {
                setShowDropdown(!showDropdown);
                if (!showDropdown) markNotificationsAsViewed();
              }}
              style={styles.notificationButton}
            >
              <View style={styles.notificationContainer}>
                <Ionicons name="notifications-outline" size={26} color="#333" />
                {unreadCount > 0 && (
                  <View style={styles.notificationCountContainer}>
                    <Text style={styles.notificationCountText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <NotificationDropdown />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={focused ? '#007AFF' : '#999'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/threshold"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={26}
              color={focused ? '#007AFF' : '#999'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/butterfly"
        options={{
          tabBarIcon: ({ focused }) => (
            // <MaterialCommunityIcons
            //   name="butterfly"
            //   size={26}
            //   color={focused ? '#007AFF' : '#999'}
            // />
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={26}
              color={focused ? '#007AFF' : '#999'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/about"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              size={26}
              color={focused ? '#007AFF' : '#999'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/menu"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'menu' : 'menu-outline'}
              size={26}
              color={focused ? '#007AFF' : '#999'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  imageLogo: {
    width: 36,
    height: 36,
  },
  appNameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginLeft: 6,
    color: '#333',
  },
  notificationButton: {
    marginRight: 16,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationCountContainer: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 300,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
    marginBottom: 6,
  },
  dropdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  unreadText: {
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});
