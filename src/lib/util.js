function calculateBytes(num) {
  const unit = ['B', 'KB', 'MB', 'GB'];
  let level = 0;
  while (num >= 1024 && level < unit.length) {
    level += 1;
    num /= 1024;
  }
  return num.toFixed(2) + unit[level];
}

function dateToStr(date = new Date(), format = 'yyyy-MM-dd') {
  if (!(date instanceof Date)) {
    date = new Date(+date * 1000);
  }
  if (isNaN(+date)) {
    return null;
  }
  const dateDic = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    '[hH]+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.ceil((date.getMonth() + 1) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (`${date.getFullYear()}`).slice(-RegExp.$1.length));
  }
  for (const [key, value] of Object.entries(dateDic)) {
    if (new RegExp(`(${key})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? value : (`00${value}`).slice(-2));
    }
  }
  return format;
}

function defaultComparer(a, b) {
  return a > b;
}

const quickSort = (arr, comparer = defaultComparer, order = 'ascending') => {
  if (arr.length <= 1) {
    return arr;
  }
  let trueComparer = comparer;
  if (order === 'descending') {
    trueComparer = (...argv) => !comparer(...argv);
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (i !== pivotIndex) {
      if (trueComparer(pivot, arr[i])) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
  }
  return quickSort(left, comparer, order).concat([pivot], quickSort(right, comparer, order));
};

export {
  calculateBytes,
  quickSort,
  dateToStr,
};
