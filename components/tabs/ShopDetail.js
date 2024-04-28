import { View, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Icon from "react-native-feather";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../redux/utils';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ShopDetail() {
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const navigation = useNavigation();

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
    
            // console.log("zzww", response.data);
            setDataSource(response.data);
            setLoading(false);
    
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
      }

    useEffect(() => {
        getShopDetail();
    }, [])
      
  return (
    <>
        <ScrollView className="bg-white">
            <View className="relative">
                <Image
                    className="w-full h-72" 
                    source={dataSource?.image}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                />
                <TouchableOpacity 
                    onPress={()=>navigation.toggleDrawer()}
                    className="absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow">
                    <Icon.AlignRight strokeWidth={3} stroke="black" />
                </TouchableOpacity>
            </View>
            <View className="bg-white px-5 -mt-12 pt-6 rounded-t-[40px]">
                <Text className="text-3xl font-bold">{dataSource?.name}</Text>
                <View className="flex-row items-center space-x-1">
                    <Icon.Star color="orange" width={15} height={15} />

                    <Text className="text-xs">
                        <Text className="text-green-700">{dataSource?.rating}</Text>
                        <Text className="text-gray-700"> (4.6k review)</Text> · <Text className="font-semibold text-gray-700">{dataSource?.type}</Text>
                    </Text>
                </View>
                <Text className="text-gray-500 mt-2">{dataSource?.description}</Text>
                
                <Text className='text-gray-500 mt-8 mr-28 border-b border-black font-bold'>DETALLE DEL USUARIO</Text>
                <View className="flex-row items-center space-x-1 my-1">
                    <Icon.Mail color="red" width={15} height={15} />
                    <Text className="text-green-700">{dataSource?.user?.email}</Text>
                </View>
                <View className="flex-row items-center space-x-1 my-1">
                    <Icon.User color="red" width={15} height={15} />
                    <Text className="text-green-700">{dataSource?.user?.username}</Text>
                </View>
                
                <Text className='mt-8 mr-64 border-b border-black font-bold'>DIRECCIÓN</Text>
                {dataSource?.address?.map((item, index)=>(
                    <View key={index} className='pb-1'>
                        <Text className='font-semibold text-lg'>{item?.address}</Text>
                        <Text className='text-gray-500 text-xs'>lat:{item?.lat} - lng:{item?.lng}</Text>
                        <Text className={`${item?.default? "text-green-500" : "text-blue-500"} text-xs font-black`}>{item?.default? "Default" : "Set Default"}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    </>
    
  )
}