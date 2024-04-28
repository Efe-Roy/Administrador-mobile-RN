import {View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Icon from "react-native-feather";
import { baseURL } from '../../redux/utils';
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper'; 
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const getShop = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/shop-detail/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("shop", response.data.id);
        getOrdersInShop(response.data.id);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  const getOrdersInShop = async (id) => {
    try {
        setLoading(true);
        const url = `${baseURL}/order-items-list/?shop_id=${id}`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("xxss", response.data);
        setOrders(response.data);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {
      getShop();
  }, [])
  
  return (
    <View className='flex-1'>

      <View className="h-16 w-[width] shadow-md bg-white py-4 px-7 mb-5 space-x-24 flex-row items-center justify-start">
        <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
            <Icon.AlignRight strokeWidth={3} stroke="black" />
        </TouchableOpacity>
        <Text className='font-bold'>PEDIDOS</Text>
      </View>

      {loading ? <ActivityIndicator size="large" color="#aaa" /> : 
        <ScrollView 
            showsVerticalScrollIndicator={false}
            className="mt-5 pb-3 px-4"
        >
          <DataTable style={{paddingBottom: 15}}> 
            <DataTable.Header className='rounded-xl bg-green-50'> 
              <DataTable.Title>Producto</DataTable.Title> 
              <DataTable.Title>Image</DataTable.Title> 
              <DataTable.Title>Cantidad</DataTable.Title> 
              <DataTable.Title>Total</DataTable.Title> 
            </DataTable.Header> 
            
            {orders?.map((item, i) => {
              return (
                <DataTable.Row key={i}> 
                  <DataTable.Cell>
                    <Text numberOfLines={3}>{item.item.name}</Text>
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <Image
                      className="h-14 w-14 rounded-full" 
                      source={item.item.image}
                      placeholder={blurhash}
                      contentFit="cover"
                      transition={1000}
                    />
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <Text>{item.quantity} x</Text>
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <Text>${item.final_price}</Text>
                  </DataTable.Cell> 
                </DataTable.Row> 
              );
            })}

            {/* <DataTable.Pagination
              page={1}
              numberOfPages={3}
              onPageChange={(page) => { console.log(page); }}
              label="1-2 of 6"
            /> */}
        
          </DataTable> 

        </ScrollView>
      }
    </View>
  );
};

export default Orders;