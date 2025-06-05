import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const formatPhoneNumber = (text: string) => {
  // Remove all non-numeric characters
  const numbers = text.replace(/[^\d]/g, '');
  
  // Format as +XX-XX-XXXX-XXXX
  if (numbers.length <= 2) {
    return `+${numbers}`;
  } else if (numbers.length <= 4) {
    return `+${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  } else if (numbers.length <= 8) {
    return `+${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4)}`;
  } else {
    return `+${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8, 12)}`;
  }
};

const petregister = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [sexo, setSexo] = useState<'Macho' | 'Hembra' | null>(null);
  const [breeds, setBreeds] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [breedsModalVisible, setBreedsModalVisible] = useState(false);
  const [breedSearch, setBreedSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [contacts, setContacts] = useState<string[]>(['']);
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      try {
        let allBreeds: Array<{ id: string; name: string }> = [];
        let url = 'https://dogapi.dog/api/v2/breeds';
  
        while (url) {
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const json = await response.json();
  
          const pageBreeds = json.data
            .filter((b: any) => b.attributes?.name)
            .map((b: any) => ({
              id: b.id,
              name: b.attributes.name
            }));
  
          allBreeds = [...allBreeds, ...pageBreeds];
          
          url = json.links?.next || '';
        }
  
        allBreeds.sort((a, b) => a.name.localeCompare(b.name));
        setBreeds(allBreeds);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        Alert.alert('Error', 'No se pudieron cargar las razas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBreeds();
  }, []);

  const filteredBreeds = breeds.filter(b =>
    b.name.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const addCondition = () => {
    if (conditions.length >= 3) {
      Alert.alert('Límite alcanzado', 'Máximo 3 condiciones');
      return;
    }
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateContact = (text: string, index: number) => {
    const formattedNumber = formatPhoneNumber(text);
    const newContacts = [...contacts];
    newContacts[index] = formattedNumber;
    setContacts(newContacts);
  };

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts(['', ...contacts]);
    } else {
      Alert.alert('Límite alcanzado', 'Máximo 3 contactos alternativos');
    }
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre de la mascota');
      return;
    }
    if (!sexo) {
      Alert.alert('Error', 'Por favor seleccione el sexo de la mascota');
      return;
    }
    if (!birthday) {
      Alert.alert('Error', 'Por favor ingrese la fecha de nacimiento');
      return;
    }
    if (!selectedBreed) {
      Alert.alert('Error', 'Por favor seleccione una raza');
      return;
    }

    const validContacts = contacts.filter(contact => contact.length >= 12);
    
    router.push({
      pathname: './cardcreation',
      params: {
        name,
        sexo,
        birthday,
        breed: selectedBreed,
        conditions: conditions.join(' '),
        contacts: validContacts.join('/'),
      },
    });
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Nombre</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nombre de la mascota"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.sectionTitle}>Mascota</Text>

        <View style={styles.row}>
          <SelectableButton
            label="Macho"
            color="#9ACDFF"
            selected={sexo === 'Macho'}
            onPress={() => setSexo('Macho')}
          />
          <SelectableButton
            label="Hembra"
            color="#F5B5E7"
            selected={sexo === 'Hembra'}
            onPress={() => setSexo('Hembra')}
          />
        </View>

        <Text style={styles.sectionTitle}>Cumpleaños</Text>
        <TextInput 
          style={styles.input} 
          placeholder="17/07/2025"
          value={birthday}
          onChangeText={setBirthday}
        />

        <Text style={styles.sectionTitle}>Raza</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={() => setBreedsModalVisible(true)}
            style={styles.pickerPlaceholder}
          >
            <Text>{selectedBreed || 'Selecciona una raza'}</Text>
            <Ionicons name="chevron-down" size={18} color="#555" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Condiciones médicas</Text>
        <View style={styles.conditionInputContainer}>
          <TextInput
            style={styles.conditionInput}
            value={newCondition}
            onChangeText={setNewCondition}
            placeholder="Agregar condición médica"
            onSubmitEditing={addCondition}
          />
          <TouchableOpacity 
            style={styles.addConditionButton} 
            onPress={addCondition}
            disabled={conditions.length >= 3}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleGroup}>
          {conditions.map((condition, index) => (
            <TouchableOpacity
              key={index}
              style={styles.conditionBubble}
              onPress={() => removeCondition(index)}
            >
              <Text style={styles.conditionText}>{condition}</Text>
              <Ionicons name="close" size={16} color="white" style={styles.removeIcon} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contactos alternativos</Text>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactRow}>
            {index === 0 ? (
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addContact}
                disabled={contacts.length >= 3}
              >
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.addButton, styles.removeButton]}
                onPress={() => removeContact(index)}
              >
                <Ionicons name="remove" size={24} color="white" />
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.inputSmall}
              placeholder="+54-11-XXXX-XXXX"
              value={contact}
              onChangeText={(text) => updateContact(text, index)}
              keyboardType="phone-pad"
              maxLength={16}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleSubmit}
        >
          <Text style={styles.registerButtonText}>Registrar hocico</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={breedsModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Raza</Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar raza..."
              value={breedSearch}
              onChangeText={setBreedSearch}
            />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8136D4" />
                <Text style={styles.loadingText}>Cargando razas...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredBreeds}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.breedItem}
                    onPress={() => {
                      setSelectedBreed(item.name);
                      setBreedsModalVisible(false);
                      setBreedSearch('');
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyMessage}>
                    No se encontraron razas con ese nombre
                  </Text>
                }
              />
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setBreedsModalVisible(false);
                setBreedSearch('');
              }}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

interface SelectableButtonProps {
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

const SelectableButton = ({ label, color, selected, onPress }: SelectableButtonProps) => (
  <TouchableOpacity
    style={[
      styles.selectableButton,
      selected ? styles.selectableButtonSelected : undefined,
    ]}
    onPress={onPress}
  >
    <View style={[styles.colorDot, { backgroundColor: color }]} />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export default petregister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FC',
    padding: 20,
  },
  backButton: { 
    marginBottom: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: { 
    fontSize: 24 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 16,
  },
  smallText: { 
    marginBottom: 8, 
    color: '#555' 
  },
  toggleGroup: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8136D4',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  conditionText: {
    color: 'white',
    marginRight: 8,
  },
  removeIcon: {
    marginLeft: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'white',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  registerButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#8136D4',
  },
  registerButtonText: { 
    fontWeight: 'bold',
    color: 'white',
  },
  selectableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    minWidth: 120,
    justifyContent: 'center',
  },
  selectableButtonSelected: { 
    backgroundColor: '#EFEFEF',
    borderWidth: 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerPlaceholder: { 
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '80%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#8136D4',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  conditionInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  conditionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addConditionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8136D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breedItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  closeText: { 
    color: '#8136D4', 
    fontWeight: 'bold' 
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyMessage: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
  },
});