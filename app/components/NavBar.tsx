import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const icons = [
    { name: 'fingerprint', key: 'scan', lib: 'FontAwesome5' },
    { name: 'map-marker', key: 'map', lib: 'FontAwesome' },
    { name: 'home', key: 'homepage', lib: 'FontAwesome' },
    { name: 'paw', key: 'walks', lib: 'FontAwesome' },
    { name: 'user', key: 'user', lib: 'FontAwesome' },
];



const NavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.navBarContainer}>
            <View style={styles.navBar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const icon = icons.find(i => i.key === route.name);

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const IconLib = icon?.lib === 'FontAwesome5' ? FontAwesome5 : FontAwesome;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={[
                                styles.iconWrapper,
                                isFocused && styles.activeIconWrapper,
                                index === 2 && styles.centerSpacing,
                            ]}
                        >
                            <View style={[isFocused ? styles.floatingIcon : styles.normalIcon]}>
                                {IconLib && (
                                    <IconLib
                                        name={icon?.name ?? 'question'}
                                        size={28}
                                        color={isFocused ? '#a259ff' : 'gray'}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: 90,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconWrapper: {
        top: -20,
    },
    normalIcon: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#f1e4ff',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    centerSpacing: {
        marginHorizontal: 15,
    },
});

export default NavBar;
