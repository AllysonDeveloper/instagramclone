import React from "react";
import {useEffect, useState} from 'react';
import firebase from 'firebase';
import {db, auth, storage} from './firebase.js';

function Posts(props){
  const db = firebase.firestore();
  const [comentarios,setComentarios] = useState([]);
  useEffect(()=>{
    db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp', 'desc').onSnapshot(function(snapshot){
      setComentarios(snapshot.docs.map(function(document){
        return{id:document.id, info:document.data()}
      }))
    })
  },[])
    function comentar(id, e){
        e.preventDefault();
        let comentarioAtual = document.getElementById('comentario-'+id).value;
        console.log(comentarioAtual);
        db.collection('posts').doc(props.id).collection('comentarios').add({
          nome: props.user,
          comentario: comentarioAtual,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('comentario-'+id).value = "";
        alert('Post comentado com sucesso!');
      }
    return(
        <div className='postSingle'>
            <span><b>{props.info.userName}</b></span>
            <img src={props.info.image} />
            <p>{props.info.descricao}</p>
            <div className="comments">
              {
                comentarios.map((val)=>{
                  return(
                    <div className="coment-single"><p><b>{val.info.nome}: </b>{val.info.comentario}</p></div>
                  )
                })
              }
            </div>
            { (props.user)?
              <form onSubmit={(e)=>comentar(props.id,e)}>
                <textarea id={"comentario-"+props.id}></textarea>
                <input type='submit'value='Comentar'/>
              </form>
              :
              <div></div>
            }
          </div>
    );
}

export default Posts;