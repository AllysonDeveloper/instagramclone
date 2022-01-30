import {useEffect, useState} from 'react';
import firebase from 'firebase';
import {db, auth, storage} from './firebase.js';
import React from 'react';


function Header(props){
  
  const [progress,setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const db = firebase.firestore();
  
  
  
  function abrirModal(e){
    e.preventDefault();
    let modal = document.querySelector('#modalContainer');
    modal.style.display = "block";
  }
  function abrirModalPost(e){
    e.preventDefault();
    let modal = document.querySelector('#modalContainerPost');
    modal.style.display = "block";
  }
  function fecharModal(){
    let modal = document.querySelector('#modalContainer');
    modal.style.display = "none";
  }
  function fecharModalPost(){
    let modal = document.querySelector('#modalContainerPost');
    modal.style.display = "none";
  }
  function criarConta(e){
    e.preventDefault();
    let username = document.getElementById('nome-cadastro').value;
    let email = document.getElementById('email-cadastro').value;
    let pass = document.getElementById('senha-cadastro').value;

    auth.createUserWithEmailAndPassword(email,pass)
    .then((auth)=>{
      auth.user.updateProfile({
        displayName:username
      })
      alert('Conta criada com sucesso!');
      let modal = document.querySelector('#modalContainer');
      modal.style.display = "none";
    }).catch((err)=>{
      alert(err.message);
    })
    
  }
  function logar(e){
    e.preventDefault();
    let email = document.getElementById('email-login').value;
    let pass = document.getElementById('senha-login').value;
    auth.signInWithEmailAndPassword(email, pass)
    .then((auth)=>{
      props.setUser(auth.user.displayName);
      window.location.href = "/"
    }).catch((err)=>{
      alert(err.message);
    })
  }
  function deslogar(e){
    e.preventDefault();
    auth.signOut().then(function(){
      props.setUser(null);
      window.location.href = "/"
    })
  }
  function Postar(e){
    e.preventDefault();
    let descricao = document.getElementById('post-descricao').value;
    
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
    uploadTask.on("state_changed", function(snapshot){
      const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      setProgress(progress);
    },function(){

    }, function(){
      storage.ref("images").child(file.name).getDownloadURL()
      .then(function(url){
        db.collection('posts').add({
          image: url,
          descricao: descricao,
          userName: props.user,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        setProgress(0);
        setFile(null);

        alert('Upload realizado com sucesso!');

        document.getElementById('form-upload').reset();
        fecharModalPost(); 
      })
      
    })
    
  }
  return (
      <header>
        <div id="modalContainer">
          <div id='formContainer'>
            <div onClick={()=>fecharModal()} className='closeModal'>X</div>
            <form onSubmit={(e)=>criarConta(e)}>
              <h3>Criar Conta</h3>
              <input required id="nome-cadastro" type='text' placeholder='Seu nome' />
              <input required id="email-cadastro" type='email' placeholder='Seu email' />
              <input id="senha-cadastro" type='password' placeholder='Sua senha' />
              <input type='submit' value='Criar Conta' />
            </form>
          </div>
        </div>
        <div id="modalContainerPost">
          <div id='formContainerPost'>
            <div onClick={()=>fecharModalPost()} className='closeModal'>X</div>
            <form onSubmit={(e)=>Postar(e)} id='form-upload'>
              <h3>Publicar Post</h3>
              <progress value={progress}></progress>
              <input onChange={(e)=>setFile(e.target.files[0])} id="post-file" type='file' />
              <input required id="post-descricao" type='text' placeholder='Descrição' />
              <input type='submit' value='Postar' />
            </form>
          </div>
        </div>
        
        <div className='centro'>
          <div className='logo'>
            <a href='#'><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'/></a>
          </div>
          {
            (props.user)?
              <div>
                <span>Bem Vindo <b>{props.user}</b>!</span>
                <a onClick={(e)=>abrirModalPost(e)} className='btn' href='#'>Postar</a>
                <a onClick={(e)=>deslogar(e)} className='btn' href='#'>Deslogar</a>
              </div>
            :
              <form onSubmit={(e)=>logar(e)}>
                <input id='email-login' type="text" placeholder='Login'/>
                <input id='senha-login' type='password' placeholder='Senha' />
                <input type="submit" name='acao' value='Logar' />
                <a onClick={(e)=>abrirModal(e)} href='#'>Criar conta</a>
              </form>
              
          }
          
        </div>
      </header>
  );
}

export default Header;