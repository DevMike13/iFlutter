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
        <Text style={styles.dropdownHeaderText}>Notifications:</Text>
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
                  {item.notifType === 'alert' && '⚠️ '}
                  {item.notifType === 'info' && 'ℹ️ '}
                  {item.notifType === 'success' && '✅ '}
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
          borderTopColor: '#c4c4c4',
          backgroundColor: '#c4c4c4',
          height: 100,
        },
        headerStyle: {
          backgroundColor: '#c4c4c4',
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
                if (!showDropdown) {
                  markNotificationsAsViewed();
                }
              }}
              style={styles.notificationButton}
            >
              <View style={styles.notificationContainer}>
                <Ionicons name="notifications-outline" size={28} color="#000" />
                {unreadCount > 0 && (
                  <View style={styles.notificationCountContainer}>
                    <Text style={styles.notificationCountText}>
                      {unreadCount}
                    </Text>
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
          title: 'Home',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontWeight: focused ? '700' : '400', fontSize: 11, color: focused ? 'blue' : 'gray' }}>
              {/* Grades */}
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={30} color={focused ? 'blue' : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/threshold"
        options={{
          title: 'Threshold',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontWeight: focused ? '700' : '400', fontSize: 11, color: focused ? 'blue' : 'gray' }}>
              {/* Threshold */}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={30} color={focused ? 'blue' : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/butterfly"
        options={{
          title: 'butterfly',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontWeight: focused ? '700' : '400', fontSize: 11, color: focused ? 'blue' : 'gray' }}>
              {/* Student Info */}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="butterfly" size={30} color={focused ? 'blue' : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/about"
        options={{
          title: 'About',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontWeight: focused ? '700' : '400', fontSize: 11, color: focused ? 'blue' : 'gray' }}>
              {/* Registration */}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={30} color={focused ? 'blue' : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/menu"
        options={{
          title: 'Menu',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontWeight: focused ? '700' : '400', fontSize: 11, color: focused ? 'blue' : 'gray' }}>
              {/* Profile */}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'menu' : 'menu-outline'} size={30} color={focused ? 'blue' : 'gray'} />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  headerContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  imageLogo: {
    width: 40,
    height: 40
  },
  appNameText:{
    fontFamily: 'Poppins-Regular',
    fontSize: 18
  },
  notificationButton:{
    marginRight: 16
  },
  notificationContainer:{
    position: 'relative'
  },
  notificationCountContainer:{
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCountText:{
    color: '#fff', 
    fontSize: 10
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 20,
    backgroundColor: '#9b9b9b',
    borderRadius: 6,
    elevation: 5,
    padding: 8,
    width: 300,
    maxHeight: 300,
    zIndex: 999,
  },
  dropdownHeaderText:{
    fontSize: 16, 
    color: '#000',
    fontFamily: 'Poppins-Bold',
  },
  dropdownItem: {
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  dropdownText: { 
    fontSize: 16, 
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  dateText:{
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
    color: 'blue'
  }
})
