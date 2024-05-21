import React, { useState } from "react";
import logo from "../img/icon1.jpeg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const file = e.target.avatar.files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Use the authenticated user's UID as part of the storage path
      const storageRef = ref(storage, `users/${res.user.uid}/${displayName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress or state changes if needed
        },
        (error) => {
          console.error(error);
          setErr(true);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // Set user document in 'users' collection
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // Initialize 'userChats' collection for the user
            await setDoc(doc(db, "userChats", res.user.uid), {});

            navigate("/");
          } catch (error) {
            console.error(error);
            setErr(true);
          }
        }
      );
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setErr("Email address is already in use.");
      } else {
        setErr("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo1">Chat Cafe</span>
        <br />
        <br />
        <span className="titles">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="displayName" placeholder="display name" />
          <input type="email" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="avatar" name="avatar" />
          <label htmlFor="avatar">
            <img src={logo} alt="" />
            <span className="avatar">Add an avatar</span>
          </label>

          <button>Sign up</button>
          {err && <span>{err}</span>}
        </form>
        <p>
          You do have an account?{" "}
          <span className="last">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;