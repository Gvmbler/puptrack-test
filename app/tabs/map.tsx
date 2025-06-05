import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const map = () => {
    return (
        <View style={styles.container}>
            <Text>Esta es la página E</Text>
            
        </View>
    );
};

export default map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});