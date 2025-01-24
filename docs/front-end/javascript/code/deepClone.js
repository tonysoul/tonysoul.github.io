// 基本类型的字符串标识
const stringTag = "[object String]",
  numberTag = "[object Number]",
  bigIntTag = "[object BigInt]",
  booleanTag = "[object Boolean]",
  symbolTag = "[object Symbol]",
  nullTag = "[object Null]",
  undefinedTag = "[object Undefined]";

// 对象类型字符串标识
const arrayTag = "[object Array]",
  objectTag = "[object Object]",
  mapTag = "[object Map]",
  setTag = "[object Set]";

// 所有的基本类型
const basicTypes = [
  stringTag,
  numberTag,
  bigIntTag,
  booleanTag,
  symbolTag,
  nullTag,
  undefinedTag,
];

// 类型判断，能够准确的判断所有类型，不管是基本类型，对象类型，还是null
/**
 *
 * @param {*} arg
 * @returns [object String]
 */
function getType(arg) {
  return Object.prototype.toString.call(arg);
}

// 判断是否为基本类型
function isBasicType(arg) {
  return basicTypes.includes(getType(arg));
}

function forEach(array, iterable) {
  const length = array.length;
  let index = -1;

  while (++index < length) {
    iterable(array[index], index);
  }

  return array;
}

function clone(target, map = new Map()) {
  // 如果是基本类型就直接返回值
  if (isBasicType(target)) {
    return target;
  }

  // 初始化对象类型，根据类型判断是array，还是object
  let cloneTarget;
  let type = getType(target);

  if (type === arrayTag) {
    cloneTarget = [];
  } else if (type === objectTag) {
    cloneTarget = {};
  } else if (type === mapTag) {
    // 如果是map类型
    cloneTarget = new Map();

    // 遍历map，并重新赋值给新的map
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value));
    });

    return cloneTarget;
  } else if (type === setTag) {
    // 如果是set类型
    const cloneTarget = new Set();

    // 遍历set，并重新赋值给新的set
    target.forEach((value) => {
      cloneTarget.add(clone(value));
    });

    return cloneTarget;
  } else {
    console.log(`can't handller this ( ${target} ) of type ( ${type} )`);
    return;
  }

  // 当前target作为key，是否存在于map中，存在就返回
  if (map.has(target)) {
    return map.get(target);
  }
  // 不存在就设置
  map.set(target, cloneTarget);

  // 使用效率更高的循环来代替 for in
  // 如果是对象，我们需要把它的key来作为数组
  let keys = type === arrayTag ? undefined : Object.keys(target);
  forEach(keys || target, (value, key) => {
    if (keys) {
      // 如果是对象类型，需要转换它的key
      key = value;
    }
    cloneTarget[key] = clone(target[key], map);
  });
  // for (const key in target) {
  //   // 递归调用，注意需要把map传入递归调用中
  //   cloneTarget[key] = clone(target[key], map);
  // }

  return cloneTarget;
}
