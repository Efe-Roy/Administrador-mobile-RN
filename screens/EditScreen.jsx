import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from "react-native-feather";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import { baseURL } from '../redux/utils';


export default function EditScreen({ navigation, route }) {
  const [imageData, setImageData] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]); 
  const [dataShop, setDataShop] = useState(null); 
  const [category, setCategory] = useState('');

  // console.log("route", route.params);
    
  useEffect(() => {
      getShopDetail();
      fetchRecords();
      getProductDetail();
  }, [dataShop?.id])

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

  const updateFormData = async () => {
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
    data.append('name', name);
    data.append('price', price);
    data.append('discount_price', discountPrice);
    data.append('description', description);
  
    const url = `${baseURL}/products/${route.params}/`;
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Token ${jwtToken}`,
        },
      });
      const responseData = await response.json();
      console.log('Upload successful:', responseData);
      setLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
    }
  };

  const getProductDetail = async () => {
    try {
        setLoading(true);
        const url = `${baseURL}/products/${route.params}/`
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        let response = await axios.get(url, {
          headers: {
            'Authorization': `Token ${jwtToken}`, 
          }, 
        });

        // console.log("priduct detail", response.data);
        setName(response.data.name)
        setPrice(response.data.price)
        setDiscountPrice(response.data.discount_price)
        setDescription(response.data.description)
        // setCategory(response.data.category)
        setLoading(false);

    } catch (error) {
        setLoading(false);
        console.log(error)
    }
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
  
        //   console.log("xxss category", response.data);
          setDataSource(response.data);
  
      } catch (error) {
          console.log(error)
      }
    }
  };

  return (
    <ScrollView className='flex-1'>
      <View className='flex flex-row justify-between w-[100%] px-4 mt-5 items-center'>
        <TouchableOpacity className='bg-slate-300 p-2 rounded-full' onPress={()=>navigation.goBack()}>
          <Icon.ArrowLeft height={20} width={20} strokeWidth="3.5" stroke="black" />
        </TouchableOpacity>
      </View>
      <View className='flex-1'>
        <Text className='text-xl mt-5 text-center font-bold'>Actualizar producto</Text>

        {imageData && 
          <Image 
            source={{ uri: imageData }} 
            className='w-[90%] h-[200px] rounded-lg self-center mt-5'
          />}

        <TextInput
          placeholder="Introduzca el nombre del artículo"
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="Introduce el precio del artículo."
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={price?.toString()}
          onChangeText={text => setPrice(text)}
        />
        <TextInput
          placeholder="Introduzca el precio de descuento del artículo."
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={discountPrice?.toString()}
          onChangeText={text => setDiscountPrice(text)}
        />
        <TextInput
          placeholder="Ingrese la descripción del artículo"
          className='w-[90%] h-12 rounded-lg border border-gray-300 pl-5 pr-5 mt-7 self-center'
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <View className='border-2 border-gray-200 mx-5 mt-3'>
          <Text className='text-center text-gray-500'>seleccionar categorías</Text>
          <Picker
              selectedValue={category}
              // style={{ height: 50, width: "90%" }}
              mode={"dialog"}
              onValueChange={(itemValue) => setCategory(itemValue)}
          >
              <Picker.Item label="--------- Seleccione una categoría --------" value="" />
              {dataSource?.map((item, i)=>(
                  <Picker.Item key={i} label={item?.name} value={item?.id} />
              ))}
          </Picker>
        </View>
        <TouchableOpacity
          className='w-[90%] h-12 border border-gray-300 rounded-lg flex items-center justify-center self-center mt-5'
          onPress={pickImage}
        >
          <Text>Seleccionar imagen de la galería</Text>
        </TouchableOpacity>
        
        {loading? 
          <TouchableOpacity
            className='w-[90%] h-12 bg-gray-700 rounded-lg flex items-center justify-center self-center mt-5 mb-32'
            >
            <Text style={{color: '#Fff'}}>loading ...</Text>
          </TouchableOpacity> 
          :
          <TouchableOpacity
            className='w-[90%] h-12 bg-indigo-700 rounded-lg flex items-center justify-center self-center mt-5 mb-32'
            onPress={() => {
              updateFormData();
            }}>
            <Text style={{color: '#Fff'}}>Enviar</Text>
          </TouchableOpacity>
        }
      </View>
    </ScrollView>
  )
}
