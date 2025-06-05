import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AuthScreen = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    try {
      if (isLogin) { /* Es login */
        if (!usePhone) { /* Es con email */
          if (!email) {
            Alert.alert('Error', 'Ingresa el correo electrónico.');
            return;
          }
          if (!password) {
            Alert.alert('Error', 'Ingresa tu contraseña');
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Error', 'Ingresa un correo válido');
            return;
          }

          const response = await fetch('http://192.168.100.10:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            Alert.alert('Inicio de sesión', 'Bienvenido');
            router.push('./tabs/homepage');
            console.log(data);
          } else {
            Alert.alert('Error', data.message || 'Error desconocido');
          }
        } else { /* Inicia sesion (num tel) */
          if (!phone) {
            Alert.alert('Error', 'Ingresa el número telefónico.');
            return;
          } else if (!password) {
            Alert.alert('Error', 'Ingresa tu contraseña');
            return;
          }

          const response = await fetch('http://192.168.100.10:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone,
              password,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            Alert.alert('Inicio de sesión', 'Bienvenido');
            router.push('./tabs/homepage');
            console.log(data);
          } else {
            Alert.alert('Error', data.message || 'Error desconocido');
          }
        }
      } else { /* Es register */

        if (!usePhone) { /* Es con email */
          if (!email) {
            Alert.alert('Error', 'Ingresa el correo electrónico.');
            return;
          }
          if (!password || !confirmPassword) {
            Alert.alert('Error', 'Ingresa ambas contraseñas');
            return;
          }
          if (password != confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden')
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Error', 'Ingresa un correo válido');
            return;
          }
          /* Envía el email si todo es correcto */
          console.log("se estan por mandar los datos")
          const response = await fetch('http://192.168.100.10:3000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

        
           const data = await response.json();
           if (response.ok) {
           Alert.alert('Registro Exitoso', 'Bienvenido a PupTrack');
           router.push('./tabs/homepage');
           console.log(data);
           } else {
              Alert.alert('Error', data.message || data.error || 'Error desconocido');
            }
        }

        else { /* es con número de telefono */
          if (!phone || !password || !confirmPassword) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
          }
          if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
          }
          /* Envía el numero de telefono si todo es correcto */
          const response = await fetch('http://192.168.100.10:3000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone,
              password,
            }),
          })
          const data = await response.json();
          if (response.ok) {
            Alert.alert('Registro Exitoso', 'Bienvenido a PupTrack');
            router.push('./tabs/homepage');
          } else {
            Alert.alert('Error', data.message || 'Error desconocido');
          }
        }



      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Alert.alert('Error', 'Hubo un problema con la conexión. Intenta nuevamente.');
    }
  };




  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PupTrack</Text>

      {/* Toggle Login / Register */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setIsLogin(true)}
          style={[styles.tabButton, isLogin && styles.tabActive]}
        >
          <Text style={isLogin ? styles.tabTextActive : styles.tabTextInactive}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsLogin(false)}
          style={[styles.tabButton, !isLogin && styles.tabActive]}
        >
          <Text style={!isLogin ? styles.tabTextActive : styles.tabTextInactive}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Email / Phone */}
      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setUsePhone(false)} style={[styles.toggleOption, !usePhone && styles.activeOption]}>
          <Text style={!usePhone ? styles.activeText : styles.inactiveText}>E-mail</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUsePhone(true)} style={[styles.toggleOption, usePhone && styles.activeOption]}>
          <Text style={usePhone ? styles.activeText : styles.inactiveText}>Numero de Telefono</Text>
        </TouchableOpacity>
      </View>

      {/* Email or Phone Field */}
      <TextInput
        placeholder={usePhone ? 'Número de Teléfono' : 'E-mail'}
        placeholderTextColor="#999"
        keyboardType={usePhone ? 'phone-pad' : 'email-address'}
        style={styles.input}
        value={usePhone ? phone : email}
        onChangeText={usePhone ? setPhone : setEmail}
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={styles.inputPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {!isLogin && (
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirmar contraseña"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
            style={styles.inputPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={20} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      {/* Forgot Password (Login) */}
      {isLogin && (
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>
      )}

      {/* Action Button */}
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>o {isLogin ? 'iniciar sesión' : 'registrarse'} con...</Text>

      {/* Social Login */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}><Text style={styles.googleText} onPress={() => router.push('./tabs/homepage')}>G</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}><Text style={styles.googleText} onPress={() => router.push('/ReportMissingPet')}></Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 20,
    alignSelf: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#000',
  },
  tabTextInactive: {
    color: '#aaa',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeOption: {
    borderColor: '#8A2BE2',
  },
  activeText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#aaa',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#4F90F7',
    textAlign: 'right',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8A2BE2',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '500',
  },
  orText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  googleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});