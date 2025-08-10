import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { user, role, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || loading) return;

    const inPublicRoute = segments[0] === null || segments[0] === 'auth';
    const inAdminRoute = segments[0] === '(admin)';
    const inUserRoute = segments[0] === '(user)';

    if (!user && !inPublicRoute) {
      router.replace('/auth/login');
    } else if (user && role) {
      if (inPublicRoute) {
        router.replace(role === 'admin' ? '/(admin)' : '/(user)');
      } else {
        if (role === 'admin' && !inAdminRoute) router.replace('/(admin)');
        if (role === 'user' && !inUserRoute) router.replace('/(user)');
      }
    }
  }, [segments, user, role, loading, hasMounted]);

  if (!fontsLoaded && !error) {
    return null;
  }

  if (loading || !hasMounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
