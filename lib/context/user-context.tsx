'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface UserContextType {
  userId: string | null
  username: string | null
  setUsername: (name: string) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsernameState] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const storedUserId = localStorage.getItem('userId')
    const storedUsername = localStorage.getItem('username')

    if (!storedUserId) {
      const newUserId = uuidv4()
      localStorage.setItem('userId', newUserId)
      setUserId(newUserId)
    } else {
      setUserId(storedUserId)
    }

    if (storedUsername) {
      setUsernameState(storedUsername)
    }

    setMounted(true)
  }, [])

  const setUsername = (name: string) => {
    setUsernameState(name)
    localStorage.setItem('username', name)
  }

  const logout = () => {
    setUsernameState(null)
    localStorage.removeItem('username')
  }

  return (
    <UserContext.Provider value={{ userId, username, setUsername, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
