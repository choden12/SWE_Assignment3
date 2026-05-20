// It Import React and useState hook
import React, { useState } from 'react';

// It import React Native components
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';

// It import authentication store
import useAuthStore from '../store/authStore';

// It Main Authentication Screen Component
export default function AuthScreen({ onAuthSuccess }) {

// It State to switch between Login and Signup
  const [isLogin, setIsLogin] = useState(true);

  // It State for Full Name input
  const [name, setName] = useState('');

  // It State for Email input
  const [email, setEmail] = useState('');

  // State for Password input
  const [password, setPassword] = useState('');

  // It state for Confirm Password input
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // It get authentication functions and states from store
  const { login, signup, isLoading, error } = useAuthStore();
  
  // Function to handle Login or Signup
  const handleSubmit = async () => {

    // Validate email
    if (!email || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return;
    }
    
    if (!password || password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }
    
    if (!isLogin) {

      // It Validate the name
      if (!name || name.length < 2) {
        Alert.alert('Validation Error', 'Name must be at least 2 characters');
        return;
      }
      
      // It Check if passwords match
      if (password !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match');
        return;
      }
    }
    
    let result;

    // For Login user
    if (isLogin) {
      result = await login(email, password);

    // For Signup user
    } else {
      result = await signup(name, email, password);
    }
    if (result.success && onAuthSuccess) {
      onAuthSuccess();

    } else if (result.error) {
      Alert.alert('Error', result.error);
    }
  };
  
  return (

    // For Prevent keyboard overlap
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Card Container */}
        <View style={styles.card}>

          {/* App Title */}
          <Text style={styles.title}> Expense Tracker</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Text>
          
          {/* For full Name Input (Signup only) */}
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={name}
              onChangeText={setName}
            />
          )}
          
          {/* For Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password * (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {/* Confirm Password Input (Signup only) */}
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          {/* For Login/Signup Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >

            {/* To Show loading spinner while processing */}
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (

              // For Button text
              <Text style={styles.buttonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* for Switch between Login and Signup */}
          <TouchableOpacity onPress={() => {

            // For Toggle mode
            setIsLogin(!isLogin);

            // To Clear all fields
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }}>

            {/* To Switch text */}
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
          
          {/* For Credentials Section */}
          {isLogin && (
            <View style={styles.demoHint}>

              {/* For Demo Title */}
              <Text style={styles.demoTitle}>Demo Credentials:</Text>

              {/* For Demo Email */}
              <Text style={styles.demoText}> user@example.com</Text>

              {/* Demo Password */}
              <Text style={styles.demoText}> password123</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// For Styles Section
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF'
  },

  // For ScrollView content style
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },

  // For Card style
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    elevation: 5
  },


  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 10
  },


  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30
  },

  // For Input field style
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16
  },

  // For Button style
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },


  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },

  
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10
  },

  // For Login/Signup switch text style
  switchText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007AFF'
  },

  // For Demo credentials box style
  demoHint: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8
  },

  // For Demo title style
  demoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4
  },

  // For Demo text style
  demoText: {
    fontSize: 12,
    color: '#666'
  }
});