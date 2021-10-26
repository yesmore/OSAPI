import {ElMessage} from 'element-plus'

export const ToolMsg = (message:any, type:any, duration=1500) => {
  ElMessage({
    message,
    type,
    duration
  })
}
