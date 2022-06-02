import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { styles, Wp, colors } from '../../export'

export default function HeaderTitleComponent(props) {
    return (
        <View style={[styles.row_between_center, styles.mb]}>
            <View style={[styles.row_start_center, styles.pl_3, styles.py_2, { paddingRight: '7%', backgroundColor: colors.YellowJaja, borderBottomRightRadius: 120 }]}>
                <Text style={[styles.font_11, styles.T_bold, { color: colors.White, marginTop: Platform.OS === 'android' ? '-2%' : '0%' }]}>
                    {props.title}
                </Text>
            </View>
            {props.handlePress ?
                <TouchableOpacity onPress={props.handlePress} style={[styles.row_start_center, styles.px_3, styles.py]} >
                    <Text style={[{ fontSize: 13, fontFamily: 'SignikaNegative-SemiBold', color: colors.BlueJaja }]}>
                        Lihat Semua <Image source={require('../../assets/icons/play.png')} style={[styles.icon_10, { tintColor: colors.BlueJaja }]} />
                    </Text>
                </TouchableOpacity>
                : null}
        </View>
    )
}