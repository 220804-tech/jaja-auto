// export async function provinsi() {
//     var requestOptions = {
//         method: 'GET',
//         redirect: 'follow'
//     };
//     return await fetch("https://jaja.id/core/data/province", requestOptions).then(response => response.json())
//         .then(res => {
//             console.log("🚀 ~ file: Address.js ~ line 8 ~ provinsi ~ res", res)


//             return res.data
//         })
// }
// export async function kabupatenKota(id_provinsi) {
//     var requestOptions = {
//         method: 'GET',
//         redirect: 'follow'
//     };
//     return await fetch(`https://jaja.id/core/data/city?province=${id_provinsi}`, requestOptions).then(response => response.json())
//         .then(res => { return res.data })
// }
// export async function getKecamatan() {
//     var requestOptions = {
//         method: 'GET',
//         redirect: 'follow'
//     };
//     return await fetch('https://jaja.id/core/data/kecamatan', requestOptions)
//         .then(response => response.json())
//         .then(async res => {
//             return await res
//         })
// }
// export async function getKelurahan(kd_kec) {
//     var requestOptions = {
//         method: 'GET',
//         redirect: 'follow'
//     };
//     return await fetch(`https://jaja.id/core/data/kelurahan?kd_kec=${kd_kec}`, requestOptions)
//         .then(response => response.json())
//         .then(async res => {
//             return await res
//         })
// }
import axios from 'axios';
export async function provinsi() {
    return await axios.get("https://jaja.id/core/data/province").then((res) => res.data)
}
export async function kabupatenKota(id_provinsi) {
    return await axios.get(`https://jaja.id/core/data/city?province=${id_provinsi}`).then((res) => res.data)
}
export async function getKecamatan() {
    return await axios.get('https://jaja.id/core/data/kecamatan').then((res) => res.data)
}
export async function getKelurahan(kd_kec) {
    return await axios.get(`https://jaja.id/core/data/kelurahan?kd_kec=${kd_kec}`).then((res) => res.data)
}