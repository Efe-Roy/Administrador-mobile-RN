import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { baseURL } from '../../redux/utils';
import CurrencyInput from 'react-native-currency-input';

export default function UserDetail({isModalVisible, userID}) {
  const [amount, setAmount] = useState(null);
  const [debit, setDebit] = useState(null);
  const [userAuth, setUserAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getUserDetail = async () => {
    if (userID){
      try {
          setLoading(true);
          const url = `${baseURL}/user-detail/${userID}/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.get(url, {
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
          // console.log("zzww", response.data);
          setUserAuth(response.data);
          setLoading(false);
  
      } catch (error) {
          setLoading(false);
          console.log(error)
      }
    };
  }

  const depositUserAcc = async () => {
    if (userID){
      try {
          setLoading(true);
          const url = `${baseURL}/deposit/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.post(url, {
            user_id: userID,
            amount: amount
          } ,{
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
          console.log(response.data);
          setRefresh(!refresh);
          setLoading(false);
          setAmount(null);
  
      } catch (error) {
          setLoading(false);
          console.log(error)
      }
    };
  }

  const withdrawUserAcc = async () => {
    if (userID){
      try {
          setLoading(true);
          const url = `${baseURL}/withdraw/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.post(url, {
            user_id: userID,
            amount: debit
          } ,{
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
          console.log(response.data);
          setRefresh(!refresh);
          setLoading(false);
          setDebit(null);
  
      } catch (error) {
          setLoading(false);
          console.log(error)
      }
    };
  }

  useEffect(() => {
    getUserDetail();
  }, [isModalVisible, userID, refresh])
  
  
  return (
    <SafeAreaView className='flex-1 bg-[#f6f6f6]'>
      <View className='flex-grow flex-shrink flex-0'>
        {loading? <ActivityIndicator size={'large'} /> :
          <View className='p-2 flex flex-col rounded-b-[100px] items-center bg-white border-t border-b border-gray-300 shadow-md'>
            {userAuth?.image ?
              <Image
                className='h-[100px] w-[100px] rounded-full'
                alt=""
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
                }}
              /> :
              <FeatherIcon 
                color="#1976d3" 
                name="user" 
                className='bg-blue-100 rounded-full'
                size={100} 
              />
            }

            <Text className='mt-2 text-lg font-semibold text-gray-900'>{userAuth?.username}</Text>

            <Text className='mt-1 text-base font-normal text-gray-600'>{userAuth?.email}</Text>
            <Text className='mt-1 text-2xl font-bold text-green-600'>$ {userAuth?.acc_balance}</Text>
          </View>
        }

        <Text className='mt-7 ml-8 text-lg font-semibold text-green-900'>CUENTA DEL FONDO</Text>
        <View className='flex-row justify-center items-center'>
          <View className='px-2 py-2 bg-green-100 rounded-xl w-2/3'>
            <CurrencyInput
              value={amount}
              onChangeValue={setAmount}
              // onBlur={onBlur}
              prefix="$"
              delimiter=","
              separator="."
              precision={2}
              style={{ color: 'black', fontSize: 25 }}
            />
          </View>
          <TouchableOpacity onPress={()=> depositUserAcc()}>
            <View className='py-2 px-2 flex flex-row items-center justify-center bg-green-500 rounded-lg'>
              <Text className='mr-2 text-base font-semibold text-white'>Crédito</Text>

              <FeatherIcon color="#fff" name="plus-circle" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <Text className='mt-7 ml-8 text-lg font-semibold text-red-900'>CUENTA DE DEBITO</Text>
        <View className='flex-row justify-center items-center'>
          <View className='px-2 py-2 bg-red-100 rounded-xl w-2/3'>
            {/* <TextInput 
                className="text-gray-700"
                onChangeText={setDebit}
                value={debit}
              />  */}
            <CurrencyInput
              value={debit}
              onChangeValue={setDebit}
              // onBlur={onBlur}
              prefix="$"
              delimiter=","
              separator="."
              precision={2}
              style={{ color: 'black', fontSize: 25 }}
            />
          </View>
          <TouchableOpacity onPress={()=> withdrawUserAcc()}>
            <View className='py-2 px-2 flex flex-row items-center justify-center bg-red-500 rounded-lg'>
              <Text className='mr-2 text-base font-semibold text-white'>Débito</Text>
              <FeatherIcon color="#fff" name="minus-circle" size={16} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
