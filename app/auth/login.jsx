import { 
  View, TextInput, Text, StyleSheet, TouchableOpacity, 
  Image, Dimensions, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestoreDB } from '../../firebase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import { useAuthStore } from '../../store/useAuthStore';
import axios from "axios";

const { width, height } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return alert('Please fill in both fields.');

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userRef = doc(firestoreDB, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert('Error', 'User record not found in Firestore.');
        return;
      }

      const userData = userSnap.data();
      setUser(firebaseUser, userData.role, userData.isAccepted, userData.isVerified);

      if (!userData.isVerified) {
        await axios.post("https://sendotp-jhhe3b5kca-as.a.run.app", { email: firebaseUser.email });
        return;
      }

      if (!userData.isAccepted) {
        Alert.alert('Pending Approval', 'Your account is awaiting admin approval.');
        router.replace('/auth/pending');
        return;
      }

      if (userData.role === 'admin') router.replace('/(admin)/startAdmin');
      else router.replace('/(user)/startUser');

    } catch (e) {
      console.log('Login error:', e);
      if (e.code === 'auth/network-request-failed') {
        alert('Network error. Please check your internet connection.');
      } else if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(e.code)) {
        alert('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.backgroundTop} style={styles.bgTop} resizeMode="contain" />
      <Image source={images.backgroundBottom} style={styles.bgBottom} resizeMode="contain" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={images.logo} style={styles.imageLogo} resizeMode="contain" />
          <Text style={styles.title}>Sign In</Text>

          {/* Email Input */}
          <View style={styles.inputMainContainer}>
            <Text style={styles.label}>Email address</Text>
            <View style={[styles.inputContainer, isFocusedEmail && styles.inputContainerFocused]}>
              <TextInput
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputMainContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, isFocusedPassword && styles.inputContainerFocused]}>
              <TextInput
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={!showPassword ? 'eye-off-outline' : "eye-outline"}
                  size={26}
                  color="#3B82F6"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => router.push('/auth/forgotPassword')}>
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
    position: 'relative',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 80,
  },
  bgTop: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  bgBottom: {
    position: 'absolute',
    width: width,
    bottom: -20,
    zIndex: -10,
  },
  imageLogo: {
    width: width * 0.5,
    height: height * 0.15,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: width * 0.12,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputMainContainer: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#a1a2a8',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainerFocused: {
    borderColor: '#3B82F6',
  },
  forgetText: {
    fontFamily: 'Poppins-Light',
    color: 'blue',
    textAlign: 'right',
    marginTop: 6,
  },
  loginButton:{ width: '70%', backgroundColor: '#c6c6c6', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 30, marginHorizontal: 'auto', marginTop: 16, borderWidth: 2, borderColor: '#a1a2a8', }, buttonText: { fontFamily: 'Poppins-SemiBold', fontSize: 20, color: 'white' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  registerText: {
    fontFamily: 'Poppins-Light',
  },
  registerButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#3B82F6',
  },
});

export default Login;
