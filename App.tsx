import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '800138424713-ia3jh8a06l7jdsov8uos2nslu7d47g6k.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

// Function to handle Google login
const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

// Function to handle Google logout
const GoogleLogout = async () => {
  await GoogleSignin.signOut();
};

function App(): React.JSX.Element {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(''); // Reset error state
    try {
      const response = await GoogleLogin();
      const {idToken, user} = response.data;

      console.log('idToken', idToken);
      console.log('user', user);

      if (idToken && user) {
        setUserInfo(user);
        Alert.alert('Success', 'Login successful');
      }
    } catch (apiError) {
      console.log('handleGoogleLogin', apiError);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      await GoogleLogout();
      setUserInfo(null);
      Alert.alert('Success', 'Logout successful');
    } catch (apiError) {
      console.log('handleGoogleLogout', apiError);
      setError('Something went wrong during logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Text style={styles.helloText}>
          Hello{userInfo ? `, ${userInfo.name}` : ''}
        </Text>

        {!userInfo ? (
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogout}>
            <Text style={styles.googleButtonText}>Logout</Text>
          </TouchableOpacity>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {loading && <Text style={styles.loadingText}>Loading...</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  googleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#DB4437',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default App;
