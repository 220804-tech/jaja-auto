import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { styles, colors, Hp, Wp, FastImage, useNavigation, ServiceCategory, useFocusEffect, CheckSignal, Utils } from '../../export'

export default function CategoryComponent() {
    let navigation = useNavigation();
    const dispatch = useDispatch()
    const reduxDashboard = useSelector(state => state.dashboard.category)
    const [shimmerData] = useState(['1X', '2X', '3X', '4X', '5X'])
    const [storageDashboard, setstorageDashboard] = useState([])

    useEffect(() => {
        setTimeout(() => {
            if (!reduxDashboard || reduxDashboard.length == 0) {
                EncryptedStorage.getItem('dashcategory').then(result => {
                    if (result) {
                        dispatch({ type: 'SET_DASHCATEGORY', payload: JSON.parse(result) })
                    }
                }).catch(err => {
                    console.log("🚀 ~ file: CategoryComponent.js ~ line 63 ~ EncryptedStorage.getItem ~ err", err)
                })
            }
        }, 10000);
        getData()
        getStorage()
    }, [reduxDashboard])

    useFocusEffect(
        useCallback(() => {

        }, []),
    );

    const getStorage = () => {
        EncryptedStorage.getItem('dashcategory').then(res => {
            if (res) {
                setstorageDashboard(JSON.parse(res))
            }
        })
    }

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
        console.log("🚀 ~ file: CategoryComponent.js ~ line 65 ~ handleSelected ~ handleSelected", res)
        handleFetch(res)
        handleSaveKeyword(res.name)
    }

    const handleFetch = (item) => {

        if (item) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://jaja.id/backend/product/category/${item.slug}?page=1&limit=100&keyword=&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: CategoryComponent.js ~ line 83 ~ handleFetch ~ result", result)
                    if (result && Object.keys(result).length && result.status.code == 200) {
                        dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                        dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                        dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                        dispatch({ type: 'SET_KEYWORD', payload: item.name })

                    } else {
                        dispatch({ type: 'SET_SEARCH', payload: [] })
                        dispatch({ type: 'SET_FILTERS', payload: [] })
                        dispatch({ type: 'SET_SORTS', payload: [] })
                        // Utils.handleErrorResponse(result, 'Error with status 130012')
                    }
                })
                .catch(error => {
                    dispatch({ type: 'SET_SEARCH', payload: [] })
                    dispatch({ type: 'SET_FILTERS', payload: [] })
                    dispatch({ type: 'SET_SORTS', payload: [] })
                    Utils.handleError(error, 'Error with status 13001')
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
                <Text style={[styles.titleDashboard, styles.mb_3]}>
                    Kategori Pilihan
                </Text>
                <TouchableOpacity onPress={() => handleCategory('Art Shop')}>
                    <Text style={[{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: colors.BlueJaja }]}>
                        Lihat Semua <Image source={require('../../assets/icons/play.png')} style={[styles.icon_10, { tintColor: colors.BlueJaja }]} />
                    </Text>
                </TouchableOpacity>
            </View>
            {reduxDashboard && reduxDashboard.length || storageDashboard && storageDashboard.length ?
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={reduxDashboard && reduxDashboard.length ? reduxDashboard : storageDashboard && storageDashboard.length ? storageDashboard : []}
                    horizontal={true}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    borderRadius: 10,
                                    width: Wp("19%"),
                                    height: Wp("19%"),
                                    marginLeft: 1,
                                    marginRight: 11,
                                    marginTop: 5,
                                    marginBottom: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 2,
                                    backgroundColor: colors.White
                                }}
                                onPress={() => handleSelected(item)}
                                key={index}
                            >
                                <FastImage
                                    style={{ width: Wp("9%"), height: Wp("9%"), }}
                                    source={{
                                        uri: item.icon,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />

                                <Text numberOfLines={2} style={[styles.font_11, { color: colors.BlueJaja, alignSelf: 'center', textAlign: 'center' }]}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                :
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {shimmerData.map(item => {
                        return (
                            <ShimmerPlaceHolder
                                key={item}
                                LinearGradient={LinearGradient}
                                width={Hp('9%')}
                                height={Hp("9%")}
                                style={{ borderRadius: 8, marginLeft: 1, marginRight: 11, marginTop: 5, marginBottom: 10 }}
                                shimmerColors={['#ebebeb', '#c5c5c5', '#ebebeb']}
                            />
                        )
                    })}

                </ScrollView>
            }
        </View>
    )
}
