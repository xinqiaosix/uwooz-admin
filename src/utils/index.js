/**
 * 将时间戳转换成指定的时间格式。
 * 四个大写 Y 表示年份；
 * 大写 M 表示月份，一个表示不添 0，两个表示前面会添 0；
 * 大写 D 表示日，一个两个的含义同月份；
 * 大写 H 表示小时，一个两个的含义同月份；
 * 小写 m 表示分钟，一个两个的含义同月份；
 * 小写 s 表示秒数，一个两个的含义同月份。
 * 函数内部的实现主要是匹配各字母的个数，然后判断长度来决定是否替换以及替换的规则。
 * 示例：
 * YYYY-MM-DD
 * YYYY-M-D
 * HH:mm:ss
 * H:m:s
 * YYYY年MM月DD日 HH时mm分ss秒
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] 想要转换的时间格式，默认 YYYY-MM-DD HH:mm:ss
 * @param {number} [timestamp] 时间戳，默认当前时间的时间戳
 */
export const formatTime = (
  format = 'YYYY-MM-DD HH:mm:ss',
  stamp = +new Date(),
) => {
  const instance = new Date(stamp)

  const year = instance.getFullYear()
  const month = instance.getMonth() + 1
  const date = instance.getDate()
  const hours = instance.getHours()
  const minutes = instance.getMinutes()
  const seconds = instance.getSeconds()

  // 使用 match 方法时如果匹配不到结果时会返回 null，这种情况我们重新赋值为 空数组
  const yearMatch = format.match(/Y/g) || []
  const monthMatch = format.match(/M/g) || []
  const dateMatch = format.match(/D/g) || []
  const hoursMatch = format.match(/H/g) || []
  const minutesMatch = format.match(/m/g) || []
  const secondsMatch = format.match(/s/g) || []

  let res = format

  if (yearMatch.length === 4) {
    res = res.replace(/YYYY/, year)
  }
  if (monthMatch.length === 2) {
    res = res.replace(/MM/, month.toString().padStart(2, '0'))
  }
  if (monthMatch.length === 1) {
    res = res.replace(/M/, month)
  }
  if (dateMatch.length === 2) {
    res = res.replace(/DD/, date.toString().padStart(2, '0'))
  }
  if (dateMatch.length === 1) {
    res = res.replace(/D/, date)
  }
  if (hoursMatch.length === 2) {
    res = res.replace(/HH/, hours.toString().padStart(2, '0'))
  }
  if (hoursMatch.length === 1) {
    res = res.replace(/H/, hours)
  }
  if (minutesMatch.length === 2) {
    res = res.replace(/mm/, minutes.toString().padStart(2, '0'))
  }
  if (minutesMatch.length === 1) {
    res = res.replace(/m/, minutes)
  }
  if (secondsMatch.length === 2) {
    res = res.replace(/ss/, seconds.toString().padStart(2, '0'))
  }
  if (secondsMatch.length === 1) {
    res = res.replace(/s/, seconds)
  }

  return res
}
