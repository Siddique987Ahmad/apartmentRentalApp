import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/auth/authAction';
import {InputField, AuthButton, AuthLink} from '../components/authComponents';
import {styles} from '../components/authStyles';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, error, user} = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    dispatch(loginUser({email, password}));
  }, [email, password, dispatch]);

  useEffect(() => {
    if (user) {
      Alert.alert('Success', 'Login successful');
      navigation.navigate('Home'); // Changed from 'Login' to 'Home'
    }
    if (error) {
      Alert.alert('Error', error);
    }
  }, [user, error, navigation]);

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

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

        <AuthButton loading={loading} onPress={handleLogin} text="Login" />

        <AuthLink
          navigation={navigation}
          text="Don't have an account?"
          linkText="Register"
          screen="Register"
        />
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
