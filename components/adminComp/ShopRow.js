import { View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Icon from "react-native-feather";
import axios from 'axios';
import CreatShop from './CreatShop';
import { baseURL } from '../../redux/utils';
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ShopRow() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([]);
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${baseURL}/shops/`
        const response = await axios.get(url)

        // console.log("xxss", response.data);
        setDataSource(response.data);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        console.log(error)
      }
    };

    fetchData();
  }, [isModalVisible]);

  return (
    <View className='mt-2'>

        {/* Modal */}
        <Modal
            visible={isModalVisible}
            onRequestClose={()=>setIsModalVisible(false)}
            animationType='fade'
        >
          <View className=''>
              <TouchableOpacity 
                  onPress={()=>setIsModalVisible(false)} 
                  className=" bg-gray-200 p-2 w-10 h-10 ml-5 mt-5 rounded-full shadow">
                  <Icon.ArrowLeft strokeWidth={3} stroke="black" />
              </TouchableOpacity>
          </View>
          <CreatShop setIsModalVisible={setIsModalVisible} />
        </Modal>
        

        <TouchableOpacity onPress={()=>setIsModalVisible(true)}  className='flex-row justify-center items-center rounded-xl p-2 mx-24 my-5 bg-[#044244]'>
            <Text className='text-white text-base font-bold mr-2'>Agregar nueva tienda</Text>
            <Icon.PlusCircle className='rounded-lg' height={25} width={25} strokeWidth="2.5" stroke="white" />
        </TouchableOpacity>

      {loading? 
        <View className='mt-9'>
          <ActivityIndicator size='large' />
        </View>
       : 
        <ScrollView
          // horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
              paddingHorizontal:15,
          }}
          className="overflow-visible py-5"
        >
          {
            dataSource.map((data, index)=>{
              return (
                <TouchableWithoutFeedback 
                  key={index}
                  onPress={()=>{
                    // navigation.navigate('Shop', data)
                  }}
                >
                  <View style={{shadowColor: "#044244"}} className="mb-5 bg-white rounded-3xl shadow-md mx-3">
                    <Image
                      className="h-36 w-[100%] rounded-t-3xl"
                      source={data?.image}
                      placeholder={blurhash}
                      contentFit="cover"
                      transition={1000}
                    />
                    
                    <View className="px-3 pb-4 space-y-2">
                      <Text className="text-lg font-bold pt-2">{data?.name}</Text>
                      <View className="flex-row items-center space-x-1">
                          <Text className="text-xs">
                              <Text className="text-green-700">{data?.rating}</Text>
                              <Text className="text-gray-700"> ({data?.reviews} review)</Text> · <Text className="font-semibold text-gray-700">{data?.type}</Text>
                          </Text>
                      </View>
                    </View>
                  </View>
                  
                </TouchableWithoutFeedback>    
              )
            })
          }           
        </ScrollView>
      }
    
    </View>
  )
}