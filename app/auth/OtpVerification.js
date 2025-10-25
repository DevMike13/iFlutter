import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { firestoreDB } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "../../store/useAuthStore";
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';

const { width } = Dimensions.get('window');

const OtpScreen = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(user?.email);
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      // const response = await axios.post(
      //   "https://asia-southeast1-iflutter-e9337.cloudfunctions.net/verifyOtp",
      //   { email: user?.email, otp }
      // );

      const response = await axios.post(
        "https://verifyotp-jhhe3b5kca-as.a.run.app",
        { email: user?.email, otp }
      );

      if (response.data.success) {
        await updateDoc(doc(firestoreDB, "users", user.uid), { isVerified: true });

        const { setUser } = useAuthStore.getState();
        setUser(user, user.role, user.isAccepted, true);

      } else {
        Alert.alert("Invalid OTP", response.data.message || "Incorrect code. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // try {
    //   await axios.post("https://asia-southeast1-iflutter-e9337.cloudfunctions.net/sendOtp", { email: user?.email });
    //   Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
    // } catch (error) {
    //   console.error("Resend OTP error:", error);
    //   Alert.alert("Error", "Failed to resend OTP. Please try again later.");
    // }
    try {
      await axios.post("https://sendotp-jhhe3b5kca-as.a.run.app", { email: user?.email });
      Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Error", "Failed to resend OTP. Please try again later.");
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
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to {"\n"}
        <Text style={styles.email}>{user?.email || "..."}</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
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
};

export default OtpScreen;

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
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
    color: "#555",
  },
  email: {
    fontFamily: "Poppins-SemiBold",
    color: "#2563eb",
  },
  input: {
    width: "80%",
    height: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
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
  resendText: {
    marginTop: 20,
    fontSize: 16,
    color: "#2563eb",
    fontFamily: "Poppins-Medium",
  },
});
