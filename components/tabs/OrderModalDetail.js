import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../redux/utils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native-paper';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function OrderModalDetail({value}) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOrderDetail = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/order-detail/${value}/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        console.log("Detail Order", response.data);
        setOrder(response.data);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {
    if (value) {
      getOrderDetail();
    }
  }, [value])

  return (
    <View className='h-[740px]'>
      {/* <Text>OrderModalDetail {value}</Text> */}

      <ScrollView 
          showsVerticalScrollIndicator={false}
          className="bg-slate-50 pt-5"
          contentContainerStyle={{
              paddingBottom: 50
          }}
      > 
        {loading? <ActivityIndicator size={'large'} /> : 
          <>
            <Text className='px-6 text-xs text-gray-500'>Solicitar ID: # <Text className='text-gray-900 font-semibold'>{order?.ref_code}</Text></Text>
            <Text className='px-6 text-lg font-black text-gray-700 mt-7 mb-3'>Detalles de facturación</Text>
            <Text className='px-6 text-base text-gray-500'>{order?.user?.username}</Text>
            {/* <Text className='px-6 text-base text-gray-500'>{order?.address?.address}</Text> */}
            
            <Text className='px-6 text-base text-gray-700 font-semibold mt-5'>Correo electrónico</Text>
            <Text className='px-6 text-base text-gray-500'>{order?.user?.email}</Text>
            
            <Text className='px-6 text-base text-gray-700 font-semibold mt-5'>Dirección</Text>
            <Text className='px-6 text-base text-gray-500'>{order?.address?.address}</Text>
            
            <Text className='px-6 text-base text-gray-700 font-semibold mt-5'>Teléfono</Text>
            <Text className='px-6 text-base text-gray-500'>nulo</Text>
            
            <Text className='px-6 text-base text-gray-700 font-semibold mt-5'>Pago mediante</Text>
            <Text className='px-6 text-base text-gray-500'>efectivo</Text>

            <View className="flex-row items-center justify-between py-2 px-4 bg-slate-200 rounded-3xl mx-2 my-3 mt-7 shadow-md">
                <Text className="font-bold text-orange-500">Cantidad </Text>
                <Text className="font-bold">Producto </Text>
                <Text className="font-semibold text-base">Total</Text>
            </View>
              {order?.order_items.map((order_item, i) => {
                return (
                  <View key={i} 
                      className="flex-row items-center space-x-3 py-2 px-4 bg-white rounded-3xl mx-2 mb-3 shadow-md"
                  >
                      <Text className="font-bold text-orange-500">{order_item.quantity} x </Text>
                      <Image
                          className="h-14 w-14 rounded-full" 
                          source={order_item.item.image}
                          placeholder={blurhash}
                          contentFit="cover"
                          transition={1000}
                      />
                      <Text className="flex-1 font-bold text-gray-700">{order_item.item.name}</Text>
                      <Text className="font-semibold text-base">${order_item.final_price}</Text>
                  </View>
                );
              })}
          </>
        }
      </ScrollView>
    </View>
  )
}