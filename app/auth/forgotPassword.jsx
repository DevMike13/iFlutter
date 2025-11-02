import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { auth } from "../../firebase"; // ✅ Make sure this is imported

const { width } = Dimensions.get("window");

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address first.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset Sent",
        `A password reset email has been sent to ${email}. Please check your inbox.`
      );
      router.replace("/auth/login");
    } catch (error) {
      console.log("Forgot password error:", error);
      if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("No Account Found", "No user found with this email address.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.backgroundTop} style={styles.bgTop} resizeMode="contain" />

      <Image source={images.logo} style={styles.imageLogo} resizeMode="contain" />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email below and we’ll send you a password reset link.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/auth/login")}>
        <Text style={styles.resendText}>Back to Login</Text>
      </TouchableOpacity>

      <Image source={images.backgroundBottom} style={styles.bgBottom} resizeMode="contain" />
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    position: "relative",
  },
  bgTop: {
    position: "absolute",
    width: "100%",
    top: 0,
  },
  bgBottom: {
    position: "absolute",
    width: width,
    bottom: -30,
    zIndex: -10,
  },
  imageLogo: {
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 28,
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
  input: {
    width: "80%",
    height: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "70%",
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "white",
  },
  resendText: {
    marginTop: 20,
    fontSize: 16,
    color: "#2563eb",
    fontFamily: "Poppins-Medium",
  },
});
