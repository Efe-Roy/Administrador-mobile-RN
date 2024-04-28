import { View, Text, StatusBar, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
// import { baseURL } from '../../compras/redux/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseURL } from '../redux/utils';

export default function PreparingScreen({ route }) {
    const navigation = useNavigation();
    const { itemId } = route.params;
    console.log(itemId);

    const getUserDetail = async () => {
      try {
          // setLoading(true);
          const url = `${baseURL}/user-detail/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.get(url, {
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
          // console.log("Auth", response.data);
          setTimeout(()=>{
            if(response.data.is_admin){
              console.log("Navigate to Admin");
              navigation.navigate('Chart');
            }
            if(response.data.is_vendor){
              navigation.navigate('HomeStack');
              console.log("Navigate to Vendor");
            }
          },5000);
          // setLoading(false);
  
      } catch (error) {
          // setLoading(false);
          console.log(error)
      }
    };
    
    useEffect(() => { 
      getUserDetail();
    }, [route.params]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Image source={require('../assets/splash.png')} className="h-80 w-80" />
    </View>
  )
}