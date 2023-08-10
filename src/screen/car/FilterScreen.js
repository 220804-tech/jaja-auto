import React, { useEffect, useState, useRef } from 'react'
import { Text, View, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ps, useNavigation } from '../../export';
import { useDispatch, useSelector } from 'react-redux';
import { SelectList } from 'react-native-dropdown-select-list'
import { REACT_APP_BEARER_TOKEN } from '@env'
import { RFValue } from "react-native-responsive-fontsize";



const FilterScreen = ({ route }) => {
    const reduxdashRecommandedAuto = useSelector(state => state.dashboard.recommandedauto)
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");

    const brandFilter = useSelector(state => state.dashboard.brandfilter)
    const modelFilter = useSelector(state => state.dashboard.modelfilter)

    const [totalByBrand, setTotalByBrand] = useState(0);
    const [totalByModel, setTotalByModel] = useState(0);
    const [totalMobil, setTotalMobil] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    const [showLoading, setShowLoading] = useState(false);

    const navigation = useNavigation();
    const dispatch = useDispatch();


    // SELECT BRAND
    const Brand = brandFilter
        .filter((item, index, self) => item.value !== "" && self.findIndex(i => i.value === item.value) === index)
        .sort((a, b) => a.value.localeCompare(b.value));

    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        setSelectedModel(null);
    };

    useEffect(() => {
        getBrand(selectedBrand);
    }, [selectedBrand]);


    // SELECT MODEL
    const filteredModels = modelFilter
        .filter(item => item.value !== "" && item.brand === selectedBrand) // Filter item dengan value bukan kosong dan merek yang dipilih
        .map(item => ({
            key: item.key,
            value: item.value.split(' ').slice(0, 3).join(' ') + (item.value.split(' ').length > 3 ? '...' : '')
        }));

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setTotalByModel(0); // Reset total mobil berdasarkan model ketika model dipilih ulang
    };


    const getData = () => {
        if (reduxdashRecommandedAuto) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
            myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.jaja.id/jauto/produk/get", requestOptions)
                .then(response => response.json())
                .then(result => {

                    const totalMobil = (result.data.length)
                    setTotalMobil(totalMobil)

                    const newData = result.data.map(item => {
                        let types = item.grades.map(grade => ({ value: grade.type, key: grade.typeId }));


                        return {
                            productId: item.productId,
                            model: item.model,
                            images: item.images[0].imagePath,
                            slug: item.slug,
                            type: types,
                            price: item.price,
                            color: item.images[0].colorName, // Store the colors array

                        };
                    });

                    dispatch({ type: 'SET_DASHRECOMMANDEDAUTO', payload: newData });
                })
                .catch(error => {
                    Utils.handleError(error.message, 'Error dengan kode status : 13006');
                });
        }
    };

    const getBrand = async (selectedBrand) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
            myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch('https://api.jaja.id/jauto/produk/get', requestOptions);
            const result = await response.json();

            const brand = result.data.map(item => ({ value: item.brand, key: item.productId }));

            // Produk yang memenuhi filter
            const filteredProducts = result.data.filter(item => item.brand === selectedBrand);
            setTotalByBrand(filteredProducts.length)


            dispatch({ type: 'SET_BRANDFILTER', payload: brand });
        } catch (error) {
            Utils.handleError(error.message, 'Error dengan kode status : 13006');
        }
    };



    const getModel = async () => {
        if (modelFilter) {
            try {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
                myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch('https://api.jaja.id/jauto/produk/get', requestOptions);
                const result = await response.json();

                const model = result.data.map(item => ({ value: item.name, key: item.slug, brand: item.brand }));

                dispatch({ type: 'SET_MODELFILTER', payload: model });
            } catch (error) {
                Utils.handleError(error.message, 'Error dengan kode status : 13006');
            }
        }
    };

    const handleFilter = async () => {
        if (!selectedBrand) {
            alert("Harap pilih brand terlebih dahulu.");
            return;
        }

        setShowLoading(true); // Menampilkan loading indicator

        // Menggunakan fungsi setTimeout untuk menampilkan loading selama 3 detik (3000 milidetik)
        setTimeout(async () => {
            try {
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "ci_session=pe7233kmdkcniftbkp04fses0j5uua9m");
                myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const apiUrl = selectedModel
                    ? `https://api.jaja.id/jauto/produk/get?brand=${selectedBrand}&model=${selectedModel}`
                    : `https://api.jaja.id/jauto/produk/get?brand=${selectedBrand}`;

                const response = await fetch(apiUrl, requestOptions);
                const result = await response.json();

                if (selectedModel) {
                    setTotalByModel(result.data.length);
                } else {
                    setTotalByModel(0);
                }

                navigation.navigate('FilterResult', { result: result, selectedBrand });
            } catch (error) {
                Utils.handleError(error.message, 'Error dengan kode status : 13006');
            } finally {
                setShowLoading(false); // Menyembunyikan loading indicator
            }
        }, 1500);
    };



    useEffect(() => {
        getData();
        getBrand();
        getModel();
    }, []);

    // HANDLE RESET FORM
    const handleReset = () => {
        setSelectedBrand('');
        setSelectedModel('');
        setTotalByBrand(0);
        setTotalByModel(0);
        setRefreshKey((prevKey) => prevKey + 1); // This will trigger a re-render
    };


    return (
        <View style={{ flex: 1 }}>

            {showLoading &&
                <Modal transparent={true}>
                    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../assets/gifs/filter.gif')} style={{ width: 75, height: 75 }} />
                    </View>
                </Modal>
            }

            <View style={{ backgroundColor: '#01A0D7', paddingVertical: 15, marginBottom: '5%', borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
                <Text style={{ color: '#ffff', fontSize: RFValue(12), fontFamily: 'Poppins-Medium', textAlign: 'center' }}>
                    Pilih berdasarkan brand, model dan kondisi
                </Text>
            </View>

            <View style={{ marginHorizontal: '5%', justifyContent: 'space-between', }}>
                <View>
                    <Text style={{ color: '#130F26', fontSize: RFValue(12), fontFamily: 'Poppins-Regular', marginBottom: 5 }}>
                        Merk
                    </Text>
                    <SelectList
                        key={refreshKey} // Add the refreshKey as a key to force re-render
                        setSelected={handleBrandSelect}
                        data={Brand}
                        save="value"
                        placeholder="Pilih merk"
                        boxStyles={{ borderColor: '#BABABA', width: '100%' }}
                        inputStyles={{ color: '#818B8C', fontFamily: 'Poppins-Medium', fontSize: RFValue(12) }}
                    />
                </View>

                <View style={{ width: '100%', marginTop: '5%' }}>
                    <Text style={{ color: '#130F26', fontSize: RFValue(12), fontFamily: 'Poppins-Regular', marginBottom: 5 }}>
                        Model
                    </Text>
                    <SelectList
                        key={refreshKey} // Add the refreshKey as a key to force re-render
                        setSelected={handleModelSelect}
                        data={filteredModels}
                        save="value"
                        placeholder="Pilih model"
                        boxStyles={{ borderColor: '#BABABA', width: '100%' }}
                        inputStyles={{ color: '#818B8C', fontFamily: 'Poppins-Medium', fontSize: RFValue(12) }}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#01A0D7',
                    height: 55,
                    width: '55%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 15
                }}
                onPress={handleFilter}
            >
                {/* <Text style={{ color: '#ffff', fontSize: 16, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
                    {selectedBrand !== "" && selectedModel !== ""
                        ? `Tampilkan ${totalByModel} Mobil`
                        : `Tampilkan ${selectedBrand !== "" ? totalByBrand : totalMobil} Mobil`
                    }
                </Text> */}
                <Text style={{ color: '#ffff', fontSize: RFValue(12), fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
                    Tampilkan Mobil
                </Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 210,
                    bottom: 0,
                    height: 55,
                    width: '55%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 15,
                }}
                onPress={handleReset} // Call the handleReset function when "Setel ulang" button is pressed
            >
                <Text style={{ color: '#01A0D7', fontSize: RFValue(12), fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
                    Setel ulang
                </Text>
            </TouchableOpacity>
        </View>
    );


};

export default FilterScreen;
