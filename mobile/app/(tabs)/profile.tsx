import { Text } from 'react-native'
import React from 'react'
import SignOuButton from '@/app/components/signOutButton'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {
    return (
        <SafeAreaView className='flex-1 items-center justify-center bg-white'>
            <Text>profile</Text>
            <SignOuButton />

        </SafeAreaView>
    )
}

export default profile