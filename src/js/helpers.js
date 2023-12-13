import { TIMEOUT_SEC } from './config';
import { async } from 'regenerator-runtime';

// 通用的函数

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    // Promise.race 参数一个数组，谁的promise先好就使用谁
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // fetch请求返回一个response res.ok 表示http状态码，res.status表示状态
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

// export const getJson = async function (url) {
//   try {
//     // Promise.race 参数一个数组，谁的promise先好就使用谁
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (error) {
//     // 即使错误 async 任然返回一个promise
//     // 使用 throw 向下传播
//     throw error;
//   }
// };

// export const sendJson = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     // Promise.race 参数一个数组，谁的promise先好就使用谁
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     // fetch请求返回一个response res.ok 表示http状态码，res.status表示状态
//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (error) {
//     // 即使错误 async 任然返回一个promise
//     // 使用 throw 向下传播
//     throw error;
//   }
// };
