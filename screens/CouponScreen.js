import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native'
import * as Icon from "react-native-feather";
import { baseURL } from '../redux/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DataTable } from 'react-native-paper'; 


export default function CouponScreen() {
    const [dataSource, setDataSource] = useState([]); 
    const navigation = useNavigation();
    const [code, setCode] = useState(null);
    const [amount, setAmount] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const onSubmit = async() => {
      if (amount === null) {
          showToast1('Fill all the is required');
      } else {
        showToast('Form submitted successfully');

        // console.log("code", code)

        try {
          const url = `${baseURL}/create-coupon/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          const response = await axios.post(url, {
            amount: amount,
            code:  code
          }, {
              headers: {
                'Authorization': `Token ${jwtToken}`, 
              }, 
            })

          console.log("xxss", response.data);
          setRefresh(!refresh);

          setAmount(null);
          setCode(null);

      } catch (error) {
          console.log(error)
      }
      }
    };

    const onDelete = async (id) => {
      try {
          const url = `${baseURL}/detail-coupon/${id}/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          const response = await axios.delete(url, {
              headers: {
                'Authorization': `Token ${jwtToken}`, 
              }, 
            })
  
          console.log("xxss", response.data);
          setRefresh(!refresh)
  
      } catch (error) {
          console.log(error)
      }
    };

    const showToast = (message) => {
      Toast.show({
        type: 'success',
        text1: 'success',
        text2: message
      });
    }

    const showToast1 = (message) => {
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: message
      });
    }

    useEffect(() => {
      const fetchRecords = async () => {
        try {
            const url = `${baseURL}/create-coupon/`
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            const response = await axios.get(url, {
                headers: {
                  'Authorization': `Token ${jwtToken}`, 
                }, 
              })
    
            // console.log("xxss", response.data);
            setDataSource(response.data);
    
        } catch (error) {
            console.log(error)
        }
      };

      fetchRecords();
    }, [refresh]);

  return (
    <View className="flex-1 bg-white px-8 pt-5">
        <View className='flex flex-row justify-between w-[100%] px-4 items-center mb-10'>
          <TouchableOpacity className='bg-orange-500 p-3 rounded-full' onPress={()=>navigation.toggleDrawer()}>
            <Icon.AlignRight height={20} width={20} strokeWidth="2.5" stroke="white" />
          </TouchableOpacity>
          <Text className="text-center font-black text-3xl">Agregar cupón</Text>
        </View>
        <View className="form space-y-1">
          <Text className="text-gray-700 font-semibold ml-4">Code</Text>
          <TextInput 
            className="p-2 mb-5 bg-gray-300 text-gray-700 rounded-2xl"
            onChangeText={setCode}
            value={code} 
          />

          <Text className="text-gray-700 font-semibold ml-4">Amount</Text>
          <TextInput 
            className="p-2 mb-5 bg-gray-300 text-gray-700 rounded-2xl"
            onChangeText={setAmount}
            value={amount} 
          />

          <TouchableOpacity 
            onPress={onSubmit}
            className="py-2 flex-row items-center justify-center space-x-3 rounded-xl bg-orange-400">
              <Text  className="text-xl font-bold text-center text-gray-50">
                Enviar </Text>
              <Icon.Send height={20} width={20} strokeWidth="2.5" stroke="white" />

            </TouchableOpacity>

        </View>

        <ScrollView 
            showsVerticalScrollIndicator={false}
            className="mt-11 pb-3"
        >
          <Text className='text-center font-bold mb-3 text-xl mt-4'>Coupon Table</Text>
          <DataTable style={{paddingBottom: 15}}> 
            <DataTable.Header className='rounded-xl bg-blue-100'> 
              {/* <DataTable.Title>#</DataTable.Title>  */}
              <DataTable.Title>Code</DataTable.Title> 
              <DataTable.Title>Amount</DataTable.Title> 
              <DataTable.Title>Action</DataTable.Title> 
            </DataTable.Header> 
            
            {dataSource?.map((item, i) => {
              return (
                <DataTable.Row key={i}> 
                  {/* <DataTable.Cell>{i+1}</DataTable.Cell>  */}
                  <DataTable.Cell>{item?.code}</DataTable.Cell> 
                  <DataTable.Cell>$ {item?.amount}</DataTable.Cell> 
                  <DataTable.Cell>
                    <TouchableOpacity onPress={()=> onDelete(item?.id)}>
                      <Icon.Trash height={20} width={20} strokeWidth="2.5" stroke="red" />
                    </TouchableOpacity>
                  </DataTable.Cell> 
                </DataTable.Row> 
              );
            })}
        
          </DataTable> 

        </ScrollView>
    </View>
  )
}