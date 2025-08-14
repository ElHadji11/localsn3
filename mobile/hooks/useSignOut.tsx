import { Alert } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';

export const useSignOut = () => {
    const { signOut } = useClerk();
    const handleSignOut = () => {
        Alert.alert("deconnexion", "voulez-vouos vous déconnecter", [
            {
                text: "Annuler",
                style: "cancel",
            },
            {
                text: "Déconnexion",
                style: "destructive",
                onPress: () => signOut()
            },
        ]);
    };
    return { handleSignOut };
};