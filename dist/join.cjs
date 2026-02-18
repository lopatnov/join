'use strict';

// Module-level constants for isPlainObject (computed once, not on every call)
const _toString = Object.prototype.toString;
const _getProto = Object.getPrototypeOf;
const _hasOwn = Object.prototype.hasOwnProperty;
const _fnToString = Function.prototype.toString;
const _ObjectFunctionString = _fnToString.call(Object);
/**
 * Join Types
 */
exports.JoinTypes = void 0;
(function (JoinTypes) {
    JoinTypes[JoinTypes["none"] = 0] = "none";
    JoinTypes[JoinTypes["left"] = 8] = "left";
    JoinTypes[JoinTypes["right"] = 1] = "right";
    JoinTypes[JoinTypes["innerLeft"] = 4] = "innerLeft";
    JoinTypes[JoinTypes["innerRight"] = 2] = "innerRight";
    JoinTypes[JoinTypes["innerJoin"] = 6] = "innerJoin";
    JoinTypes[JoinTypes["leftJoin"] = 14] = "leftJoin";
    JoinTypes[JoinTypes["rightJoin"] = 7] = "rightJoin";
    JoinTypes[JoinTypes["fullJoin"] = 15] = "fullJoin";
    JoinTypes[JoinTypes["expand"] = 11] = "expand";
})(exports.JoinTypes || (exports.JoinTypes = {}));
function getPartNames(left, right) {
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
function clearNames(obj, names) {
    for (let i = 0; i < names.length; i++) {
        delete obj[names[i]];
    }
}
function attach(toObj, attachment, names) {
    if (toObj === attachment)
        return;
    for (let i = 0; i < names.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(attachment, names[i]);
        Object.defineProperty(toObj, names[i], descriptor);
    }
}
function isFunction(obj) {
    // Support: Chrome <=57, Firefox <=52
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}
function isPlainObject(obj) {
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
function extend(...args) {
    const length = args.length;
    let options, name, src, copy, copyIsArray, clone, target = args[0] || {}, i = 1, deep = false;
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
                    }
                    else if (!copyIsArray && !isPlainObject(src)) {
                        clone = {};
                    }
                    else {
                        clone = src;
                    }
                    copyIsArray = false;
                    // Never move original objects, clone them
                    target[name] = extend(deep, clone, copy);
                    // Don't bring in undefined values
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
}
function mergeObjects(left, right, names) {
    if (left === right)
        return;
    for (let i = 0; i < names.length; i++) {
        if (right[names[i]] === null ||
            right[names[i]] instanceof RegExp ||
            ["string", "boolean", "undefined", "symbol", "number", "bigint"].indexOf(typeof right[names[i]]) > -1) {
            const descriptor = Object.getOwnPropertyDescriptor(right, names[i]);
            Object.defineProperty(left, names[i], descriptor);
        }
        else {
            left[names[i]] = extend(true, left[names[i]], right[names[i]]);
        }
    }
}
function joinSource(context, withObject, joinType = exports.JoinTypes.expand) {
    if ((joinType & -16) !== 0)
        throw new Error("Invalid join type. Please select join type");
    // Create a shallow clone to avoid mutating the original context object
    const target = Object.create(Object.getPrototypeOf(context), Object.getOwnPropertyDescriptors(context));
    if (joinType === (exports.JoinTypes.left | exports.JoinTypes.innerLeft)) {
        return target;
    }
    const names = getPartNames(target, withObject);
    //merge
    switch (joinType & exports.JoinTypes.innerJoin) {
        case exports.JoinTypes.none:
            clearNames(target, names.middle);
            break;
        case exports.JoinTypes.innerLeft:
            break;
        case exports.JoinTypes.innerRight:
            attach(target, withObject, names.middle);
            break;
        case exports.JoinTypes.innerJoin:
            mergeObjects(target, withObject, names.middle);
            break;
    }
    //left
    if ((joinType & exports.JoinTypes.left) !== exports.JoinTypes.left) {
        clearNames(target, names.left);
    }
    //right
    if ((joinType & exports.JoinTypes.right) === exports.JoinTypes.right) {
        attach(target, withObject, names.right);
    }
    return target;
}
function join(joinType = exports.JoinTypes.expand) {
    if (!joinType) {
        throw new Error("Unknown join type");
    }
    return function (context) {
        return function (joinObject) {
            return joinSource(context, joinObject, joinType);
        };
    };
}

exports.join = join;
//# sourceMappingURL=join.cjs.map
