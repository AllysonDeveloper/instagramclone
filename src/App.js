import './App.css';
import React from 'react';
import {db, auth} from './firebase.js';
import firebase from 'firebase';
import Header from './Header.js';
import {useEffect, useState} from 'react';
import Posts from './Posts.js'


function App() {
  const [user, setUser] = useState();
  const db = firebase.firestore();
  const [posts, setPosts] = useState([]);

  

  useEffect(() =>{
    auth.onAuthStateChanged((val)=>{
      if(val != null)
        setUser(val.displayName);
    })
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(function(snapshot){
      setPosts(snapshot.docs.map(function(document){
        return{id:document.id, info:document.data()}
      }))
    })
  },[])

 return(
  <div className='App'>
    <Header setUser={setUser} user={user}></Header>
    {
      posts.map((val)=>{
        return(
          <Posts user={user} info={val.info} id={val.id} />
        );
        
      })
    }
    
  </div>
 ); 
}

export default App;
