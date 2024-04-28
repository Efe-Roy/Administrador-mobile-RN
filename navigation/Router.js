import {NavigationContainer} from '@react-navigation/native';
import { AuthStack } from './stack';

export const Router = () => {

  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};
