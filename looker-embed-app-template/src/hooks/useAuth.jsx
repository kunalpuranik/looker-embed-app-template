import { createContext, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from './useLocalStorage'
const AuthContext = createContext()

/**
 * Auth Context provider.
 *
 * Can use to access:
 * - user: current user (JWT from Google Auth) stored in local storage
 * - login: to save a given user in local storage
 * - logout: to remove the current user and redirect to login page
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null)
  const navigate = useNavigate()

  const login = useCallback(
    async (data) => {
      setUser(data)
      fetch('/api/auth', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data
        })
      }).then((res) => {
        console.log(res.status)
        if(res.status === 200){
          console.log("Auth Successful")
        }
      }).finally(() => navigate('/'))
    },
    [setUser, navigate]
  )

  const logout = useCallback(() => {
    setUser(null)
    navigate('/login', { replace: true })
  }, [setUser, navigate])

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user, login, logout]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Expose AuthContext
 */
export const useAuth = () => {
  return useContext(AuthContext)
}
