import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp_jgodcCvHFiVkwyqu2ieqTx4BMxQPCQ",
  authDomain: "bachelor-5ded0.firebaseapp.com",
  projectId: "bachelor-5ded0",
  storageBucket: "bachelor-5ded0.appspot.com",
  messagingSenderId: "589817081242",
  appId: "1:589817081242:web:4e04e4023d7abff7985e23",
};

const firebase = initializeApp(firebaseConfig);

export default firebase;
