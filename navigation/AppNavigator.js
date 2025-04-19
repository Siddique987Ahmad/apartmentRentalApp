import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import {useSelector} from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ApartmentListScreen from '../screens/ApartmentListScreen';
import CreateApartmentScreen from '../screens/CreateApartmentScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const user = useSelector(state => state.auth.user);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={user ? "Home" : "Login"}>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        <Stack.Screen name="Apartment" component={ApartmentListScreen}/>
        <Stack.Screen name="CreateApartment" component={CreateApartmentScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
