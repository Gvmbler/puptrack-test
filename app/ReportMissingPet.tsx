import React, { useState, useRef } from 'react';
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
import { TextInput, ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isDate } from 'date-fns';
import { es } from 'date-fns/locale';

const { width } = Dimensions.get('window');


const SelectableButton = ({ label, color, selected, onPress }) => (
    <TouchableOpacity
        style={[
            styles.selectableButton,
            selected && styles.selectableButtonSelected,
        ]}
        onPress={onPress}
    >
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
);


const ReportMissingPet = () => {
    const router = useRouter();
    const [tipo, setTipo] = useState<'Perro' | 'Gato' | null>(null);
    const [date, setDate] = useState<Date>(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [isDateSelected, setIsDateSelected] = useState(false);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [mediaFiles, setMediaFiles] = useState<any[]>([])


    const handlerDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (event.type === 'dismissed') {
            return;
        }
        if (selectedDate) {
            setDate(selectedDate);
            setIsDateSelected(true);
        }
    };

    const capitalizeDayAndMonth = (date: Date) => {
        const formatted = format(date, "EEEE',' dd 'de' MMMM 'del' yyyy", { locale: es });

        return formatted.replace(/\b([a-záéíóúñ]+)\b/gi, (match, word) => {
            const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            if (dias.includes(word) || meses.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        });
    };
    const formattedDate = capitalizeDayAndMonth(date);


    const pickImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Se necesita permiso para acceder a la galería.");
            return;
        }

        const remainingSlots = 6 - mediaFiles.length;
        if (remainingSlots <= 0) {
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: remainingSlots,
        });

        if (!result.canceled) {
            const selected = result.assets || [];
            const newFiles = selected.slice(0, remainingSlots);
            setMediaFiles((prev) => [...prev, ...newFiles]);
        }
    };


    return (
        <ScrollView style={styles.scrollContainer}>

            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => router.push('./user')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Mascota</Text>
                <View style={styles.row}>
                    <SelectableButton
                        label="Perro"
                        color="#8136D4"
                        selected={tipo === 'Perro'}
                        onPress={() => setTipo('Perro')}
                    />
                    <SelectableButton
                        label="Gato"
                        color="#FFD700"
                        selected={tipo === 'Gato'}
                        onPress={() => setTipo('Gato')}
                    />
                </View>
            </View>



            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Fecha</Text>
                <View style={styles.descriptionContainer}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={{ fontSize: 16, color: isDateSelected ? '#000' : '#6B7280' }}>
                            {isDateSelected ? formattedDate : 'Selecciona una fecha'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === "android" ? "default" : "spinner"}
                            onChange={handlerDateChange}
                            maximumDate={new Date()}
                        />
                    )}
                </View>
            </View>


            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Ubicación</Text>
                <View style={styles.descriptionContainer}>

                    <TextInput
                        style={{ fontSize: 16, color: '#000', paddingVertical: 0, height: 22 }}
                        value={location}
                        onChangeText={setLocation}
                        textAlignVertical="top"
                        placeholder="Escribe la ubicación..."
                    />
                </View>

            </View>


            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <View style={styles.descriptionContainer}>
                    <TextInput
                        style={styles.descriptionInput}
                        value={description}
                        onChangeText={(text) => {
                            if (text.length <= 2200) {
                                setDescription(text);
                            }
                        }}
                        multiline
                        textAlignVertical="top"
                        placeholder="Escribe una descripción detallada..."
                        scrollEnabled
                    />
                    <Text style={styles.charCount}>
                        {description.length} / 2200
                    </Text>
                </View>
            </View>


            <View style={styles.container}>

                <Text style={styles.sectionTitle}>Imagenes</Text>
                <Text style={styles.imageCountText}>
                    {mediaFiles.length} / 6 imágenes
                </Text>

                <View style={styles.imagesContainer}>
                    {mediaFiles.map((file, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: file.uri }} style={styles.images} />
                            <TouchableOpacity style={styles.removeIcon}
                                onPress={() =>
                                    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
                                }>
                                <Ionicons name="close" size={14} color="black" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {mediaFiles.length < 6 && (
                        <TouchableOpacity style={styles.addImageBox} onPress={pickImages}>
                            <Ionicons name="add" size={30} color="#6A0DAD" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('./user')}>
                    <Text style={styles.addButtonText}>Publicar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ReportMissingPet;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 80,
        backgroundColor: '#FAF8FC',
        fontFamily: 'Poppins',
        paddingTop: 25,
    },
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "medium",
        marginBottom: 10,
        alignSelf: "auto",
        width: "90%",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginBottom: 20,
    },
    selectableButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#FFF",
        minWidth: 120,
        justifyContent: "center",
    },
    selectableButtonSelected: {
        backgroundColor: "#EFEFEF",
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500",
    },
    descriptionContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#6A0DAD', //000
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 10,
        maxHeight: 140,
        width: '90%',
    },
    descriptionInput: {
        fontSize: 16,
        color: '#000',
        maxHeight: 200,
        minHeight: 100,
    },
    charCount: {
        fontSize: 14,
        color: '#6B7s0',
        marginTop: -8,
        alignSelf: 'flex-end',
    },
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    locationInput: {
        fontSize: 16,
        color: '#000',
        paddingVertical: 0,
        height: 40,
    },
    imageCountText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 6,
        alignSelf: 'flex-end',
        marginRight: 25,
        marginTop: -20,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginLeft: 40,
        width: '100%',
        justifyContent: 'flex-start',
    },
    imageWrapper: {
        position: 'relative',
    },
    images: {
        width: (width - 60) / 3,
        height: (width - 60) / 3,
        borderRadius: 8,
    },
    removeIcon: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 2,
        zIndex: 1,
    },
    addImageBox: {
        width: (width - 60) / 3,
        height: (width - 60) / 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6A0DAD',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    addButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#6A0DAD',
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 70,
        width: '90%',
        alignSelf: 'center',
    },
    addButtonText: {
        fontSize: 16,
        color: '#6A0DAD',
    },
    backButtonContainer: {
        paddingLeft: 15,
        paddingTop: 10,
        alignSelf: 'flex-start',
    },
});