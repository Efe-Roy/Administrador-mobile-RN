// OrderScreen
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import * as Icon from "react-native-feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper'; 
import axios from 'axios';
import { baseURL } from '../../redux/utils';
import AssignOrder from '../../components/adminComp/AssignOrder';
import OrderModalDetail from '../../components/tabs/OrderModalDetail';

export default function OrderScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [value, setValue] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAssign, setIsModalAssign] = useState(false);

  const getOrders = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/order-list/?ordered_t="true"`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        console.log("Order List", response.data.results);
        setOrders(response.data.results);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {
    getOrders();
  }, [isModalVisible]);

  function formatDate(dateString) {
    const date = new Date(dateString);
   
    // Format the date to '29 Feb, 2024'
    const formattedDate = date.toLocaleDateString('en-US', {
       day: 'numeric',
       month: 'short',
       year: 'numeric'
    });
   
    return formattedDate;
   }

   console.log(value);
  
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={getOrders} />} className='flex-1'>
      <StatusBar />
      {/* Modal */}
      <Modal
          visible={isModalAssign}
          onRequestClose={()=>setIsModalAssign(false)}
          animationType='fade'
      >
        <View className=''>
            <TouchableOpacity 
                onPress={()=>setIsModalAssign(false)} 
                className=" bg-gray-200 p-2 w-10 h-10 ml-5 mt-5 rounded-full shadow">
                <Icon.ArrowLeft strokeWidth={3} stroke="black" />
            </TouchableOpacity>
        </View>
        <AssignOrder value={value?.id} setIsModalVisible={setIsModalAssign} isModalVisible={isModalAssign} />
      </Modal> 

      <Modal
          visible={isModalVisible}
          onRequestClose={()=>setIsModalVisible(false)}
          animationType='fade'
      >
        <View className='flex flex-row justify-between p-5'>
            <TouchableOpacity 
                onPress={()=>setIsModalVisible(false)} 
                className=" bg-gray-200 p-2 w-10 h-10 rounded-full shadow">
                <Icon.ArrowLeft strokeWidth={3} stroke="black" />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={()=>setIsModalAssign(true)} 
                disabled={value?.rider? true : false}
                className="bg-gray-200 p-2 rounded">
                <Icon.Truck strokeWidth={3} stroke={`${value?.rider? "green" : "red"}`} className="" />
            </TouchableOpacity>
        </View>
        <OrderModalDetail setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} value={value?.id} />
      </Modal>

      {/* Header */}
      <View className=" w-[width] shadow-md bg-white py-4 px-7 mb-5 space-x-24 flex-row items-center justify-start">
        <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
            <Icon.AlignRight strokeWidth={3} stroke="black" />
        </TouchableOpacity>
        <Text className='font-bold text-lg'>PEDIDOS</Text>
      </View>
      
      {loading ? <ActivityIndicator size="large" color="#aaa" /> : 
        <View className=" pb-3 px-4">
          {/* <Text className='text-center font-bold mb-3 text-xl mt-4'>Pedidos</Text> */}
          <DataTable style={{paddingBottom: 15}}> 
            <DataTable.Header className='rounded-xl bg-blue-100'> 
              <DataTable.Title>Solicitar ID</DataTable.Title> 
              <DataTable.Title>Usuario</DataTable.Title> 
              <DataTable.Title>Fecha</DataTable.Title> 
              <DataTable.Title>Total</DataTable.Title> 
              <DataTable.Title>Estado</DataTable.Title> 
            </DataTable.Header> 
            
            {orders?.map((item, i) => {
              return (
                <DataTable.Row key={i}> 
                  <DataTable.Cell>
                    <Text className='text-xs'>{item?.ref_code}</Text>
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <Text numberOfLines={3}>{item.user.username}</Text>
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <Text className='text-xs'>{formatDate(item.ordered_date)}</Text>
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <Text>${item.total}</Text>
                  </DataTable.Cell> 
                  <DataTable.Cell>
                    <TouchableOpacity 
                      onPress={()=>{ 
                        setIsModalVisible(true);
                        setValue({
                          id: item?.id,
                          rider: item?.rider
                        });
                      }} 
                      className={`${item?.received? 'bg-green-500':'bg-slate-500'}  p-1 rounded-lg`} 
                    >
                      <Text className='text-white text-xs font-bold'>{item?.received? 'Delivered':'Pendiente'}</Text>
                    </TouchableOpacity>
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

        </View>
      }
    </ScrollView>
  );
}