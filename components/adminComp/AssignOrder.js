import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import { baseURL } from '../../redux/utils';


export default function AssignOrder({value, isModalVisible, setIsModalVisible}) {
    const [Enable, setEnable] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const fetchData = async () => {
      try {
          setLoading(true);
          const url = `${baseURL}/userlist/?is_rider=True`
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          let response = await axios.get(url, {
            headers: {
              'Authorization': `Token ${jwtToken}`, 
            }, 
          });
  
        //   console.log("users", response.data);
          setUsers(response.data);
          setLoading(false);
  
      } catch (error) {
          setLoading(false);
          console.log(error)
        }
    };
    useEffect(() => {fetchData();}, [isModalVisible]);

    // console.log("bnb", {
    //     "value":value,
    //     "Enable":Enable
    // });

    const AssignSubmit = async () => {
        try {
            setLoading(true);
    
            const url = `${baseURL}/order/${value}/`
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            let response = await axios.put(url, {
                "rider": Enable,
                "being_delivered": true
            }, {
              headers: {
                'Authorization': `Token ${jwtToken}`, 
              }, 
            });
    
            console.log(response.data);
            setLoading(false);
            setIsModalVisible(false);
    
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    };

    return (
        <View className='flex items-center justify-center'>
            <Text className='mt-11 mb-5 font-bold text-xl'>Asignar orden al ciclista</Text>
            <Picker
                selectedValue={Enable}
                style={{ height: 50, width: 250 }}
                mode={"dialog"}
                onValueChange={(itemValue) => setEnable(itemValue)}
            >
                {/* <Picker.Item label="C++" value="cpp" /> */}
                {users?.map((user, i)=>(
                    <Picker.Item key={i} label={user?.username} value={user?.id} />
                ))}
            </Picker>

            {loading? 
                <TouchableOpacity className='bg-slate-500 p-3 mt-5 rounded-xl flex-row space-x-1'>
                    <Text className='text-white'>Loading...</Text>
                    <ActivityIndicator />
                </TouchableOpacity> :
                <TouchableOpacity onPress={()=>AssignSubmit()} className='bg-blue-500 p-3 mt-5 rounded-xl'>
                    <Text className='text-white'>Enviar</Text>
                </TouchableOpacity>
            }
        </View>
    );
}

