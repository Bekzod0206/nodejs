import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./pages/home"
import Auth from "./pages/auth"
import Navbar from "./components/shared/navbar"
import { toast } from "sonner"
import $axios from "./http"
import { authStore } from "./store/auth.store"
import { useEffect } from "react"

function App() {

  const {setLoading, setIsAuth, setUser} = authStore()
  const navigate = useNavigate()
  const checkAuth = async () => {
    setLoading(true)
    try {
      const {data} = await $axios.get("/auth/refresh")
      localStorage.setItem("accessToken", data.accessToken)
      setIsAuth(true)
      setUser(data.user)
      navigate("/")
    } catch (error) {
      // @ts-ignore
      toast(error?.response?.data?.message)
      localStorage.removeItem("accessToken")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App