import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyBuWmjZ6C_ozZMbgJyKj3TN75ERwtkFtpc",      
        authDomain: "instagram-clone-7a9ad.firebaseapp.com",      
        projectId: "instagram-clone-7a9ad",      
        storageBucket: "instagram-clone-7a9ad.appspot.com",      
        messagingSenderId: "850067365071",      
        appId: "1:850067365071:web:2acc74ea32a51d21d4ebba",      
        measurementId: "G-GTNV267PR2"
})

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export {db, auth, storage, functions};