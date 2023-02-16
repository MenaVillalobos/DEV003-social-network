// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  signInWithPopup, GoogleAuthProvider, /* signInWithRedirect, */ sendEmailVerification, /* sendPasswordResetEmail, */
} from 'firebase/auth';
import {
  getDatabase, set, ref, update,
} from 'firebase/database';
import {
  getFirestore, collection, addDoc, getDocs, updateDoc,
} from 'firebase/firestore';
import { async } from 'regenerator-runtime';
// eslint-disable-next-line import/no-cycle
import { onNavigate } from './lib/index';
import { muroStructure } from './component/mainPage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
const app = initializeApp({
  apiKey: 'AIzaSyB1J92DpSTCq8e615N8wr3-BchbG76QyUc',
  authDomain: 'social-network-41ddd.firebaseapp.com',
  databaseURL: 'https://social-network-41ddd-default-rtdb.firebaseio.com',
  projectId: 'social-network-41ddd',
  storageBucket: 'social-network-41ddd.appspot.com',
  messagingSenderId: '948862973616',
  appId: '1:948862973616:web:74ff33512154d5ff9b2d75',
  measurementId: 'G-ENM9G4585Z',
});
const database = getDatabase(app);
const auth = getAuth();
//  const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
const dataBaseFirestore = getFirestore();
// verificacion de correo con email
function emailVerification() {
  sendEmailVerification(auth.currentUser)
    .then(() => {
    // Email verification sent!
    // ...
    });
}
// creacion de usuario
export function createAccountFunction() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  createUserWithEmailAndPassword(auth, email, password, username)
    .then((userCredential) => {
      //   signed in
      const user = userCredential.user;

      // valida que el correo sea valido de lo contrario da error de autenticacion.
      set(ref(database, `users/${user.uid}`), {
        username,
        email,
      });
      alert('user created');

      const gettingemail = document.getElementById('email').value;
      const separatingEmail = gettingemail.split('@');
      console.log(separatingEmail);
      const settingUsername = separatingEmail[0];
      console.log(settingUsername);
      localStorage.setItem('username', settingUsername);

      onNavigate('/mainPage');
      emailVerification();
      onAuthStateChanged(auth, (user1) => {
        if (user1) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user1.uid;
          console.log(`Validación de log in: ${uid}`);
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
      // ..
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;

      alert('Something went wrong with your e-mail or password');
    });
}
// ingreso a interfaz
export function loginAccountFunction() {
  const EmailLogin = document.getElementById('EmailLogin').value;
  const PasswordLogin = document.getElementById('PasswordLogIn').value;
  const username = document.getElementById('username').value;

  signInWithEmailAndPassword(auth, EmailLogin, PasswordLogin, username)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      const dt = new Date();
      update(ref(database, `users/${user.uid}`), {
        last_login: dt,
      });
      //
      const gettingemail = document.getElementById('EmailLogin').value;
      const separatingEmail = gettingemail.split('@');
      console.log(separatingEmail);
      const settingUsername = separatingEmail[0];
      console.log(settingUsername);
      localStorage.setItem('username', settingUsername);

      alert('User loged in!');
      onNavigate('/mainPage');
      onAuthStateChanged(auth, (user1) => {
        if (user1) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log(user1);
          const uid = user1.uid;
          console.log(`Validación de log in: ${uid}`);
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
    });
}
// ingreso con google
export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider).then((result) => {
    const user = result.user.email;
    const separatingEmail = user.split('@');
    console.log(separatingEmail);
    const settingUsername = separatingEmail[0];
    console.log(settingUsername);
    localStorage.setItem('username', settingUsername);

    onNavigate('/mainPage');
    console.log('Usuario se loggeo correctamente');
    console.log(result);
    onAuthStateChanged(auth, (user1) => {
      if (user1) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user1.uid;
        console.log(`Validación Log in with google: ${uid}`);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    // ...
  }).catch((error) => {
    alert(errorMessage);
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}
// cerrar session
export function logOut() {
  signOut(auth).then(() => {
    // Sign-out successful.
    alert('You are loggin out');
    // Modificar para que username sea el correo del usuario
    localStorage.removeItem('username');

    onNavigate('/');
  }).catch((error) => {
    // An error happened.
    const errorCode = error.code;
    const errorMessage = error.message;

    alert(errorMessage);
  });
}
/* //funcion recuperar contraseña
export function passwordResetEmail() {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
    // Password reset email sent!
    // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    // ..
    });
} */
// funcion agregar datos en firestore
const publicationsAll = collection(dataBaseFirestore, 'publications');
export async function createPost(username, text) {
  const postData = {
    dateTime: new Date(),
    likes: 0,
    username, // cuando key y value tengan el mismo valor puedes poner el nombre y ,
    text,
  };
  await addDoc(publicationsAll, postData);
  console.log('This value has been written to the database');
  console.log(postData);
}

// función regresar las publicaciones de firestore
export async function recoverData() {
  const querySnapshot = await getDocs(collection(dataBaseFirestore, 'publications'));
  querySnapshot.forEach((doc) => {
    muroStructure(doc);
  });
}
recoverData();

// funcion editar texto publicacion
export async function editPost(idDoc, newText) {
  await updateDoc(idDoc, {
    text: newText,
  });
}
// funcion eliminar texto publicacion
