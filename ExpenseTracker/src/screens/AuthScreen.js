// Authentication Screen - Login and Signup
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import useAuthStore from '../store/authStore';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { login, signup, isLoading, error } = useAuthStore();
  
  const handleSubmit = async () => {
    // Validation
    if (!email || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return;
    }
    
    if (!password || password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }
    
    if (!isLogin) {
      if (!name || name.length < 2) {
        Alert.alert('Validation Error', 'Name must be at least 2 characters');
        return;
      }
      
      if (password !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match');
        return;
      }
    }
    
    let result;
    if (isLogin) {
      result = await login(email, password);
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}> Expense Tracker</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={name}
              onChangeText={setName}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password * (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
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
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => {
            setIsLogin(!isLogin);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
          
          {/* Demo credentials */}
          {isLogin && (
            <View style={styles.demoHint}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}> user@example.com</Text>
              <Text style={styles.demoText}> password123</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#007AFF' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 30, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#007AFF', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  switchText: { textAlign: 'center', marginTop: 20, color: '#007AFF' },
  demoHint: { marginTop: 20, padding: 12, backgroundColor: '#F0F8FF', borderRadius: 8 },
  demoTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 4 },
  demoText: { fontSize: 12, color: '#666' }
});