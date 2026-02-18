// Module-level constants for isPlainObject (computed once, not on every call)
const _toString = Object.prototype.toString;
const _getProto = Object.getPrototypeOf;
const _hasOwn = Object.prototype.hasOwnProperty;
const _fnToString = Function.prototype.toString;
const _ObjectFunctionString = _fnToString.call(Object);

/**
 * Join Types
 */
export enum JoinTypes {
  none = 0b0000,
  left = 0b1000,
  right = 0b0001,
  innerLeft = 0b0100,
  innerRight = 0b0010,
  innerJoin = none | innerLeft | innerRight | none,
  leftJoin = left | innerLeft | innerRight | none,
  rightJoin = none | innerLeft | innerRight | right,
  fullJoin = left | innerLeft | innerRight | right,
  expand = left | none | innerRight | right
}

function getPartNames(left: any, right: any) {
  let namesLeft = Object.getOwnPropertyNames(left);
  let namesRight = Object.getOwnPropertyNames(right);
  const rightSet = new Set(namesRight);
  const namesMid = namesLeft.filter((x) => rightSet.has(x));
  const midSet = new Set(namesMid);
  namesLeft = namesLeft.filter((x) => !midSet.has(x));
  namesRight = namesRight.filter((x) => !midSet.has(x));
  return {
    left: namesLeft,
    middle: namesMid,
    right: namesRight
  };
}

function clearNames(obj: any, names: string[]) {
  for (let i = 0; i < names.length; i++) {
    delete obj[names[i]];
  }
}

function attach(toObj: any, attachment: any, names: string[]) {
  if (toObj === attachment) return;

  for (let i = 0; i < names.length; i++) {
    const descriptor = Object.getOwnPropertyDescriptor(attachment, names[i]);
    Object.defineProperty(toObj, names[i], descriptor as PropertyDescriptor);
  }
}

function isFunction(obj: any) {
  // Support: Chrome <=57, Firefox <=52
  // In some browsers, typeof returns "function" for HTML <object> elements
  // (i.e., `typeof document.createElement( "object" ) === "function"`).
  // We don't want to classify *any* DOM node as a function.
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}

function isPlainObject(obj: any) {
  // Detect obvious negatives
  // Use toString instead of type to catch host objects
  if (!obj || _toString.call(obj) !== "[object Object]") {
    return false;
  }

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  const proto = _getProto(obj);
  if (!proto) {
    return true;
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  const Ctor = _hasOwn.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && _fnToString.call(Ctor) === _ObjectFunctionString;
}

function extend(...args: any[]) {
  const length = args.length;
  let options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = args[0] || {},
    i = 1,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = args[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // Extend itself if only one argument is passed
  if (i === length) {
    target = {};
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = args[i]) != null) {
      // Extend the base object
      for (name in options) {
        copy = options[name];

        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if (name === "__proto__" || target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          src = target[name];

          // Ensure proper type for the source value
          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
}

function mergeObjects(left: any, right: any, names: string[]) {
  if (left === right) return;
  for (let i = 0; i < names.length; i++) {
    if (
      right[names[i]] === null ||
      right[names[i]] instanceof RegExp ||
      ["string", "boolean", "undefined", "symbol", "number", "bigint"].indexOf(
        typeof right[names[i]]
      ) > -1
    ) {
      const descriptor = Object.getOwnPropertyDescriptor(right, names[i]);
      Object.defineProperty(left, names[i], descriptor as PropertyDescriptor);
    } else {
      left[names[i]] = extend(true, left[names[i]], right[names[i]]);
    }
  }
}

function joinSource<TContext, TJoinObject>(
  context: TContext,
  withObject: TJoinObject,
  joinType: JoinTypes = JoinTypes.expand
): TContext & TJoinObject {
  if ((joinType & ~0b1111) !== 0) throw new Error("Invalid join type. Please select join type");

  // Create a shallow clone to avoid mutating the original context object
  const target = Object.create(
    Object.getPrototypeOf(context as object),
    Object.getOwnPropertyDescriptors(context as object)
  ) as TContext;

  if (joinType === (JoinTypes.left | JoinTypes.innerLeft)) {
    return target as TContext & TJoinObject;
  }

  const names = getPartNames(target, withObject);

  //merge
  switch (joinType & JoinTypes.innerJoin) {
    case JoinTypes.none:
      clearNames(target, names.middle);
      break;
    case JoinTypes.innerLeft:
      break;
    case JoinTypes.innerRight:
      attach(target, withObject, names.middle);
      break;
    case JoinTypes.innerJoin:
      mergeObjects(target, withObject, names.middle);
      break;
  }

  //left
  if ((joinType & JoinTypes.left) !== JoinTypes.left) {
    clearNames(target, names.left);
  }

  //right
  if ((joinType & JoinTypes.right) === JoinTypes.right) {
    attach(target, withObject, names.right);
  }

  return target as TContext & TJoinObject;
}

export function join(joinType: JoinTypes = JoinTypes.expand) {
  if (!joinType) {
    throw new Error("Unknown join type");
  }
  return function <TContext>(context: TContext) {
    return function <TJoinObject>(joinObject: TJoinObject): TContext & TJoinObject {
      return joinSource(context, joinObject, joinType);
    };
  };
}
