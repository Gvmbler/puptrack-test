import React, { useState, useCallback } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    Modal,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const defaultImage = 'https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg';

const User = () => {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Animation values
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);


    const handleLongPress = useCallback(() => {
        setImageModalVisible(true);

        setTimeout(() => {
            opacity.value = withTiming(1, { duration: 300 });
            scale.value = withTiming(1, { duration: 300 });
        }, 50);
    }, []);

    const closeFullscreenModal = useCallback(() => {
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 });

        setTimeout(() => {
            setImageModalVisible(false);
        }, 250);
    }, []);

    // Image picker function
    const openImagePickerAsync = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Se necesita permiso para acceder a la galería.");
            return;
        }
       
        try {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8, // lower quality to avoid memory issues
            });

            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                setSelectedImage(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.log('Error al seleccionar imagen:', error);
        }
    };

    const deleteImage = () => {
        setProfileImage(null);
        setModalVisible(false);
    };

    const confirmImage = () => {
        if (selectedImage) {
            setProfileImage(selectedImage);
            setSelectedImage(null);
            setModalVisible(false);
        }
    };

    const animatedModalStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <GestureHandlerRootView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileContainer}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        onLongPress={handleLongPress}
                        delayLongPress={300}
                        activeOpacity={0.8}
                        style={styles.profileImageContainer}
                    >
                        <Image
                            source={{ uri: profileImage || defaultImage }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>

                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Luca F</Text>
                        <Text style={styles.petCount}>3 mascotas</Text>

                        <TouchableOpacity style={styles.addButton} onPress={() => router.push('../ReportMissingPet')}>
                            <Text style={styles.addButtonText}>Enviar mensaje</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Mascotas perdidas</Text>

                <Text style={styles.sectionTitle}>Reportes de avistajes</Text>
                <View style={styles.reportsContainer}>
                    {['https://estaticos-cdn.prensaiberica.es/clip/6d9624e4-a60d-4cb6-bf43-ee2baedd39fd_16-9-aspect-ratio_default_0.jpg','https://i.pinimg.com/236x/2d/18/08/2d180832f944fda3719a4bd5a506368d.jpg', 'https://preview.redd.it/happy-7th-birthday-to-the-floofiest-puptan-kim-yeontan-what-v0-67y1roafeand1.jpg?width=640&crop=smart&auto=webp&s=6c66a94d52c901942b00ceea121d07939ba3d12f', 'https://i0.wp.com/imgpetlife.s3.amazonaws.com/u/fotografias/m/2023/11/13/f768x1-8701_8828_169.jpg?w=1200&ssl=1'].map((img, i) => (
                        <Image key={i} source={{ uri: img }} style={styles.reportImage} />
                    ))}
                </View>
            </ScrollView>


            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cambiar foto del perfil</Text>

                        {selectedImage ? (
                            <View style={styles.previewContainer}>
                                <Image
                                    source={{ uri: selectedImage }}
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
                                        onPress={() => setSelectedImage(null)}
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

                                {profileImage && (
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
            {/* Modal de imagen pantalla completa */}

            {Platform.OS !== 'web' && (
                <Modal
                    visible={imageModalVisible}
                    transparent
                    animationType="none"
                    onRequestClose={closeFullscreenModal}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.previewBackground}
                        onPress={closeFullscreenModal}
                    >
                        <Animated.View style={[styles.previewBackground, animatedModalStyle]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Animated.View style={[styles.circleContainer, animatedImageStyle]}>
                                    <View style={styles.circleImageContainer}>
                                        <Image
                                            source={{ uri: profileImage || defaultImage }}
                                            style={styles.fullImage}
                                            resizeMode="cover"
                                        />
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableOpacity>
                </Modal>
            )}

        
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6FC',
        fontFamily: 'Poppins',
    },
      scrollContainer: {
        flexGrow: 1,
        paddingBottom: 80,      
    },
      profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 20,

      },
      profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden',
        position: 'static',
        marginRight: 20,
        marginTop: 110,
      },
      profileImage: {
        width: '100%',
        height: '100%',
      },
      
      userInfo: {
        backgroundColor: '#F8F6FC',
        paddingTop: 100,
        marginRight: 20,
        flex: 1,
      },
      userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
      },
      petCount: {
        fontSize: 15,
        color: '#666',
        marginBottom: 12,
      },
      addButton: {
        width: (width - 180),
        borderWidth: 1,
        borderColor: '#6A0DAD',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        
      },
      addButtonText: {
        color: '#6A0DAD',
        fontSize: 13,
        fontWeight: '500',
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 20,
      },
      reportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap:10,
        width: '100%',
        justifyContent: 'flex-start', 
        marginLeft: 20,
      },
      reportImage: {
        width: (width - 60) / 3, // Divide available space by 3 with margins
        height: (width - 60) / 3,
        borderRadius: 8,
      },
      
      modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
      modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
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
      previewBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
      circleContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
      },
      circleImageContainer: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 3,
        borderColor: '#6A0DAD',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      },
      fullImage: {
        width: '100%',
        height: '100%',
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
export default User;