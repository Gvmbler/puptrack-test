import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import PetCard from './components/PetCard';
import { Alert } from 'react-native';

const colors = [
  '#F8B3B3', '#F8D1B3', '#F8F1B3', '#B3F8C5',
  '#B3D9F8', '#B3B8F8', '#E1B3F8', '#F8B3E6',
  '#E57373', '#F8A73D', '#F8E73D', '#4CAF50',
  '#3F51B5', '#9C27B0'
];

const CardCreation = () => {
  const params = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Calculate age from birthday
  const calculateAge = (birthday: string) => {
    const [day, month, year] = birthday.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  const handleConfirm = async () => {
    if (!selectedColor) {
      Alert.alert('Error', 'Por favor seleccione un color para la tarjeta');
      return;
    }

    try {
      const petData = {
        name: params.name,
        gender: params.sexo,
        birthday: params.birthday,
        breed: params.breed,
        conditions: params.conditions ? String(params.conditions).split(' ') : [],
        contacts: params.contacts ? String(params.contacts).split('/') : [],
        cardColor: selectedColor,
      };

      // Here you would typically make an API call to your backend
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      Alert.alert(
        'Éxito',
        'La tarjeta ha sido creada y guardada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push('/homepage');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving pet data:', error);
      Alert.alert('Error', 'Hubo un error al guardar los datos. Por favor intente nuevamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.successText}>El hocico ha sido registrado exitosamente</Text>

      <PetCard
        name={params.name as string}
        selectedColor={selectedColor ?? '#000'}
        gender={params.sexo as string}
        age={calculateAge(params.birthday as string)}
        breed={params.breed as string}
        conditions={params.conditions ? String(params.conditions).split(' ') : []}
        phones={params.contacts ? String(params.contacts).split('/') : []}
        image='https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg'
      />

      <Text style={styles.chooseColorText}>Elegir color</Text>

      <View style={styles.colorGrid}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorBox,
              { backgroundColor: color },
              selectedColor === color && styles.colorBoxSelected
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAF8FC',
    flexGrow: 1,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorBoxSelected: {
    borderColor: '#000',
    borderWidth: 2,
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: '#8136D4',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#FFF',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#8136D4',
    fontWeight: 'bold',
  },
});

export default CardCreation;