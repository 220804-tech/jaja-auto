import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import { styles, Wp, Hp, colors, Appbar, useFocusEffect, FastImage, CheckSignal, useNavigation, Utils, ServiceCategory } from '../../export'
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage'
export default function CategoryScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxCategory = useSelector(state => state.category)
    const [pressed, setPressed] = useState(0)
    const [historySearch, sethistorySearch] = useState([])

    useEffect(() => {
        try {
            EncryptedStorage.getItem('historySearching').then(res => {
                if (!res) {
                    let data = JSON.parse(res);
                    data.push(res)
                }
            })
        } catch (error) {
            console.log("🚀 ~ file: SearchScreen.js ~ line 33 ~ getItem ~ error", error)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                if (reduxCategory.category.length <= 0 || !reduxCategory.category) {
                    EncryptedStorage.getItem('allCategory').then(result => {
                        if (result) {
                            dispatch({ type: 'SET_CATEGORY', payload: result })
                        }
                    }).catch(err => {
                        console.log("🚀 ~ file: CategoryComponent.js ~ line 63 ~ EncryptedStorage.getItem ~ err", err)
                    })
                }
            }, 10000);
        }, []),
    );

    const handleSelected = (res) => {
        navigation.navigate('ProductSearch')
        ServiceCategory.getCategroys(res.slug, dispatch);
        handleSaveKeyword(res.slug)
    }


    const handleSaveKeyword = (keyword) => {

        EncryptedStorage.getItem('historySearching').then(res => {
            if (res) {
                let data = JSON.parse(res);
                if (!data.includes(keyword)) {
                    data.push(String(keyword).toLocaleLowerCase())
                    EncryptedStorage.setItem("historySearching", JSON.stringify(data))
                }
            }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Kategori" />
            <View style={[styles.row, { height: Hp('100%'), paddingBottom: Wp('12.5%') }]}>
                <View style={[styles.column_center, { width: Wp('27%'), height: '100%', backgroundColor: colors.White }]}>
                    <FlatList
                        data={reduxCategory.category}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={{ width: Wp('25%'), height: Wp('25%'), justifyContent: "center", alignItems: "center", elevation: 2, backgroundColor: pressed === index ? colors.White : '#f2f2f2', alignSelf: 'center' }}
                                    onPress={() => setPressed(index)}>
                                    <FastImage
                                        style={{ width: Hp("5%"), height: Hp("5%"), }}
                                        source={{
                                            uri: item.icon,
                                            headers: { Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <Text adjustsFontSizeToFit style={[styles.font_11, { color: colors.BlueJaja, textAlign: 'center' }]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <View style={[styles.column_start_center, styles.py_2, styles.p_2, { width: Wp('73%'), backgroundColor: colors.White }]}>
                    <TouchableOpacity onPress={() => handleSelected(reduxCategory.category[pressed])} style={{ backgroundColor: colors.YellowJaja, padding: '5%', width: '100%', borderRadius: 7, marginBottom: '5%' }}>
                        <Text adjustsFontSizeToFit style={[styles.font_14, styles.T_semi_bold, { color: colors.White, alignSelf: 'center' }]}>{reduxCategory.category[pressed].name}</Text>
                    </TouchableOpacity>
                    {reduxCategory.category[pressed].children.length ?
                        <FlatList
                            data={reduxCategory.category[pressed].children}
                            showsVerticalScrollIndicator={false}
                            // contentContainerStyle={' }}
                            style={{ backgroundColor: colors.White, width: '100%' }}
                            numColumns={3}
                            keyExtractor={(item, index) => String(index + "_")}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={{ flex: 1, width: Wp('20%'), height: Wp('20%'), justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.White, marginBottom: '4%' }}
                                        onPress={() => handleSelected(item)}
                                    >
                                        <FastImage
                                            style={{ width: Hp("5%"), height: Hp("5%"), }}
                                            source={{
                                                uri: item.icon,
                                                headers: { Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                        <Text adjustsFontSizeToFit style={[styles.font_11, { color: colors.BlueJaja, textAlign: 'center' }]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        :
                        <Text adjustsFontSizeToFit style={[styles.font_14, { marginTop: '2%' }]}>Kategori belum tersedia</Text>}
                </View>
            </View>
        </SafeAreaView>
    )
}
