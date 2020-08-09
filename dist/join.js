(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.join = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Join Types
   */
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
      var namesLeft = Object.getOwnPropertyNames(left);
      var namesRight = Object.getOwnPropertyNames(right);
      var namesMid = namesLeft.filter(function (x) { return namesRight.indexOf(x) > -1; });
      namesLeft = namesLeft.filter(function (x) { return namesMid.indexOf(x) < 0; });
      namesRight = namesRight.filter(function (x) { return namesMid.indexOf(x) < 0; });
      return {
          left: namesLeft,
          middle: namesMid,
          right: namesRight
      };
  }
  function clearNames(obj, names) {
      for (var i = 0; i < names.length; i++) {
          delete obj[names[i]];
      }
  }
  function attach(toObj, attachment, names) {
      if (toObj === attachment)
          return;
      for (var i = 0; i < names.length; i++) {
          var descriptor = Object.getOwnPropertyDescriptor(attachment, names[i]);
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
      var proto, Ctor;
      var toString = Object.prototype.toString;
      var getProto = Object.getPrototypeOf;
      var hasOwn = Object.prototype.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      // Detect obvious negatives
      // Use toString instead of type to catch host objects
      if (!obj || toString.call(obj) !== "[object Object]") {
          return false;
      }
      proto = getProto(obj);
      // Objects with no prototype (e.g., `Object.create( null )`) are plain
      if (!proto) {
          return true;
      }
      // Objects with prototype are plain iff they were constructed by a global Object function
      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return (typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString);
  }
  function extend() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
      // Handle a deep copy situation
      if (typeof target === "boolean") {
          deep = target;
          // Skip the boolean and the target
          target = arguments[i] || {};
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
          if ((options = arguments[i]) != null) {
              // Extend the base object
              for (name in options) {
                  copy = options[name];
                  // Prevent Object.prototype pollution
                  // Prevent never-ending loop
                  if (name === "__proto__" || target === copy) {
                      continue;
                  }
                  // Recurse if we're merging plain objects or arrays
                  if (deep &&
                      copy &&
                      (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
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
      for (var i = 0; i < names.length; i++) {
          if (right[names[i]] === null ||
              [
                  "string",
                  "boolean",
                  "null",
                  "undefined",
                  "symbol",
                  "number",
                  "bigint",
                  "regexp"
              ].indexOf((typeof right[names[i]]).toLowerCase()) > -1) {
              var descriptor = Object.getOwnPropertyDescriptor(right, names[i]);
              Object.defineProperty(left, names[i], descriptor);
          }
          else {
              left[names[i]] = extend(true, left[names[i]], right[names[i]]);
          }
      }
  }
  function joinSource(withObject, joinType) {
      if (joinType === void 0) { joinType = exports.JoinTypes.expand; }
      if ((joinType | 15) <= 0)
          throw new Error("Invalid join type. Please select join type");
      if (joinType === (exports.JoinTypes.left | exports.JoinTypes.innerLeft)) {
          return this;
      }
      var names = getPartNames(this, withObject);
      //merge
      switch (joinType & exports.JoinTypes.innerJoin) {
          case exports.JoinTypes.none:
              clearNames(this, names.middle);
              break;
          case exports.JoinTypes.innerLeft:
              break;
          case exports.JoinTypes.innerRight:
              attach(this, withObject, names.middle);
              break;
          case exports.JoinTypes.innerJoin:
              mergeObjects(this, withObject, names.middle);
              break;
      }
      //left
      if ((joinType & exports.JoinTypes.left) !== exports.JoinTypes.left) {
          clearNames(this, names.left);
      }
      //right
      if ((joinType & exports.JoinTypes.right) === exports.JoinTypes.right) {
          attach(this, withObject, names.right);
      }
      return this;
  }
  function join(joinType) {
      if (joinType === void 0) { joinType = exports.JoinTypes.expand; }
      if (!joinType) {
          throw new Error('Unknown join type');
      }
      return function (context) {
          return function (joinObject) {
              return joinSource.call(context, joinObject, joinType);
          };
      };
  }

  exports.join = join;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=join.js.map
