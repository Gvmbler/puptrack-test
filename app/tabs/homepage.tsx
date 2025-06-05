import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PetCard from '../components/PetCard';

const pets = [
  {
    id: '1',
    name: 'Backy Fernandez',
    gender: 'Macho',
    age: '10 años',
    breed: 'Beagle',
    conditions: ['Displasia de retina', 'Otitis'],
    phones: ['11 4624 0659', '11 9060 3454'],
    image: 'https://placedog.net/300/300?id=1',
    color: '#a259ff'
  },
  {
    id: '2',
    name: 'Toby',
    gender: 'Macho',
    age: '5 años',
    breed: 'Border Collie',
    conditions: ['Ninguna'],
    phones: ['11 1234 5678'],
    image: 'https://placedog.net/300/300?id=2',
    color: '#d1a3ff'
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toggleSwitch = () => setIsEnabled(prev => !prev);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, Luca</Text>

      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={styles.petList}
        renderItem={({ item }) => (
          <PetCard
            selectedColor={item.color}
            name={item.name}
            gender={item.gender}
            age={item.age}
            breed={item.breed}
            conditions={item.conditions}
            phones={item.phones}
            image={item.image}
            
          />
        )}
      />

      <View style={styles.pagination}>
        {pets.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              { backgroundColor: idx === currentIndex ? '#a259ff' : '#d3c1e5' }
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/petregister')}
      >
        <Text style={styles.addButtonText}>＋ Nueva mascota</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Paseos de la semana</Text>
        <Switch value={isEnabled} onValueChange={toggleSwitch} thumbColor="#a259ff" />
      </View>

      <View style={styles.walkCard}>
        <Text style={styles.walkDate}>02 Mié</Text>
        <View>
          <Text style={styles.walkerName}>Jorge Rivera</Text>
          <Text style={styles.walkTime}>(14:30 - 15:40)</Text>
        </View>
        <Text style={styles.walkPrice}>$2550</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f9f7ff',
    paddingHorizontal: 20
  },
  greeting: {
    fontSize: 32,
    marginTop: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center'
  },
  petList: {
    height: 220
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: -30
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4
  },
  addButton: {
    width: 200,
    marginVertical: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },
  addButtonText: {
    fontSize: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  walkCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1a3ff'
  },
  walkDate: {
    fontWeight: 'bold'
  },
  walkerName: {
    fontWeight: 'bold'
  },
  walkTime: {
    fontSize: 12,
    color: 'gray'
  },
  walkPrice: {
    fontWeight: 'bold'
  }
});
