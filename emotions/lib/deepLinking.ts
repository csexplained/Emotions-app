/*
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { account } from './appwrite';
import { useAuthStore } from '@/store/authStore';

const handleOAuthCallback = async (url: string) => {
try {
  // Get the session after OAuth redirect
  const session = await account.getSession('current');
  const user = await account.get();

  // Update Zustand store
  useAuthStore.setState({
    isAuthenticated: true,
    user,
    loading: false
  });

  // Redirect to home screen
  router.replace('/');
} catch (error) {
  console.error('OAuth callback error:', error);
  useAuthStore.setState({ loading: false });
  router.replace('/auth');
}
};

export function setupDeepLinking() {
const handleDeepLink = async (url: string | null) => {
  if (!url) return;

  if (url.includes('auth-callback')) {
    await handleOAuthCallback(url);
  } else if (url.includes('auth-callback-error')) {
    console.error('OAuth failed:', url);
    useAuthStore.setState({ loading: false });
    router.replace('/auth');
  }
};

// Set up listeners
Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
Linking.getInitialURL().then(url => handleDeepLink(url));
WebBrowser.maybeCompleteAuthSession();
}  
 
*/
