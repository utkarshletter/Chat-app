import React from 'react'
import { useAuth } from '../context/AuthContext'

export const Home = () => {
    const {AuthUser}=useAuth();
  return (
    <div className='text-3xl'>{AuthUser ? `Hii ${AuthUser.username}` : 'Loading or not logged in'}</div>
  )
}
