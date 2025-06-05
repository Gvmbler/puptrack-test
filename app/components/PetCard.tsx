import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export interface PetCardProps {
  selectedColor: string;
  name: string;
  gender: string;
  age: string;
  breed: string;
  conditions: string[];
  phones: string[];
  image?: string;
}

const defaultPetImage = 'https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg';

const PetCard: React.FC<PetCardProps> = ({
  selectedColor,
  name,
  gender,
  age,
  breed,
  conditions,
  phones,
  image,
}) => {
  const [petImage, setPetImage] = useState<string | null>(image || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const openImagePickerAsync = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        setTempImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error al seleccionar imagen:', error);
    }
  }, []);

  const confirmImage = useCallback(() => {
    if (tempImage) {
      setPetImage(tempImage);
      setTempImage(null);
      setModalVisible(false);
    }
  }, [tempImage]);

  const deleteImage = useCallback(() => {
    setPetImage(null);
    setTempImage(null);
    setModalVisible(false);
  }, []);

  return (
    <View style={[styles.card, { borderColor: selectedColor }]}>      
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={[styles.photoCircle, { borderColor: selectedColor }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          {petImage ? (
            <Image source={{ uri: petImage }} style={styles.photoCircle} resizeMode="cover" />
          ) : (
            <>
              <MaterialIcons name="camera-alt" size={32} color="#000" />
              <Text style={styles.addText}>Agregar</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={[styles.nameText]}>{name}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="gender-male" size={16} />
          <Text style={styles.infoText}>{gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={16} />
          <Text style={styles.infoText}>{age}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="dog" size={16} />
          <Text style={styles.infoText}>{breed}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="stethoscope" size={16} />
          <Text style={styles.infoText}>{conditions.join(', ')}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={16} />
          <Text style={styles.infoText}>{phones.join(' / ')}</Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Foto de la mascota</Text>
            {tempImage ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: tempImage }}
                  style={styles.previewCircle}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={confirmImage}
                  >
                    <Text style={styles.confirmText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => setTempImage(null)}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>                
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={openImagePickerAsync}
                >
                  <Text style={styles.option}>Subir foto</Text>
                </TouchableOpacity>
                {petImage && (
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={deleteImage}
                  >
                    <Text style={[styles.option, { color: 'red' }]}>Suprimir foto actual</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.option}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    width: 310,
    backgroundColor: '#fff',
    borderRadius: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginRight: 10,
    marginTop: 40,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  photoCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  addText: {
    fontSize: 12,
    marginTop: 4,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  option: {
    fontSize: 16,
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  previewCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#000',
    borderWidth: 2,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#6A0DAD',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PetCard;