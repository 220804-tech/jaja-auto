import React, { useEffect } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import store from '../store/combineReducer'
import Routes from '../routes/Routes'
// import firebase from 'firebase'


export const buyerNotifications = async (params, uidBuyyer) => {

    database()
        .ref("/people/" + uidBuyyer)
        .once('value')
        .then(snapshot => {
            var item = snapshot.val();
            console.log("🚀 ~ file: Firebase.js ~ line 23 ~ buyerNotifications ~ item", item)
            if (item.notif) {
                console.log("🚀 ~ file: Firebase.js ~ line 25 ~ buyerNotifications ~ item.notif", item.notif)
                database().ref(`/people/${uidBuyyer}/notif`).update(params === "home" ? { home: item.notif.home + 1 } : params === "chat" ? { chat: item.notif.chat + 1 } : { orders: item.notif.orders + 1 })

            } else {
                database().ref(`/people/${uidBuyyer}/notif`).update({ orders: 0, home: 0, chat: 0 }).then(() => {
                    database().ref(`/people/${uidBuyyer}/notif`).update(params === "home" ? { home: item.notif.home + 1 } : params === "chat" ? { chat: item.notif.chat + 1 } : { orders: item.notif.orders + 1 })
                })
            }
        })
}

export const sellerNotifications = async (params) => {
    try {
        let seller = await getToko();
        database().ref(`/people/${seller.uid}/notif`).update(params === "home" ? { home: 0 } : params === "chat" ? { chat: 0 } : { orders: 0 })
    } catch (error) {
        console.log("🚀 ~ file: Firebase.js ~ line 30 ~ sellerNotifications ~ error", error)
    }
}

export const getNotifications = async () => {
    let seller = await getToko();
    return database().ref("/people/" + seller.uid).once('value').then(async res => {
        let item = res.val()
        if (item.notif) {
            return await item.notif;
        } else {
            //masuk sini jika data people di firebase database tidak ada
            let notif = { orders: 0, home: 0, chat: 0 };
            database().ref(`/people/${seller.uid}/`).update({ notif: { orders: 0, home: 0, chat: 0 } })
            database().ref(`/friend/${seller.uid}/null`).set({ chat: 'null' })
            return notif;
        }
    })
}

export const notifChat = async (target, data) => {
    console.log("🚀 ~ file: Firebase.js ~ line 55 ~ notifChat ~ target", target)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "key=AAAAQjWK8Ko:APA91bFWRgTUvuPlU1dpVR-FqnLQPYgKGtbif1njzRDKnlH5C_uS1MkocgTASxDPw-tDnRjJJrsC6WQdeLDnV1uFp9gTjdwVXU1rvbKvqwhh78LuPhkbwtS79LYwrv_gICYa3MCExD08");

    var raw = JSON.stringify({
        "to": target,
        "collapse_key": "type_a",
        "notification":
        {
            "body": data.body,
            "title": data.title,
            "image": "https://firebasestorage.googleapis.com/v0/b/fir-chat-apps-cb8cf.appspot.com/o/jaja-logo.png?alt=media&token=35c90d56-decd-4376-9aff-c915d08179ea"
        }

    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("🚀 ~ file: index.js ~ line 145 ~ notifChat ~ result", result)
        })
        .catch(error => console.log('error', error));
}


