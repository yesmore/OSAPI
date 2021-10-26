/**
 * 工具库
 * */

// 随机数
const common = (min:number, max:number) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 时间格式化 - 时间戳
const timeFormat = (nowTime: any) => {
  return nowTime.getFullYear()+"-"+(nowTime.getMonth()+1)+"-"+nowTime.getDate()+' '+nowTime.getHours()+':'+nowTime.getMinutes()+':'+nowTime.getSeconds();
}

// mongoDB - dateformat
const mongoDateFormat = (time:any) => {
  return time.slice(0, 10) + ' ' + time.slice(11, 19)
}

export {
  common,
  timeFormat,
  mongoDateFormat
}
