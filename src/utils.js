import { ethers } from 'ethers';
import { toUtf8Bytes } from 'ethers/lib/utils';
import { toast } from 'react-toastify';

export const toHex = (num) => {
  const val = Number(num);
  return '0x' + val.toString(16);
};

export const hexToNum = (str) => {
  const removeHex = str.replaceAll('0x', '');
  const val = Number(removeHex);
  return val;
};

export const debounce = (fn, delay) => {
  let timer;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const toHexByte = (string) => {
  var utf8 = unescape(encodeURIComponent(string));
  var arr = [];
  for (var i = 0; i < utf8.length; i++) {
    const utfStr = utf8.charCodeAt(i);
    const hexString = utfStr.toString(16);
    arr.push(hexString);
  }
  const result = '0x' + arr.join('');
  return result;
};

export const toKeccak = (hexStringOrArrayish) => {
  const byteString = toUtf8Bytes(hexStringOrArrayish);
  const keccakString = ethers.utils.keccak256(byteString);
  return keccakString;
};

export async function copyToClipboard(text) {
  try {
    const toCopy = text.slice(0, text.length);
    await navigator.clipboard.writeText(toCopy);
    toast.success('Copied JSON');
  } catch (err) {
    console.error('Failed to copy: ', err);
    toast.success('Some error occured!');
  }
}
