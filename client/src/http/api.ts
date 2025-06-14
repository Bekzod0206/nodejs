import axios from "axios"
import $axios from "."

export const API_URL = `http://localhost:8080`

const $api = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/api`
})

$api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`
  return config
})

$api.interceptors.response.use(config => {
    return config
  },
  async error => {
    const originalRequest = error.config
    if(error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true

      try {
        const {data} = await $axios.post("/auth/refresh")
        localStorage.setItem("accessToken", data.accessToken)
        return $api.request(originalRequest)
      } catch (error) {
        console.log("Not authorized")
      }
    }
    throw Error
  }
)

export default $api