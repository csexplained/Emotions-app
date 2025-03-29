import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { account } from './appwrite';
import useAuthStore from '@/store/authStore';

// Handle the OAuth callback
const handleOAuthCallback = async (url: string) => {
  try {
    // Extract the URL parameters
    const params = new URL(url).searchParams;
    const userId = params.get('userId');
    const secret = params.get('secret');
    
    if (userId && secret) {
      // Complete the OAuth session
      await account.updateSession(`${userId}:${secret}`);
      
      // Get user data
      const user = await account.get();
      
      // Update Zustand store
      useAuthStore.setState({ 
        isAuthenticated: true,
        user,
        loading: false
      });
      
      // Redirect to home screen
      router.replace('/');
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    useAuthStore.setState({ loading: false });
    router.replace('/auth');
  }
};

// Set up deep linking
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

  // Listen for incoming deep links
  Linking.addEventListener('url', ({ url }) => handleDeepLink(url));

  // Check if the app was launched from a deep link
  Linking.getInitialURL().then(url => handleDeepLink(url));

  // For web, we need to handle the redirect differently
  WebBrowser.maybeCompleteAuthSession();
}