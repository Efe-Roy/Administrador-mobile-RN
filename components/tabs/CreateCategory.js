import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native'
import * as Icon from "react-native-feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DataTable } from 'react-native-paper'; 
import { baseURL } from '../../redux/utils';


export default function CreateCategory() {
    const [dataSource, setDataSource] = useState([]); 
    const [dataShop, setDataShop] = useState(null); 
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();
    const [name, setName] = useState(null);
    const [refresh, setRefresh] = useState(false);

    

    useEffect(() => {
        getShopDetail();
        fetchRecords();
    }, [refresh, dataShop?.id])

    const onSubmit = async() => {
      if (name === null) {
          showToast1('Fill all the is required');
      } else {
        showToast('Form submitted successfully');

        console.log("name", name)

        try {
          const url = `${baseURL}/category-list/`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          const response = await axios.post(url, {
            shop: dataShop?.id,
            name:  name
          }, {
              headers: {
                'Authorization': `Token ${jwtToken}`, 
              }, 
            })

          console.log("xxss", response.data);
          setRefresh(!refresh);

          setName(null);

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

    const getShopDetail = async () => {
        try {
            setLoading(true);
            const url = `${baseURL}/shop-detail/`
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            let response = await axios.get(url, {
              headers: {
                'Authorization': `Token ${jwtToken}`, 
              }, 
            });
    
            // console.log("zzww", response.data.id);
            setDataShop(response.data);
            setLoading(false);
    
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
      }

    const fetchRecords = async () => {
      if (dataShop?.id) {
        try {
            const url = `${baseURL}/category-list/?shop=${dataShop?.id}`
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
      }
    };


  return (
    <View className="flex-1 bg-white px-8 pt-5">
        <View className='flex flex-row justify-between w-[100%] px-4 items-center mb-10'>
          <TouchableOpacity className='bg-slate-300 p-3 rounded-full' onPress={()=>navigation.toggleDrawer()}>
            <Icon.ArrowLeft height={20} width={20} strokeWidth="2.5" stroke="black" />
          </TouchableOpacity>
          <Text className="text-center font-black text-3xl">Crear categoría</Text>
        </View>
        <View className="form space-y-1">
          <Text className="text-gray-700 font-semibold ml-4">Nombre</Text>
          <TextInput 
            className="p-2 mb-5 bg-gray-300 text-gray-700 rounded-2xl"
            onChangeText={setName}
            value={name} 
          />

          <TouchableOpacity 
            onPress={onSubmit}
            className="py-2 flex-row items-center justify-center space-x-3 rounded-xl bg-green-400">
              <Text  className="text-xl font-bold text-center text-gray-50">
                Enviar </Text>
              <Icon.Send height={20} width={20} strokeWidth="2.5" stroke="white" />

            </TouchableOpacity>

        </View>

        <ScrollView 
            showsVerticalScrollIndicator={false}
            className="mt-11 pb-3"
        >
          <Text className='text-center font-bold mb-3 text-xl mt-4'>Categoría de lista</Text>
          <DataTable style={{paddingBottom: 15}}> 
            <DataTable.Header className='rounded-xl bg-blue-100'> 
              <DataTable.Title>Nombre</DataTable.Title> 
              <DataTable.Title>Action</DataTable.Title> 
            </DataTable.Header> 
            
            {dataSource?.map((item, i) => {
              return (
                <DataTable.Row key={i}> 
                  <DataTable.Cell>{item?.name}</DataTable.Cell> 
                  <DataTable.Cell>
                    <TouchableOpacity onPress={()=> console.log(item?.id)}>
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