import React from 'react'
import { View, Text } from 'react-native'
import ID from './json/indonesia.json';
import EN from './json/england.json';
import { useSelector } from 'react-redux'

export default function Language(props) {
    const res = useSelector(state => state.language)
    let json;
    if (res && res.language == "EN") {
        json = EN;
    } else {
        json = ID
    }
    if (json && json[props]) {
        return json[props];
    } else {
        // console.log("belum di translite = ", props)
        return props;
    }
}

