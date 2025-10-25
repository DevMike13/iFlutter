import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';
import { images } from '../../../constants';

export default function MenuScreen() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Rounded User Icon */}
      <View style={styles.avatarWrapper}>
        <Image source={images.userIcon} style={styles.avatar} resizeMode="cover" />
      </View>

      {/* Buttons */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={[styles.menuButton, styles.logoutButton]}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    marginBottom: 40,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuButton: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#767577',
    alignItems: 'center',
    marginVertical: 8,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});
