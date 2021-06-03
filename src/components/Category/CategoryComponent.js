import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector, useDispatch } from 'react-redux'
import { styles, colors, Hp, FastImage, useNavigation, ServiceCategory, useFocusEffect } from '../../export'
export default function CategoryComponent() {
    let navigation = useNavigation();
    const reduxDashboard = useSelector(state => state.dashboard.category)
    const dispatch = useDispatch()
    const [state, setstate] = useState([])
    useEffect(() => {
        getData()
    }, [])

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                if (reduxDashboard.length <= 0 || !reduxDashboard) {
                    EncryptedStorage.getItem('dashcategory').then(result => {
                        if (result) {
                            dispatch({ type: 'SET_DASHCATEGORY', payload: JSON.parse(result) })
                        }
                    }).catch(err => {
                        console.log("🚀 ~ file: CategoryComponent.js ~ line 63 ~ EncryptedStorage.getItem ~ err", err)
                    })
                }
            }, 10000);
        }, []),
    );

    const getData = () => {
        ServiceCategory.getAllCategory().then(res => {
            if (res) {
                dispatch({ type: 'SET_CATEGORY', payload: res })
                EncryptedStorage.setItem("allCategory", JSON.stringify(res));
            }
        }).catch(err => {
            console.log("🚀 ~ file: CategoryComponent.js ~ line 59 ~ ServiceCategory.getAllCategory ~ err", err)
        })
    }

    const handleCategory = (value) => {
        dispatch({ type: 'SET_CATEGORY_STATUS', payload: value })
        navigation.navigate('Category');
    }
    const handleSelected = (res) => {
        handleFetch(res)
        handleSaveKeyword(res)
    }

    const handleFetch = (text) => {
        if (text) {
            dispatch({ type: 'SET_KEYWORD', payload: text })
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/product/category/${text}?page=1&limit=100&keyword=a&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: CategoryScreen.js ~ line 64 ~ handleFetch ~ result", result)
                    dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                    dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                    dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                })
                .catch(error => {
                    CheckSignal().then(res => {
                        if (res.connect == false) {
                            ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                        } else {
                            ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                    })
                });

            setTimeout(() => {
                navigation.navigate('ProductSearch')
            }, 500);
        }
    }

    const handleSaveKeyword = (keyword) => {
        EncryptedStorage.getItem('historySearching').then(res => {
            if (res) {
                let data = JSON.parse(res);
                data.push(keyword)
                EncryptedStorage.setItem("historySearching", JSON.stringify(data))
            }
        })
    }

    return (
        <View style={styles.p_3}>
            <View style={styles.row_between_center}>
                <Text style={styles.titleDashboard}>
                    Kategori Pilihan
                </Text>
                <TouchableOpacity onPress={() => handleCategory('Art Shop')}>
                    <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>
                        Lihat Semua
                </Text>
                </TouchableOpacity>
            </View>
            {reduxDashboard && reduxDashboard.length ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={reduxDashboard}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    borderRadius: 10,
                                    width: Hp("9%"),
                                    height: Hp("9%"),
                                    marginLeft: 1,
                                    marginRight: 11,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 2,
                                    backgroundColor: colors.White
                                }}
                                onPress={() => handleSelected(item.name)}
                                key={index}
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
                                <Text
                                    style={{
                                        fontSize: Hp("1.6%"),
                                        fontStyle: "normal",
                                        letterSpacing: 0,
                                        textAlign: "center",
                                        color: colors.BlueJaja,
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                />

                : null
            }
        </View>
    )
}
