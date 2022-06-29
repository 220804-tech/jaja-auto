import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, ColorPropType, Touchable, TouchableOpacity } from 'react-native'
import { IconButton } from 'react-native-paper'
import { colors, FastImage, styles, Wp, Hp, CardProduct } from '../../../export'

export default function Etalase(props) {
    const [listetalase, setlistEtalase] = useState([])
    const [count, setcount] = useState(0)


    useEffect(() => {
        if (props?.data?.length) {
            console.log("🚀 ~ file: Etalase.js ~ line 6 ~ Etalase ~ props", props)
            setlistEtalase(props.data)
            setcount(count + 1)
        }
        return () => {

        }

    }, [props?.data?.length])

    const handleDetail = () => {

    }

    const renderRow = ({ item }) => {
        return (
            <View style={styles.column}>
                <TouchableOpacity onPress={() => handleDetail()} style={[styles.row_between_center, styles.p_3, { marginBottom: '0.25%', backgroundColor: colors.White }]}>
                    <View style={styles.row_center}>
                        <FastImage
                            style={[styles.mr_3, { width: Wp("11%"), height: Wp("11%") }]}
                            source={item.items?.[0]?.image ? require('../../../assets/images/JajaId.png') : require('../../../assets/icons/box.png')}
                            resizeMode={FastImage.resizeMode.contain}
                            tintColor={item.items?.[0]?.image ? colors.BlueJaja : colors.Silver}
                        />
                        <Text style={[styles.font_12]}>{item.name}</Text>
                    </View>
                    <View style={styles.row_center}>
                        <Text style={[styles.font_9, styles.T_light]}>{item.items?.length} Produk</Text>
                        <IconButton
                            icon="arrow-right"
                            style={{ padding: 0, margin: 0, backgroundColor: colors.White }}
                            color={colors.Silver}
                            size={19}
                            onPress={() => setDatePickerVisibility(true)}
                        />
                    </View>

                </TouchableOpacity>
                {item?.items?.length ?
                    <CardProduct data={item.items} />
                    : null
                }
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={listetalase}
                renderItem={renderRow}
            />
            <Text>Etalase</Text>
        </SafeAreaView>
    )
}