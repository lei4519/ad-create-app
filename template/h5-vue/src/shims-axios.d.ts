import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  /**
   * @param formData 自动处理成 FormData 格式
   */
  export interface AxiosRequestConfig {
    formData?: object
    urlSearchParams?: object
  }
}
