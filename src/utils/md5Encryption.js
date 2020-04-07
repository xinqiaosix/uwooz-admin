import hex_md5 from './md5'; // 引入md5加密

// UTF8转BASE64
// function utf8_to_b64(str) {
//   return window.btoa(unescape(encodeURIComponent(str)));
// }

// BASE64转UTF8
// function b64_to_utf8(str) {
//   return decodeURIComponent(escape(window.atob(str)));
// }

// 对参数key值进行排序
function sortToMap(map) {
  var arr = [];
  for (var key in map) {
    arr.push(key);
  }
  arr.sort();
  return arr;
}

// 对参数排序过后的值进行参数拼接
function sign(arr, obj) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    if (obj[arr[i]] === null || obj[arr[i]] === "" || obj[arr[i]] === undefined) {
      continue;
    }
    str += arr[i] + "=" + obj[arr[i]] + "&";
  }
  str = str.substring(0, str.length - 1);
  return str;
}

// 对排序好的参数进行md5加密
function md5Encryption(obj, subkey) {
  let sort = sortToMap(obj);
  let signed = sign(sort, obj);
  let md5 = hex_md5(`${signed}${subkey}`);
  return (md5);
}

export default md5Encryption
