// index.tsx
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import firebase from "../firebase/firebase";
// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebase);

export default function Home() {
  // Destructure user, loading, and error out of the hook.
  const [user, loading, error] = useAuthState(auth);
  // console.log the current user and loading status
  console.log("Loading:", loading, "|", "Current user:", user);

  return <div>Hello!</div>;
}
