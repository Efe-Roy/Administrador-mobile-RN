import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from "react-native-feather";
import axios from 'axios';
import CreateRider from './CreateRider';
import UserDetail from './UserDetail';
import { baseURL } from '../../redux/utils';


export default function UserList() {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const fetchData = async () => {
        try {
            setLoading(true);
            const url = `${baseURL}/userlist/?is_client=True`
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            let response = await axios.get(url, {
                headers: {
                'Authorization': `Token ${jwtToken}`, 
                }, 
            });
    
            // console.log("xxss", response.data);
            setUsers(response.data);
            setLoading(false);
    
        } 
        catch (error) {
            setLoading(false);
            console.log(error)
        }
    };

    useEffect(() => {fetchData();}, [isModalVisible]);

  return (
    <View className='flex-1 mt-2'>

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
          <UserDetail setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} userID={userID} />
        </Modal>


        {/* <TouchableOpacity onPress={()=>setIsModalVisible(true)} className='flex-row justify-center items-center rounded-xl my-5 p-2 mx-24 bg-[#044244]'>
            <Text className='text-white text-base font-bold mr-2'>Add New Rider</Text>
            <Icon.PlusCircle className='rounded-lg' height={25} width={25} strokeWidth="2.5" stroke="white" />
        </TouchableOpacity> */}

        {loading ? <ActivityIndicator size="large" color="#aaa" /> : 
            <ScrollView contentContainerStyle={{
                padding: 10
            }}>
                <View>
                    {users?.map((item, i) => {
                        return(
                            <View 
                                key={i} 
                                className='flex flex-row justify-between items-center bg-white rounded-3xl shadow-md p-4 mb-4 mx-5'
                                style={{shadowColor: "#044244"}}
                            >
                                {/* <Image source={{ uri: item.image }} className='w-[100px] h-[100px] rounded-lg mr-4' /> */}
                                <Icon.User className='rounded-lg mr-4' height={30} width={30} strokeWidth="2.5" stroke="blue" />
                                <View className='flex-1 mr-4'>
                                    <Text className='text-lg font-bold mb-1'>{item.username}</Text>
                                    <Text className='text-sm text-gray-600 mb-1'>{item.email}</Text>
                                </View>
                                
                                {/* <Text className={`text-sm font-bold ${item.is_vendor? "text-green-500":"text-blue-500"} mb-1`}>{item.is_vendor? "Vendor":"Client"}</Text> */}
                                
                                <TouchableOpacity onPress={()=>{
                                    setIsModalVisible(true)
                                    setUserID(item.id)
                                }}>
                                    <Icon.Eye height={20} width={20} strokeWidth="2.5" stroke="blue" />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        }
        <View className='mt-16'></View>
    </View>
  )
}