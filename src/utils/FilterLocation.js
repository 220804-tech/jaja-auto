import Citys from './json/citys.json'
import { getDistance, getPreciseDistance } from 'geolib';

import EncryptedStorage from 'react-native-encrypted-storage'
import { Utils } from '../export';
export default async function FilterLocation(locations, user, category, auth) {
    let json = Citys.data;
    let newArr = []
    if (user && user.length) {
        locations.map(item => {
            json.map(city => {
                if (String(city.kabko).toLocaleUpperCase() === String(item.city_name).toLocaleUpperCase()) {
                    var pdis = getDistance(
                        { latitude: user[0].latitude, longitude: user[0].longitude },
                        { latitude: city.lat, longitude: city.long },
                    );
                    if (pdis <= 50000) {
                        newArr.push(city.kabko)
                    }
                    console.log("Range Distance", pdis + " => " + pdis / 1000 + "KM")
                }
            })

        })
        let citys = ""
        if (newArr.length > 1) {
            newArr.map(item => citys += item + ",")
            citys = citys.slice(0, citys.length - 1)
        } else {
            citys = newArr[0]
        }

        setTimeout(() => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", auth);
            myHeaders.append("Cookie", "ci_session=57q2g3dt6dg2p8k3u01qtcvppmqsi069");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch(`https://jaja.id/backend/product/produkTerdekat?category=${category}&city_name=${citys}`, requestOptions)
                .then(response => response.json())
                .then(async result => {
                    if (result.status.code === 200 && result.data.produkTerdekat && result.data.produkTerdekat.length) {
                        let res = await EncryptedStorage.getItem('nearestStore')
                        if (res) {
                            let data = JSON.parse(res);
                            let newData = []
                            data.map(item => {
                                if (item.catagory_name !== result.data.catagory_name) {
                                    newData.push(item)
                                }
                            })
                            let newNearestProduct = []
                            newData.unshift(result.data)
                            newData.map(item => {
                                if (item.produkTerdekat && item.produkTerdekat.length) {
                                    item.produkTerdekat.map(product => {
                                        newNearestProduct.push(product)
                                        return product
                                    })
                                }
                            })
                            setTimeout(() => {
                                EncryptedStorage.setItem('nearestProduct', JSON.stringify(newNearestProduct));
                                EncryptedStorage.setItem('nearestStore', JSON.stringify(newData));
                            }, 1500);
                        } else {
                            EncryptedStorage.setItem('nearestStore', JSON.stringify([result.data]));
                        }

                    }

                })
                .catch(error => Utils.handleError(error, 'Error with status code : 12026'));
        }, 500);
    }

}