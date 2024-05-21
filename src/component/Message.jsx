import React, { useContext, useEffect, useRef } from 'react'
//import iron from '../img/ironman.jpeg'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
//import Messages from './Messages';
const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext)

  const ref=useRef()
  useEffect(()=>
  {
    ref.current?.scrollIntoView({ behaviour:"smooth" })
  },[message])

  console.log(message)

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`} >
      <div className="messageinfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>Just now</span>

      </div>
      <div className="messagecontact">
        {message.img && <img src={message.img} alt="" />}
        <p>{message.text}</p>
    </div>

    </div>
  )
}

export default Message;