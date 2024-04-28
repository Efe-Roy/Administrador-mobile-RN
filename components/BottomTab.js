import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as Icon from "react-native-feather";

export default function BottomTab({selectedTab, setSelectedTab}) {
    return (
        <View className='absolute bottom-4 m-2 mx-5 rounded-3xl p-4 bg-slate-200 flex-row items-center'>
            
            <TouchableOpacity 
                onPress={() => setSelectedTab(0)} 
                className='flex-1 items-center self-center'
            >
                <Icon.CheckCircle height={20} width={20} strokeWidth="2.5" stroke={selectedTab == 0 ? 'blue' : 'black'} />
            </TouchableOpacity>
        
            <TouchableOpacity onPress={() => setSelectedTab(1)} className='flex-1 items-center self-center'>
                <Icon.Package height={20} width={20} strokeWidth="2.5" stroke={selectedTab == 1 ? 'blue' : 'black'} />
            </TouchableOpacity>
        
            <TouchableOpacity onPress={() => setSelectedTab(2)} className='flex-1 items-center self-center absolute left-36 -top-6 bg-blue-500 p-2 rounded-3xl'>
                <FeatherIcon name="plus" size={40} color={ 'white' } />
            </TouchableOpacity>

            <View className='flex-1 items-center self-center' />

            
            <TouchableOpacity onPress={() => setSelectedTab(3) } className='flex-1 items-center self-center'>
                <Icon.Grid height={20} width={20} strokeWidth="2.5" stroke={selectedTab == 3 ? 'blue' : 'black'} />
            </TouchableOpacity>
        
            <TouchableOpacity onPress={() => setSelectedTab(4) } className='flex-1 items-center self-center'>
                <Icon.Info height={20} width={20} strokeWidth="2.5" stroke={selectedTab == 4 ? 'blue' : 'black'} />
            </TouchableOpacity>
        </View>
    )
}