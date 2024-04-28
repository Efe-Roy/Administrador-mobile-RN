import {View, StatusBar} from 'react-native';
import React, {useState} from 'react';
import Items from '../components/tabs/Items';
import Add from '../components/tabs/Add';
import Orders from '../components/tabs/Orders';
import BottomTab from '../components/BottomTab';
import ShopDetail from '../components/tabs/ShopDetail';
import CreateCategory from '../components/tabs/CreateCategory';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <View className='flex-1'>
      <StatusBar />
      { 
        selectedTab == 0 ? <Orders /> : 
        selectedTab == 1 ? <Items /> : 
        selectedTab == 2 ? <Add setSelectedTab={setSelectedTab} /> : 
        selectedTab == 3 ? <CreateCategory /> : 
        <ShopDetail />  
      } 
      
      <BottomTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </View>
  );
};

export default Dashboard;