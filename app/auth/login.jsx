import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../../constants'

const { width } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert('Login failed');
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
      <Text style={styles.title}>Sign In</Text>

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
            onChangeText={setEmail} 
            style={styles.input}
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

      <TouchableOpacity>
        <Text style={styles.forgetText}>Forget Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
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
    fontSize: 50,
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
  forgetText: {
    fontFamily: 'Poppins-Light',
    color: 'blue'
  },
  loginButton:{
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
  }
});

export default Login;
