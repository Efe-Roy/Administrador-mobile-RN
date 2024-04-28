import React, { useState } from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux';
import { errorAuth, getAuth, initAuth, successAuth } from '../../redux/features/authSlice';
import Toast from 'react-native-toast-message'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../redux/utils';

export default function LoginScreen() {
  const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      username: '',
      password: '',
    });

  const handleLogin = async () => {
    // console.log(form)
    try {
      setLoading(true);
      dispatch(initAuth());
      const response = await axios.post(`${baseURL}/login/`, form);
      if (response.data.is_vendor || response.data.is_admin){
        await AsyncStorage.setItem('jwtToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        dispatch(getAuth(response.data));
        dispatch(successAuth());
        showToastSuccess('Logged in Successfully');
        setLoading(false);
        navigation.navigate('Home');
      } else {
        showToast('No tienes permiso para iniciar sesión ');
        setLoading(false);
        dispatch(errorAuth());
      }
      // console.log(response.data);
    } catch (error) {
        showToast('Credenciales no válidas');
        setLoading(false);
        console.log(error)
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message
    });
  }
  const showToastSuccess = (message) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: message
    });
  }
  
  return (
    <SafeAreaView className='flex-1 bg-[#e8ecf4]'>
      <View className='py-6 px-0 flex-grow flex-shrink flex-basis-0'>
          <View className='justify-center items-center my-10'>
            <Image
              alt="App Logo"
              resizeMode="contain"
              className='w-[80px] h-[80px] self-center mb-9'
              source={{
                uri: 'https://assets.withfra.me/SignIn.2.png',
              }} />

            <Text className='text-[31px] font-bold text-gray-800 mb-1'>
            <Text style={{ color: '#075eec' }}>Iniciar sesión</Text>
            </Text>

            <Text className='text-sm font-medium text-gray-500'>
            Obtenga acceso a su producto y más
            </Text>
          </View>

          <View className='mb-6 px-6 flex-grow flex-shrink flex-basis-0'>
            <View className='mb-4'>
              <Text className='text-base font-semibold text-gray-700 mb-2'>Nombre de usuario</Text>

              <TextInput
                autoCapitalize="none"
                // autoCorrect={false}
                // keyboardType="email-address"
                onChangeText={username => setForm({ ...form, username })}
                placeholder="John Doe"
                placeholderTextColor="#6b7280"
                className='h-12 bg-white px-4 rounded-xl text-base font-medium text-gray-700 border border-gray-300'
                value={form.username} />
            </View>

            <View className='mb-4'>
              <Text className='text-base font-semibold text-gray-700 mb-2'>Contraseña</Text>

              <TextInput
                autoCapitalize="none"
                // autoCorrect={false}
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                className='h-12 bg-white px-4 rounded-xl text-base font-medium text-gray-700 border border-gray-300'
                secureTextEntry={true}
                value={form.password} />
            </View>

            <View className='mt-1 mb-4'>
              {loading? 
                <View className='flex flex-row items-center justify-center rounded-lg py-2 px-4 border-2 border-blue-600 bg-gray-600'>
                  <Text className='text-lg leading-7 font-semibold text-white'>Loading ...</Text>
                </View> :
                <TouchableOpacity onPress={() => handleLogin()}>
                  <View className='flex flex-row items-center justify-center rounded-lg py-2 px-4 border-2 border-blue-600 bg-blue-600'>
                    <Text className='text-lg leading-7 font-semibold text-white'>Enviar</Text>
                  </View>
                </TouchableOpacity>
              }
            </View>

            <Text className='text-base font-semibold text-blue-600 text-center'>Forgot password?</Text>
          </View>

      </View>
    </SafeAreaView>
  )
}

