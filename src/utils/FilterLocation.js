import Citys from './json/citys.json'
export default async function FilterLocation(locations) {
    console.log("file: FilterLocation.js ~ line 3 ~ FilterLocation ~ locations", locations)
    let json = Citys.data;
    console.log("FilterLocation.js ~ line 4567890", json)
    let newArr = []
    locations.map(item => {
        //    let =     Array(json).includes(item.city_name)
    })
})

    // let data = Citys[data];
    // console.log("file: FilterLocation.js ~ line 2 ~ Citys", data)

    // console.log("file: FilterLocation.js ~ line 2 ~ FilterLocation ~ locations", locations)
}