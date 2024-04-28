import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Icon from "react-native-feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseURL } from '../../redux/utils';
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function Items() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/products/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("xxss", response.data);
        setItems(response.data);
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
  };

  useEffect(() => {fetchData();}, []);

  return (
    <ScrollView style={{
      backgroundColor: '#edf1f2'
    }}>
      {/* Header */}
      <View
        // style={{backgroundColor: themeColors.bgColor(1)}}
        className='rounded-b-xl pb-16 bg-yellow-700'
      >
        <View className='flex flex-row justify-between w-[100%] px-4 mt-5 items-center'>
            <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
              <Icon.AlignRight height={20} width={20} strokeWidth="2.5" stroke="white" />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-slate-50'>Productos</Text>
            <Icon.Search height={20} width={20} strokeWidth="2.5" stroke="white" />
        </View>
      </View>

      {/* Top Actions */}
      <View className='h-[90px] -mt-10'>
        <View className='bg-white py-8 px-5 mx-5 rounded-md flex flex-row items-center'>
          <View className='flex flex-1 flex-row justify-around items-center'>
            <TouchableOpacity className='justify-center items-center'>
              <Icon.ArrowLeft height={20} width={20} strokeWidth="2.5" stroke="black" />
              <Text className='font-black'>Prev</Text>
            </TouchableOpacity>

            <TouchableOpacity className='justify-center items-center'>
              <Icon.ArrowRight height={20} width={20} strokeWidth="2.5" stroke="black" />
              <Text className='font-black'>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* All Products*/}
      <View className='px-5 pt-10 pb-2'>
        <Text className='font-bold'> Todos los productos listados en tu tienda. </Text>
      </View>

      <View>
      {loading ? <ActivityIndicator size="large" color="#aaa" /> : 
        items?.map((item, i) => {
          return(
            <View key={i} className='flex flex-row justify-between items-center bg-white rounded-lg shadow-md p-4 mb-4'>
              {/* <Image source={{ uri: item.image }} className='w-[70px] h-[70px] rounded-full mr-4' /> */}
              <Image
                className='w-[70px] h-[70px] rounded-full mr-4'
                source={item?.image}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
              />
              <View className='flex-1 mr-4'>
                <Text className='text-lg font-bold mb-1'>{item.name}</Text>
                {/* <Text className='text-sm text-gray-600 mb-1'>{item.description}</Text> */}
                <Text>
                  {item.discount_price && 
                    <Text className='text-base font-bold text-green-500'>
                      ${item?.discount_price?.toFixed(2)}
                    </Text>
                  }
                </Text>
                <Text className={`text-base font-bold text-blue-500 ${item.discount_price?"line-through":""}`}>${item.price.toFixed(2)}</Text>
              </View>
              <View className='flex-row items-center'>
                <TouchableOpacity 
                  onPress={()=>{
                    navigation.navigate('EditScreen', item.id)
                  }}
                >
                  <Icon.Edit3 height={20} width={20} strokeWidth="2.5" stroke="blue" />
                </TouchableOpacity>
              </View>
            </View>
          )})
      }
      </View>
    </ScrollView>
  );
}