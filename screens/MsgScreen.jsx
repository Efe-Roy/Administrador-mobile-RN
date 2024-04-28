import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, Modal, TouchableOpacity, Button } from 'react-native'
import * as Icon from "react-native-feather";
// import ChatMsg from '../components/ChatMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseURL } from '../redux/utils';
import ChatMsg from '../components/ChatMsg';

export default MsgScreen = ({navigation}) => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '555-555-5555',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '444-444-4444',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
    },
  ])
  const [searchText, setSearchText] = useState('')
  const [users, setUsers] = useState([]);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/userlist/?is_client=True`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, 
          {
            headers: {
            'Authorization': `Token ${jwtToken}`, 
            }, 
          }
        );

        // console.log("list", response.data);
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
    <View className='flex-1 bg-white px-7'>
      <Modal
          visible={isModalVisible}
          onRequestClose={()=>setIsModalVisible(false)}
          animationType='fade'
      >
          <View className=''>
              <TouchableOpacity 
                  onPress={()=>setIsModalVisible(false)} 
                  className="p-2 h-10 ml-2 mt-2">
                  <Icon.ArrowLeft strokeWidth={2} stroke="black" />
              </TouchableOpacity>
          </View>
          <ChatMsg userID={userID} roomName="Wax" />
      </Modal>

      <View className='flex flex-row justify-start space-x-7 items-center my-6'>
        <TouchableOpacity className='bg-slate-500 p-1 rounded-lg' onPress={()=>navigation.toggleDrawer()}>
          <Icon.ArrowLeft height={25} width={25} strokeWidth="3.5" stroke="white" />
        </TouchableOpacity>
        <Text className="font-bold text-xl">Lista de clientes</Text>
      </View>

      <View className='bg-[#eee] p-2 mt-4 rounded-3xl'>
        <TextInput
          className='h-[40px] border-gray-400 border-2 p-2 rounded-3xl'
          placeholder="Search"
          // value={searchText}
          // onChangeText={handleSearch}
        />
      </View>
    
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className='flex-1 flex-row items-center p-4 border-b-2 border-[#eee]'
            onPress={()=>{
              setIsModalVisible(true)
              setUserID(item?.id)
            }}
          >
            <Icon.User 
              height={45} width={45} 
              strokeWidth="2.5" 
              // stroke="white" 
              className='rounded-full bg-blue-400 text-slate-100'
            />
            <View className='ml-4'>
              <Text className='text-base font-bold'>{item.username}</Text>
              <Text className='text-base font-bold'>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />

      
    </View>
  )
}


