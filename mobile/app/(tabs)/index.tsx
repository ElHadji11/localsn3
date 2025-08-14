import { View, Text } from 'react-native'
import React from 'react'
import { useUserSync } from '@/hooks/useUserSync';

const index = () => {
    useUserSync();
    return (
        <View>
            <Text className='flex-1 justify-center items-center'>index</Text>
        </View>
    )
}

export default index