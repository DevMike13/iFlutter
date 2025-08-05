import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';

export default function Layout() {
  const { user, role, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

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

  if (loading || !hasMounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
