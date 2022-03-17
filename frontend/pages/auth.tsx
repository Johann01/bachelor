import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/firebase";
import {
  getAuth,
  onAuthStateChanged,
  EmailAuthCredential,
  EmailAuthProvider,
} from "firebase/auth";

const auth = getAuth(firebase);

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/home",
  signInOptions: [EmailAuthProvider.PROVIDER_ID],
};

function SignInScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}

export default SignInScreen;
