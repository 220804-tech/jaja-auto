import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FilterLocation, styles, colors } from '../../export'


const RadioButton = () => {
    const [selectedColor, setSelectedColor] = useState('black');

    const colour = ['black', 'blue'];

    return (
        <View style={style.container}>
            <View style={style.colorLabel}>
                <Text style={[styles.mb_2, { color: '#818B8C', fontSize: 16, marginRight: 18, fontFamily: 'Poppins-Medium' }]}>Warna</Text>
                <Text style={[styles.mb_2, { color: colors.Black, fontSize: 16, fontFamily: 'Poppins-Medium' }]}>{selectedColor}</Text>
            </View>

            <View style={style.colorsContainer}>
                {colour.map((color) => (
                    <TouchableOpacity key={color} style={{ ...style.colorButton, backgroundColor: color }} onPress={() => setSelectedColor(color)} />
                ))}
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    colorLabel: {
        flexDirection: 'row',
    },
    text: {
        fontSize: 18,
    },
    colorsContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    colorButton: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 15, // jarak antar tombol warna
    },
});

export default RadioButton;
