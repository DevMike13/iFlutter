import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
        //   borderTopWidth: 2,
          borderTopColor: 'white',
          height: 100,
        },
        headerShown: false,
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
