import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';



const CameraScreen: React.FC = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Permissions are still loading
        return <View style={styles.container}><Text>Loading permissions...</Text></View>;
    }

    if (!permission.granted) {
        // Permission not yet granted
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to use the camera</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
            />
            <Button
                title={facing === 'back' ? 'Switch to Front' : 'Switch to Back'}
                onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    message: {
        marginBottom: 10,
    },
});

export default CameraScreen;


export const unstable_settings = {
  initialRouteName: 'homepage',
};

export const screenOptions = {
  tabBarStyle: { display: 'none' },
};