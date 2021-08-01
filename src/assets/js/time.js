export function isZero(m){
  return m < 10 ? '0' + m : m
}
export function formatDate(shijianchuo) {
  //时间戳是整数，否则要parseInt转换
  var time = new Date(shijianchuo) // 需要使用Date格式进行日期转化，若是时间戳、字符串时间，需要通过new Date(..)转化
  var y = time.getFullYear()
  var m = time.getMonth()+1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y+'-'+isZero(m)+'-'+isZero(d)+' '+isZero(h)+':'+isZero(mm)+':'+isZero(s)
}

export const Colors = ['#3399ff', '#ff9900', '#db4553', '#00cc66', '#6666cc', '#97ddff', '#16dcdc', '#ff6600', '#b0d882', '#4894b2', '#003366', '#379684']
