import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { setDoc, doc } from 'firebase/firestore';
import { auth, firestoreDB } from '../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants';
import axios from 'axios';

const { width } = Dimensions.get('window');
const roles = ['Admin', 'Staff'];

const Register = () => {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState(roles[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Confirm password length:', confirmPassword.length);

    // Clear previous errors
    setError('');
    setLoading(true);

    // Input validation
    if (!email.trim()) {
      const errorMsg = 'Email is required.';
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
      setLoading(false);
      return;
    }

    if (!password) {
      const errorMsg = 'Password is required.';
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters.';
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = 'Passwords do not match.';
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
      setLoading(false);
      return;
    }

    try {
      console.log('Creating user with Firebase Auth...');
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCred.user.uid);

      console.log('Creating user document in Firestore...');
      await setDoc(doc(firestoreDB, 'users', userCred.user.uid), { 
        role: activeRole.toLowerCase(),
        email: email,
        isAccepted: false,
        isVerified: false,
        createdAt: new Date().toISOString()
      });
      console.log('User document created successfully in Firestore');

      // try {
      //   await axios.post('https://asia-southeast1-iflutter-e9337.cloudfunctions.net/sendOtp', { email });
      // } catch (otpError) {
      //   console.error('Error sending OTP:', otpError);
      //   Alert.alert('Error', 'Failed to send OTP. Please try again later.');
      // }

      try {
        await axios.post('https://sendotp-jhhe3b5kca-as.a.run.app', { email });
      } catch (otpError) {
        console.error('Error sending OTP:', otpError);
        Alert.alert('Error', 'Failed to send OTP. Please try again later.');
      }

    } catch (error) {
      console.log('=== REGISTRATION ERROR ===');
    
      let errorMessage = 'Registration failed.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password authentication is not enabled.';
            break;
          default:
            errorMessage = 'Registration failed. Please try again.';
        }
      } else {
        errorMessage = 'Registration failed. Please try again.';
      }
      
      // setError(errorMessage);
      Alert.alert("Registration Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.tabContainer}>
        {roles.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveRole(item)}
            style={[
              styles.tabButton,
              activeRole === item ? styles.activeTabButton : styles.inactiveTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeRole === item ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>Email address</Text>
        <View 
          style={[
            styles.inputContainer,
            isFocusedEmail && styles.inputContainerFocused
          ]}
        >
          <TextInput 
            placeholder="Enter email" 
            value={email}
            onChangeText={setEmail} 
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setIsFocusedEmail(true)} 
            onBlur={() => setIsFocusedEmail(false)} 
          />
        </View>
      </View>
      
      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>Password</Text>
        <View 
          style={[
            styles.inputContainer,
            isFocusedPassword && styles.inputContainerFocused
          ]}
        >
          <TextInput 
            placeholder="Enter password" 
            onFocus={() => setIsFocusedPassword(true)} 
            onBlur={() => setIsFocusedPassword(false)} 
            secureTextEntry={!showPassword} 
            value={password} 
            onChangeText={setPassword} 
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={`${!showPassword ? 'eye-off-outline' : "eye-outline"}`}
              size={28}
              color='blue'
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[styles.inputContainer, isFocusedConfirmPassword && styles.inputContainerFocused]}>
          <TextInput
            placeholder="Confirm password"
            onFocus={() => setIsFocusedConfirmPassword(true)}
            onBlur={() => setIsFocusedConfirmPassword(false)}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={`${!showConfirmPassword ? 'eye-off-outline' : "eye-outline"}`}
              size={28}
              color='blue'
            />
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <TouchableOpacity 
        onPress={handleRegister} 
        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.registerButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
    textAlign: 'center'
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputMainContainer:{
    width: '100%',
    height: 'auto',
    marginVertical: 10
  },
  input : {
    flex : 1,
    fontFamily: 'Poppins-Regular'
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
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  forgetText: {
    fontFamily: 'Poppins-Light',
    color: 'blue'
  },
  registerButton:{
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
  registerButtonDisabled: {
    backgroundColor: '#d3d3d3',
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: 'white'
  },
  registerContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  registerText: {
    fontFamily: 'Poppins-Light'
  },
  registerButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'blue'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#c4c4c4',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activeTabButton: {
    backgroundColor: '#19354d',
  },
  
  inactiveTabButton: {
    backgroundColor: '#c4c4c4',
  },
  
  tabText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  
  activeTabText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
  },
  
  inactiveTabText: {
    color: '#6b7280',
  },
});

export default Register;