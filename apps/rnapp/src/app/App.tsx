import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, ForgotPassword, Dashboard } from '../screens';
import { Provider as PaperProvider } from 'react-native-paper';
import { LoginNative, SignupNative } from '@libs/components/native';

//import { DTO } from '@libs/shared-types';
const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={LoginNative} />
          <Stack.Screen name="Register" component={SignupNative} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
