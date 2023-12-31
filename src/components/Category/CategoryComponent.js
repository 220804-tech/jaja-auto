import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, Platform } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { styles, colors, Hp, Wp, FastImage, useNavigation, ServiceCategory, useFocusEffect, CheckSignal, Utils, RFValue, HeaderTitleHome } from '../../export'

export default function CategoryComponent() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const reduxDashboard = useSelector(state => state.dashboard.category)


    const [shimmerData] = useState(['1X', '2X', '3X', '4X', '5X'])
    const [storageDashboard, setstorageDashboard] = useState([])

    useEffect(() => {
        getData()
    }, [reduxDashboard])

    useEffect(() => {
        getStorage()
    }, [])

    // const handleCategory = () => {
    //     setTimeout(() => {
    //         if (!reduxDashboard || reduxDashboard.length == 0) {
    //             EncryptedStorage.getItem('dashcategory').then(result => {
    //                 if (result) {
    //                     dispatch({ type: 'SET_DASHCATEGORY', payload: JSON.parse(result) })
    //                 }
    //             }).catch(err => {
    //                 console.log("🚀 ~ file: CategoryComponent.js ~ line 63 ~ EncryptedStorage.getItem ~ err", err)
    //             })
    //         }
    //     }, 10000);
    //     getData()
    //     getStorage()
    // }
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
        }).catch(error => {
            console.log("🚀 ~ file: CategoryComponent.js ~ line 59 ~ ServiceCategory.getAllCategory ~ err", error.message)
        })
    }

    const handleCategory = () => {
        // dispatch({ type: 'SET_CATEGORY_STATUS', payload: value })
        navigation.navigate('Category');
    }
    const handleSelected = (res) => {
        handleFetch(res)
        handleSaveKeyword(res.name)
        dispatch({ type: 'SET_CATEGORY_NAME', payload: String(res.slug) })
    }

    const handleFetch = (item) => {
        if (item) {
            navigation.navigate('ProductSearch')
            dispatch({ type: 'SET_SEARCH_LOADING', payload: true })
            let error = true
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
                    error = false
                    if (result?.status?.code === 200) {
                        dispatch({ type: 'SET_SEARCH', payload: result.data.items })
                        dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
                        dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
                        dispatch({ type: 'SET_KEYWORD', payload: String(item.name).toLocaleLowerCase() })
                    } else {
                        dispatch({ type: 'SET_SEARCH', payload: [] })
                        dispatch({ type: 'SET_FILTERS', payload: [] })
                        dispatch({ type: 'SET_SORTS', payload: [] })
                        Utils.handleErrorResponse(result, 'Error with status 130012')
                    }
                    dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
                })
                .catch(error => {
                    error = false
                    dispatch({ type: 'SET_SEARCH', payload: [] })
                    dispatch({ type: 'SET_FILTERS', payload: [] })
                    dispatch({ type: 'SET_SORTS', payload: [] })
                    dispatch({ type: 'SET_SEARCH_LOADING', payload: true })
                    Utils.handleError(String(err), 'Error with status 13001')
                    console.log(error.message)
                });

            setTimeout(() => {
                if (error) {
                    Utils.handleSignal()
                    dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
                }
            }, 15000);

        }
    }

    const handleSaveKeyword = (keyword) => {
        EncryptedStorage.getItem('historySearching').then(res => {
            let data = res ? JSON.parse(res) : [];
            let newKeyword = String(keyword).toLocaleLowerCase();
            if (!data.includes(newKeyword)) {
                data.push(newKeyword);
                EncryptedStorage.setItem("historySearching", JSON.stringify(data));
            }
        });
    }

    return (
        <View style={[styles.column]}>
            <HeaderTitleHome title='Kategori Pilihan' handlePress={handleCategory} />
            <View style={[styles.column, styles.p_3]}>
                {reduxDashboard && reduxDashboard.length || storageDashboard && storageDashboard.length ?
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ width: 2 * Wp('100%'), height: Wp("44%") }} >
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={reduxDashboard && reduxDashboard.length ? reduxDashboard : storageDashboard && storageDashboard.length ? storageDashboard : []}
                                // horizontal
                                // numColumns={3}
                                contentContainerStyle={{ flex: 0, width: '100%', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item, index }) => {
                                    return (
                                        <>
                                            {item.name !== 'Lainnya' && item.name !== 'Gift' ?
                                                <TouchableOpacity
                                                    style={{
                                                        borderRadius: 10,
                                                        width: Wp("18%"),
                                                        height: Wp("18%"),
                                                        marginLeft: 1,
                                                        marginRight: 11,
                                                        marginTop: 5,
                                                        marginBottom: 10,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: colors.White,
                                                        shadowColor: colors.BlackGrayScale,
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,

                                                        elevation: 5,

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

                                                    <Text numberOfLines={2} style={[styles.font_8, styles.mt_5, { color: colors.BlueJaja, alignSelf: 'center', textAlign: 'center' }]}>{item.name}</Text>
                                                </TouchableOpacity>
                                                : null
                                            }
                                        </>
                                    )
                                }}
                            />
                        </View>
                    </ScrollView>

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
        </View>
    )
}
