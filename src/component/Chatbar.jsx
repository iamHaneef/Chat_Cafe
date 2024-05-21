import React, { useContext } from 'react'
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
//import video from '../img/video.jpeg'
//import contact from '../img/contact.png'
//import dot from '../img/dot.png'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

const Chatbar = () => {
  const  {data} = useContext(ChatContext)

  return (
    <div className='chatbar'>
        <div className="chatnav">
          <span>{data.user?.displayName}</span>
          <div className="images">
            <img src={Cam} alt='' />
            <img src={Add} alt='' />
            <img src={More} alt='' />
          </div>
        </div>
        
          <Messages />
          <Input />
        
    </div>
    
  )
}

export default Chatbar;