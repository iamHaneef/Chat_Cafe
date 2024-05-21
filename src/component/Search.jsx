import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, setDoc, getDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true);
        setUser(null);
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
        setErr(false);
      }
    } catch (error) {
      console.error("Error searching user: ", error);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    const combinedId = [currentUser.uid, user.uid].sort().join(""); // Generate consistent combined ID
    
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
  
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }
  
      await updateOrSetUserChat(currentUser.uid, combinedId, user);
      await updateOrSetUserChat(user.uid, combinedId, currentUser);
    } catch (error) {
      console.error("Error handling selection: ", error);
    }
    setUser(null);
    setUsername("");
  };

  const updateOrSetUserChat = async (userId, combinedId, otherUser) => {
    try {
      const userChatDocRef = doc(db, "userChats", userId);
      const userChatDoc = await getDoc(userChatDocRef);
      
      if (userChatDoc.exists()) {
        await updateDoc(userChatDocRef, {
          [combinedId]: {
            userInfo: {
              uid: otherUser.uid,
              displayName: otherUser.displayName,
              photoURL: otherUser.photoURL,
            },
            date: serverTimestamp(),
          },
        });
      } else {
        await setDoc(userChatDocRef, {
          [combinedId]: {
            userInfo: {
              uid: otherUser.uid,
              displayName: otherUser.displayName,
              photoURL: otherUser.photoURL,
            },
            date: serverTimestamp(),
          },
        });
      }
    } catch (error) {
      console.error("Error updating userChats: ", error);
    }
  };

  return (
    <div className='search'>
      <div className="searchform">
        <input
          type="text"
          placeholder='Find a user'
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt='' />
          <div className="userChatInfo">
            <span className='info'>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
