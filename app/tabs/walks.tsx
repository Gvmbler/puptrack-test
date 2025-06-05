import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



const walks = () => {
    return (
        <View style={styles.container}>
            <Text>Esta es la página C</Text>
            
        </View>
    );
};

export default walks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});