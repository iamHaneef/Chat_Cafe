import React, { useContext, useState } from 'react';
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const handleSend = async () => {
    if (!currentUser || !data.chatId) {
      console.error("Current user or chat ID not available.");
      return;
    }

    try {
      if (img) {
        const storageRef = ref(storage, `chats/${data.chatId}/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuidv4(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
            console.log("Message with image sent successfully.");
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuidv4(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        console.log("Message without image sent successfully.");
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: {
          text,
        },
        [`${data.chatId}.date`]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: {
          text,
        },
        [`${data.chatId}.date`]: serverTimestamp(),
      });

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className='inputs'>
      <input
        type="text"
        placeholder='Type Something...'
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="block">
        <img src={Attach} alt='' />
        <input
          type="file"
          id='file'
          style={{ display: 'none' }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor='file'>
          <img src={Img} alt='' />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
