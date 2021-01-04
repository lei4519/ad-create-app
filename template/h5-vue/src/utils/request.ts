import axios from 'axios'
const axiosInstance = axios.create()
// 处理 请求格式 URLSearchParams FormData
axiosInstance.interceptors.request.use(config => {
  if (config.formData || config.urlSearchParams) {
    const data: any = config.formData || config.urlSearchParams
    config.data = Object.entries(data).reduce(
      (form, [key, val]) => {
        if (Array.isArray(val)) {
          val.forEach(v =>
            form.append(
              `${key}[]`,
              typeof v === 'object' ? JSON.stringify(v) : v
            )
          )
        } else {
          form.append(
            key,
            typeof val === 'object' ? JSON.stringify(val) : (val as any)
          )
        }
        return form
      },
      config.formData ? new FormData() : new URLSearchParams()
    )
  }
  return config
})

export const useRequest = axiosInstance