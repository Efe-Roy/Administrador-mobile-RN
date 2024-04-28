import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import { baseURL } from '../../redux/utils';


export default function CreateRider({setIsModalVisible}) {
  const [imageData, setImageData] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [is_rider, setRider] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImageData(result.assets[0].uri);
    }
  };

  const uploadFormData = async () => {
    const data = new FormData();

    if (imageData) {
      const fileName = imageData.split('/').pop();
      const fileType = fileName.split('.').pop();

      data.append('image', {
        uri: imageData,
        name: fileName,
        type: `image/${fileType}`,
      });
    }
  
    // Append additional data
    data.append('name', username);
    data.append('email', email);
    data.append('password', password);
    data.append('password2', password2);
    data.append('is_rider', true);
  
    const url = `${baseURL}/registration/`;
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    // console.log(data)
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Token ${jwtToken}`,
        },
      });
      const responseData = await response.json();
      console.log('Upload successful:', responseData);
      setLoading(false);
      setIsModalVisible(false);

    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
    }
  };
  

  return (
    <ScrollView className='flex-1'>
      <View className='flex-1'>
        <Text className='text-xl mt-5 text-center font-bold'>Agregar formulario de repartidor</Text>

        {imageData && 
          <Image 
            source={{ uri: imageData }} 
            className='w-[90%] h-[200px] rounded-lg self-center mt-5'
          />}
        
        <TextInput
          placeholder="Ingrese su nombre de usuario personal"
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          placeholder="Introduzca un correo electrónico válido"
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          placeholder="Introducir la contraseña"
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          placeholder="confirmar Contraseña"
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={password2}
          onChangeText={text => setPassword2(text)}
        />
        <TouchableOpacity
          className='w-[90%] h-12 border border-gray-300 rounded-lg flex-row items-center justify-center self-center mt-5'
          onPress={pickImage}
        >
          <Icon.Camera className='mr-2' height={25} width={25} strokeWidth="2.5" stroke="black" />
          <Text className='text-gray-500'>Seleccionar imagen de la galería</Text>
        </TouchableOpacity>
        
        
        {loading? 
          <TouchableOpacity
            className='w-[90%] h-12 bg-gray-700 rounded-lg flex items-center justify-center self-center mt-5 mb-14'
            >
            <Text style={{color: '#Fff'}}>loading ...</Text>
          </TouchableOpacity> 
          :
          <TouchableOpacity
            className='w-[90%] h-12 bg-indigo-700 rounded-lg flex items-center justify-center self-center mt-5 mb-14'
            onPress={() => {
              uploadFormData();
            }}>
            <Text style={{color: '#Fff'}}>Enviar</Text>
          </TouchableOpacity>
        }
      </View>
    </ScrollView>
  )
}
