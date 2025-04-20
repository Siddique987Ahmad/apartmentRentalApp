import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch,useSelector } from 'react-redux';
import { registerUser } from '../redux/auth/authAction';
import { InputField, AuthButton, AuthLink } from '../components/authComponents';
import { styles } from '../components/authStyles';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userName || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const result = await dispatch(
        registerUser({ userName, email, password, role }),
      );
      
      if (registerUser.fulfilled.match(result)) {
        Alert.alert('Success', 'Registration successful');
        navigation.navigate('Login');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register Account</Text>

        <InputField
          icon="user"
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
        />

        <InputField
          icon="envelope"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          icon="lock"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(prev => !prev)}
        />

        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'user' && styles.selectedRoleButton,
            ]}
            onPress={() => setRole('user')}>
            <Text
              style={[
                styles.roleButtonText,
                role === 'user' && styles.selectedRoleText,
              ]}>
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'realtor' && styles.selectedRoleButton,
            ]}
            onPress={() => setRole('realtor')}>
            <Text
              style={[
                styles.roleButtonText,
                role === 'realtor' && styles.selectedRoleText,
              ]}>
              Realtor
            </Text>
          </TouchableOpacity>
        </View>

        <AuthButton 
          loading={loading} 
          onPress={handleRegister} 
          text="Register" 
        />

        <AuthLink
          navigation={navigation}
          text="Already have an account?"
          linkText="Login"
          screen="Login"
        />
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;
