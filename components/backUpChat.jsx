import React, { useEffect, useState } from 'react'
import { Text,  View, Image, TextInput, FlatList, Dimensions, KeyboardAvoidingView, TouchableOpacity, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Icon from "react-native-feather";
import { baseURL } from '../redux/utils';

export default function ChatMsg({userID}) {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [msg, setMsg] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
      console.log({
        "message": message,
        "user_id": userID
      });
      // try {
      //     setLoading(true);
      //     const url = `${baseURL}/send-msg/`
      //     const jwtToken = await AsyncStorage.getItem('jwtToken');
      //     let response = await axios.post(url, {
      //       "message": message,
      //       "user_id": userID
      //     },
      //       {
      //         headers: {
      //         'Authorization': `Token ${jwtToken}`, 
      //         }, 
      //       }
      //     );
  
      //     // console.log(response.data);
      //     // setMsg(response.data);
      //     setLoading(false);
      //     getMessage();
  
      // } 
      // catch (error) {
      //     setLoading(false);
      //     console.log(error)
      // }
    };

    const getMessage = async () => {
      try {
          setLoading(true);
          const url = `${baseURL}/msg-list/?user_id=${userID}`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.get(url, 
            {
              headers: {
              'Authorization': `Token ${jwtToken}`, 
              }, 
            }
          );
  
          // console.log("Msg", response.data);
          setMsg(response.data);
          setLoading(false);
  
      } 
      catch (error) {
          setLoading(false);
          console.log(error)
      }
    };
  
    useEffect(() => {
      getMessage();
    }, [])

    const renderItem = ({ item }) => {
      if (item.sender !== "Admin") {
        return (
          <View className='flex-row m-1 items-end'>
            {/* <Image source={{ uri: item.image }} style={styles.userPic} /> */}
            <Icon.User 
              strokeWidth={1} 
              width={40} height={40} 
              stroke="white" 
              className='bg-blue-600 rounded-full'
            />
            <View className='w-[220px] p-2 bg-white rounded-lg'>
              <Text className='text-[15px] font-semibold text-gray-600'>{item.message}</Text>
            </View>
          </View>
        )
      } else {
        return (
          <View className='flex-row items-end self-end m-1'>
            <View className='w-[220px] bg-[#97c163] p-2 rounded-lg'>
              <Text className='text-[15px] font-semibold'>{item.message}</Text>
            </View>
            {/* <Image source={{ uri: item.image }} style={styles.userPic} /> */}
            <Icon.User 
              strokeWidth={2} 
              width={40} height={40} 
              stroke="gray" 
              className='bg-yellow-400 rounded-full'
            />
          </View>
        )
      }
    }

    // useEffect(() => {
    //     const socketURL = `ws://10.0.2.2:8000/ws/chat/${userID}/`;
    //     // const socketURL = `ws://jatte.fiscaliaycontraloria.com:8020/ws/chat/${userID}/`;
    //     console.log("Establishing Socket Connection")
    //     const newSocket = new WebSocket(socketURL);
    //     setSocket(newSocket);
    //     // console.log("vv", newSocket);
    
    //     return () => {
    //       newSocket.close();
    //     };
    // }, []);
    
    // useEffect(() => {
    //     if (!socket) return;
    
    //     // Recieve Message from the backend
    //     const handleSocketMessage = (event) => {
    //       const data = JSON.parse(event.data).message;
    //       console.log("ff", data);
    //       setMsg(prevMessages => [...prevMessages, data]);
    //     };
    
    //     socket.addEventListener('message', handleSocketMessage);
    
    //     return () => {
    //       socket.removeEventListener('message', handleSocketMessage);
    //     };
    // }, [socket]);
    
    // Send Message to the backend
    // const handleMessageSubmit = () => {
    //     if (!socket || !message) return;
    
    //     socket.send(JSON.stringify({
    //       room_name: userID,
    //       message: message,
    //       sender: "Admin",
    //       status: "unread_client",
    //     }));
    //     setMessage('');
    //     Keyboard.dismiss()
    // };
    
    // const scrollToBottom = () => {
    //     // Implementation to scroll chats_div to bottom
    // };
    
    // useEffect(() => {
    //     scrollToBottom();
    // }, [message]);
    
  return (
    <View className='flex-1 bg-slate-200'>
      <KeyboardAvoidingView behavior="padding" className='flex-1 justify-center mt-3'>
        <Text>ChatMsg2</Text>
        <FlatList
          extraData={msg}
          data={msg}
          keyExtractor={(item, index) => index.toString()}
          // keyExtractor={item => {
          //   return item.id
          // }}
          renderItem={renderItem}
        />


        <View className='flex-row h-[40px] mb-5 p-2'>
          <View className='border-b-[#F5FCFF] border-b-2 bg-white rounded-full h-[40px] flex-row items-center flex-1 mr-2'>
            <TextInput
              className='ml-4 flex-1 border-b-white h-[40px]'
              placeholder="Write a message..."
              underlineColorAndroid="transparent"
              onChangeText={Txt => setMessage( Txt )}
            />
          </View>

          <TouchableOpacity 
            onPress={()=>sendMessage()}
            className='w-[40px] h-[40px] rounded-3xl justify-center items-center bg-green-500'
          >
            <Image
              source={{ uri: 'https://img.icons8.com/small/75/ffffff/filled-sent.png' }}
              className='w-[30px] h-[30px] self-center'
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}