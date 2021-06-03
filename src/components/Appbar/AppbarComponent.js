import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useNavigation, styles, colors, Language } from '../../export'
export default function AppbarComponent(props) {
    let navigation = useNavigation()
    return (

        <View style={[styles.appBar, { justifyContent: 'flex-start', backgroundColor: props.Bg ? props.Bg : colors.BlueJaja }]}>
            {props.back ?
                <TouchableOpacity style={[styles.row_start_center, { marginRight: '2%' }]} onPress={() => navigation.goBack()}>
                    <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                : null}
            {props.title ?
                <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.White }]}>{Language(props.title)}</Text>
                : null
            }
        </View>
    )
}
