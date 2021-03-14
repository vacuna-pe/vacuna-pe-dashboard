import firebase from 'firebase';
import { useState, useEffect } from 'react';
import { useObjectVal } from 'react-firebase-hooks/database';
import { seedUsers } from './seedUsers';
import { mockUsers } from './mockUsers'
const firebaseConfig = {
    apiKey: "AIzaSyBHCHvkyc4s5vfLswJFvqafsyG-zOKbSDg",
    authDomain: "vacunape-bot.firebaseapp.com",
    projectId: "vacunape-bot",
    storageBucket: "vacunape-bot.appspot.com",
    messagingSenderId: "701320629400",
    appId: "1:701320629400:web:fcbb1e1803e32b879654ed",
    measurementId: "G-7ML5X7XE6C"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

export function useUsers() {
    const [users, setUsers] = useState({});

    const [value, loading, error] = useObjectVal(firebase.database().ref('users'));


    useEffect(
      () => {
        setUsers(value);
      }
    , [value]);

    // console.log(seedUsers(50, { latitude: -12.060521, longitude: -77.047550 }, 500));
  return users;
  // return mockUsers;
}
