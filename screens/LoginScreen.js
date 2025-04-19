import axios from 'axios';
import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch,useSelector } from 'react-redux';
import { loginUser } from '../redux/auth/authAction';

const LoginScreen = ({navigation}) => {
  const dispatch=useDispatch()
  const {loading,error,user}=useSelector(state=>state.auth)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Fields required');
      return;
    }
    dispatch(loginUser({email, password}));

  }
  useEffect(() => {
    if (user) {
      Alert.alert('Success', 'Login successful');
      navigation.navigate('Login');
    }
    if (error) {
      //navigation.navigate('Home');
      Alert.alert('Error', error);
    }
  }, [user, error,navigation]);
  //   try {
  //     const response = await axios.post(
  //       'http://192.168.222.83:4001/api/user/login',
  //       {
  //         email,
  //         password,
  //       },
  //     );
  //     if (response.status === 200) {
  //       Alert.alert('Successfull', 'Login Successfull');
  //       navigation.navigate('Home');
  //     }
  //   } catch (error) {
  //     navigation.navigate('Home');
  //     Alert.alert(
  //       'Error',
  //       error.response?.data?.message || 'Login Failed',
  //     );
  //   }
  // };
  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.KeyboardAvoidingView}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {/* <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      /> */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.loginText}>
              Don't have an account?{' '}
              <Text style={styles.loginLink}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 16,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  loginText: {
    marginTop: 20,
    color: '#fff',
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LoginScreen;
