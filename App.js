import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import { Router } from './navigation/Router';
import { Provider } from 'react-redux'
import store from './redux/store';
import registerNNPushToken from 'native-notify';

export default function App() {
  registerNNPushToken(20768, '4Z21kOS8VwGoxdAjOJaYc7');
  
  return (
    <Provider store={store}>
      <Router />
      <Toast />
    </ Provider>
  );
}

