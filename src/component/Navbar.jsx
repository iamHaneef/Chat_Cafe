import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className='nav'>
      <span className='name'>Chat Cafe</span>
      <div className='user'>
        {currentUser ? (
          <>
            <img src={currentUser.photoURL || 'default-avatar.png'} alt='' />
            <span className='username'>{currentUser.displayName || 'Anonymous'}</span>
            <button onClick={() => signOut(auth)} className='logout'>Logout</button>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;