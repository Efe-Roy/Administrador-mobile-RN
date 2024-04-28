import { View, Text, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from "react-native-gifted-charts";
import { baseURL } from '../redux/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';

export default function ChartScreen() {
  const [dataSource, setDataSource] = useState([]);
  const navigation = useNavigation();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/order-dash/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("dash", response.data);
        setSource(response.data)
        if (response.data) {
          setDataSource([
            {value: response.data?.total, label: 'Total', frontColor: '#177AD5'},
            {value: response.data?.completed, label: 'Ventas', frontColor: 'green'},
            {value: 0, label: 'Cancelado', frontColor: 'red'},
            {value: response.data?.pending, label: 'Pendiente', frontColor: 'orange'},
          ]);
        }
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {getOrders();}, [])

  return (
    <ScrollView>
      <View className='flex-1 p-8 bg-slate-100'>
        <StatusBar />
        <View className='flex flex-row justify-start space-x-7 items-center mb-16'>
          <TouchableOpacity className='bg-blue-500 p-3 rounded-full' onPress={()=>navigation.toggleDrawer()}>
            <Icon.AlignRight height={20} width={20} strokeWidth="2.5" stroke="white" />
          </TouchableOpacity>
          <Text className="font-bold text-xl">Resumen del pedido</Text>
        </View>
        {/* <Text className='text-xl font-black my-6 text-center'>Orders</Text> */}

        <BarChart
            barWidth={50}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="lightgray"
            data={dataSource}
            yAxisThickness={0}
            xAxisThickness={0}
        />


        <View className='mt-16 space-y-3'>
          <View className='flex flex-row justify-between items-center bg-white rounded-2xl shadow-md px-4 py-3'
            style={{shadowColor: "#044244"}}
          >
            <Text className='text-base font-bold text-blue-500'>Pedidos totales</Text>
            <Text className='text-4xl font-black text-blue-500'>{source?.total}</Text>
            <Icon.Cloud height={35} width={35} strokeWidth="2.5" stroke="blue" />
          </View>
          <View className='flex flex-row justify-between items-center bg-white rounded-2xl shadow-md px-4 py-3'
            style={{shadowColor: "#044244"}}
          >
              <Text className='text-base font-bold text-green-500'>Ventas totales</Text>
              <Text className='text-4xl font-black text-green-500'>{source?.completed}</Text>
              <Icon.TrendingUp height={35} width={35} strokeWidth="2.5" stroke="green" />
          </View>
          <View className='flex flex-row justify-between items-center bg-white rounded-2xl shadow-md px-4 py-3'
            style={{shadowColor: "#044244"}}
          >
              <Text className='text-base font-bold text-red-500'>Cancelación total</Text>
              <Text className='text-4xl font-black text-red-500'>0</Text>
              <Icon.TrendingDown height={35} width={35} strokeWidth="2.5" stroke="red" />
          </View>
          <View className='flex flex-row justify-between items-center bg-white rounded-2xl shadow-md px-4 py-3'
            style={{shadowColor: "#044244"}}
          >
              <Text className='text-base font-bold text-orange-500'>Total pendiente</Text>
              <Text className='text-4xl font-black text-orange-500'>{source?.pending}</Text>
              <Icon.Clock height={35} width={35} strokeWidth="2.5" stroke="orange" />
          </View>
        </View>

      </View>
    </ScrollView>
  )
}