import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import * as Icon from "react-native-feather";
import ShopRow from '../../components/adminComp/ShopRow';
import RiderList from '../../components/adminComp/RiderList';
import UserList from '../../components/adminComp/UserList';

export default function AdminScreen() {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  
  return (
    <ScrollView style={{
      backgroundColor: '#edf1f2'
    }}>
      <StatusBar />
      {/* Header */}
      <View
        // style={{backgroundColor: themeColors.bgColor(1)}}
        className='rounded-b-xl pb-16 bg-[#044244]'
      >
        <View className='flex flex-row justify-between w-[100%] px-4 mt-5 items-center'>
            <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
              <Icon.AlignRight height={20} width={20} strokeWidth="2.5" stroke="white" />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-slate-50'>Administrador</Text>
            <Icon.Search height={20} width={20} strokeWidth="2.5" stroke="white" />
        </View>
      </View>

      {/* Top Actions */}
      <View className='-mt-10'>
        <View className='bg-white py-5 mx-5 rounded-md flex flex-row items-center'>
          <View className='flex flex-1 flex-row justify-around items-center'>
            <TouchableOpacity
              className='py-1 border-b-4 justify-center items-center'
              style={{ borderBottomColor: selectedTab == 0 ? "#044244":"#FFF"}}
              onPress={() => { setSelectedTab(0) }}
            >
              <Icon.Home height={20} width={20} strokeWidth="2.5" stroke="black" />
              <Text className='font-bold text-lg' style={{ color: selectedTab == 0 ? "#044244":"#9ca1a2"}}>Comercio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='py-1 border-b-4 justify-center items-center'
              style={{ borderBottomColor: selectedTab == 1 ? "#044244":"#FFF"}}
              onPress={() => { setSelectedTab(1) }}
            >
              <Icon.Truck height={20} width={20} strokeWidth="2.5" stroke="black" />
              <Text className='font-bold text-lg' style={{ color: selectedTab == 1 ? "#044244":"#9ca1a2"}}>chico de entrega</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='py-1 border-b-4 justify-center items-center'
              style={{ borderBottomColor: selectedTab == 2 ? "#044244":"#FFF"}}
              onPress={() => { setSelectedTab(2) }}
            >
              <Icon.Users height={20} width={20} strokeWidth="2.5" stroke="black" />
              <Text className='font-bold text-lg' style={{ color: selectedTab == 2 ? "#044244":"#9ca1a2"}}>Usuario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {selectedTab == 0 ? (
        <ShopRow />
      ) : selectedTab == 1 ? (
        <RiderList />
        ) :  (
        <UserList />
      )}
    </ScrollView>
  );
}