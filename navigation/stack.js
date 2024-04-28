import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { errorAuth, initAuth, logoutUser, successAuth } from '../redux/features/authSlice';
import { useEffect, useState } from 'react';
import Splash from '../components/Splash';
import Dashboard from '../screens/DashboardScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ChartScreen from '../screens/ChartScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import axios from 'axios';
import { baseURL } from '../redux/utils';
import CouponScreen from '../screens/CouponScreen';
import CategoryScreen from '../screens/CategoryScreen';
import OrderScreen from '../screens/admin/OrderScreen';
import PreparingScreen from '../screens/PreparingScreen';
import MsgScreen from '../screens/MsgScreen';
import EditScreen from '../screens/EditScreen';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const MyDrawer = () => {
  const [userAuth, setUserAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upCount, setUpCount] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const logOutFunc = () => {
    dispatch(logoutUser(navigation));
  }


  const getUserDetail = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/user-detail/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        // console.log("jj", jwtToken);
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("Auth", response.data);
        setUserAuth(response.data);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => { 
    getUserDetail();
  }, []);


  return (
    <Drawer.Navigator 
      screenOptions={{headerShown: false}}
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View className='p-5'>
              <Text className='text-2xl'>Hi</Text>
              <Text className='text-3xl mt-2 font-bold'>{userAuth?.username}</Text>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem 
              label='Category'
              icon={()=> (
                  <Icon.Grid height={20} width={20} strokeWidth="2.5" stroke="black" />
              )}
            />
            <DrawerItem 
              label='Sign Out'
              onPress={()=> logOutFunc()}
              icon={()=> (
                  <Icon.Power height={20} width={20} strokeWidth="2.5" stroke="red" />
              )}
            />
          </SafeAreaView>
        )
      }}
    >
      <Drawer.Screen 
        name="Prepare" component={PreparingScreen} 
        initialParams={{ itemId: 1 }}
        options={{
          title: 'Prepare',
          drawerIcon: ()=> <Icon.CloudSnow height={20} width={20} strokeWidth="2.5" stroke="black" />
        }} 
      />
      
      {userAuth?.is_vendor && 
        <Drawer.Screen name="HomeStack" component={HomeStack} options={{
          title: 'Hogar',
          drawerIcon: ()=> <Icon.Home height={20} width={20} strokeWidth="2.5" stroke="black" />
        }} />
      }

      {userAuth?.is_admin && 
        <>
          <Drawer.Screen name="Chart" component={ChartScreen} options={{
            title: 'Panel',
            drawerIcon: ()=> <Icon.BarChart2 height={20} width={20} strokeWidth="2.5" stroke="black" />
          }} />
          <Drawer.Screen name="AdminStack" component={AdminStack} options={{
            title: 'Administrador',
            drawerIcon: ()=> <Icon.Zap height={20} width={20} strokeWidth="2.5" stroke="black" />
          }} />
          <Drawer.Screen name="Coupon" component={CouponScreen} options={{
            title: 'Cupón',
            drawerIcon: ()=> <Icon.Box height={20} width={20} strokeWidth="2.5" stroke="black" />
          }}/>
          <Drawer.Screen name="Order" component={OrderScreen} options={{
            title: 'Pedidos',
            drawerIcon: ()=> <Icon.ShoppingCart height={20} width={20} strokeWidth="2.5" stroke="black" />
          }}/>
          <Drawer.Screen name="Message" component={MsgScreen} options={{
            title: 'Mensaje',
            drawerIcon: ()=> <Icon.MessageCircle height={20} width={20} strokeWidth="2.5" stroke="black" />
          }}/>
          {/* <Drawer.Screen name="Category" component={CategoryScreen} options={{
            title: 'Category',
            drawerIcon: ()=> <Icon.Grid height={20} width={20} strokeWidth="2.5" stroke="black" />
          }}/> */}
        </>
      }
    </Drawer.Navigator>
  );
}

export const HomeStack = () => {
  return (
    <Stack.Navigator 
      // initialRouteName='Home' 
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Home" component={Dashboard} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
    </Stack.Navigator>
  );
}

export const AdminStack = () => {
  return (
    <Stack.Navigator 
      // initialRouteName='Home' 
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Home" component={AdminScreen} />
    </Stack.Navigator>
  );
}

export const AuthStack = () => {
  const authData = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        dispatch(initAuth());
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        if (jwtToken !== null) {
          dispatch(successAuth());
          setTimeout(() => {
            navigation.navigate('Home');
          }, 1000);
            // console.log(jwtToken)
            // navigation.navigate('Home')
        } else {
            // navigation.navigate('Login');
            dispatch(errorAuth());
            setTimeout(() => {
              navigation.navigate('Login');
            }, 1000);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    fetchToken();
  }, [authData.isLoggedIn]);

  const load = true;

  return (
    <Stack.Navigator 
      // initialRouteName='Login' 
      screenOptions={{headerShown: false}}
    >
      {authData.Loading ? (
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
        ) : authData.isLoggedIn ? (
          // <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Home"
            component={MyDrawer}      // This is where I added MyDrawer         
            headerLeft={null}
            gestureEnabled={false}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          </>
        )}
    </Stack.Navigator>
  );
}
