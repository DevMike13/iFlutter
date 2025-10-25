import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { images } from '../../constants';


const { width } = Dimensions.get('window');

export default function PendingScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={images.backgroundTop}
        style={styles.bgTop}
        resizeMode='contain'
      />

      <Image 
        source={images.logo}
        style={styles.imageLogo}
        resizeMode='contain'
      />
      <Text style={styles.title}>Account Pending Approval</Text>
      <Text style={styles.message}>
        Thank you for registering. Your account is awaiting admin approval.
        You’ll be notified once it’s accepted.
      </Text>

        <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await logout();
              router.replace('/auth/login');
          }} 
        >
            <Text style={styles.buttonText}>
              Back
            </Text>
        </TouchableOpacity>
        <Image 
            source={images.backgroundBottom}
            style={styles.bgBottom}
            resizeMode='contain'
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    position: 'relative'
  },
  bgTop:{
      position: 'absolute',
      width: '100%',
      top: 0
  },
  bgBottom:{
      position: 'absolute',
      width: width,
      bottom: -30,
      zIndex: -10
  },
  imageLogo: {
      marginHorizontal: 'auto'
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button:{
    width: '70%',
    backgroundColor: '#c6c6c6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 'auto',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#a1a2a8',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: 'white'
  },
});
