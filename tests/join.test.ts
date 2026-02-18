import { describe, test, expect } from "vitest";
import { join, JoinTypes } from "../src/join";

const left = { sample1: "One", sample2: "Two", sample3: "Three" };
const right = { sample2: "Dos", sample3: "Tres", sample4: "Quatro" };

describe("Basic join types", () => {
  test("join left — keeps only left-unique properties", () => {
    const c = join(JoinTypes.left)(left)(right);
    expect(c.sample1).toBe("One");
    expect(c.sample2).not.toBeDefined();
    expect(c.sample3).not.toBeDefined();
    expect(c.sample4).not.toBeDefined();
  });

  test("join right — keeps only right-unique properties", () => {
    const c = join(JoinTypes.right)(left)(right);
    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).not.toBeDefined();
    expect(c.sample3).not.toBeDefined();
    expect(c.sample4).toBe("Quatro");
  });

  test("join innerLeft — keeps shared properties with left values", () => {
    const c = join(JoinTypes.innerLeft)(left)(right);
    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).toBe("Two");
    expect(c.sample3).toBe("Three");
    expect(c.sample4).not.toBeDefined();
  });

  test("join innerRight — keeps shared properties with right values", () => {
    const c = join(JoinTypes.innerRight)(left)(right);
    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).not.toBeDefined();
  });

  test("join innerJoin — deep-merges shared properties", () => {
    const c = join(JoinTypes.innerJoin)({
      sample1: "One",
      sample2: "Two",
      sample3: { smile: "cheese" }
    })({ sample2: "Dos", sample3: { sorrir: "queijo" }, sample4: "Quatro" });
    expect((c as any).sample1).not.toBeDefined();
    expect(c.sample2).toBe("Dos");
    expect(c.sample3.smile).toBe("cheese");
    expect((c.sample3 as any).sorrir).toBe("queijo");
    expect((c as any).sample4).not.toBeDefined();
  });

  test("join leftJoin — left-unique + shared (deep-merged)", () => {
    const c = join(JoinTypes.leftJoin)(left)(right);
    expect(c.sample1).toBe("One");
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).not.toBeDefined();
  });

  test("join rightJoin — shared (deep-merged) + right-unique", () => {
    const c = join(JoinTypes.rightJoin)(left)(right);
    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).toBe("Quatro");
  });

  test("join fullJoin — all properties, shared ones deep-merged", () => {
    const c = join(JoinTypes.fullJoin)(left)(right);
    expect(c.sample1).toBe("One");
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).toBe("Quatro");
  });

  test("join expand — left-unique + right values for shared + right-unique", () => {
    const c = join(JoinTypes.expand)(left)(right);
    expect(c.sample1).toBe("One");
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).toBe("Quatro");
  });

  test("join() with no arguments uses expand by default", () => {
    const c = join()(left)(right);
    expect(c.sample1).toBe("One");
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).toBe("Quatro");
  });

  test("join left|right — removes shared, keeps outer", () => {
    const c = join(JoinTypes.left | JoinTypes.right)(left)(right);
    expect(c.sample1).toBe("One");
    expect(c.sample2).not.toBeDefined();
    expect(c.sample3).not.toBeDefined();
    expect(c.sample4).toBe("Quatro");
  });
});

describe("Immutability", () => {
  test("join does not mutate the context (left) object", () => {
    const ctx = { a: 1, b: 2 };
    join(JoinTypes.right)(ctx)({ b: 20, c: 3 });
    expect(ctx.a).toBe(1);
    expect(ctx.b).toBe(2);
    expect((ctx as any).c).not.toBeDefined();
  });

  test("join does not mutate the joinObject (right) object", () => {
    const obj = { b: 20, c: 3 };
    join(JoinTypes.left)({ a: 1, b: 2 })(obj);
    expect(obj.b).toBe(20);
    expect(obj.c).toBe(3);
  });
});

describe("Deep merge edge cases", () => {
  test("RegExp values are preserved, not deep-merged into {}", () => {
    const re = /hello/gi;
    const c = join(JoinTypes.innerJoin)({ pattern: /old/ })({ pattern: re });
    expect(c.pattern).toBe(re);
    expect(c.pattern instanceof RegExp).toBe(true);
  });

  test("null values in shared properties are assigned as-is", () => {
    const c = join(JoinTypes.innerJoin)({ x: { a: 1 } })({ x: null as any });
    expect((c as any).x).toBeNull();
  });

  test("arrays in shared properties are deep-merged", () => {
    const c = join(JoinTypes.innerJoin)({ data: { arr: [1, 2, 3] } })({
      data: { arr: [4, 5], extra: true }
    });
    expect((c as any).data.arr).toEqual([4, 5, 3]);
    expect((c as any).data.extra).toBe(true);
  });

  test("nested objects are deep-merged at multiple levels", () => {
    const c = join(JoinTypes.innerJoin)({ nested: { a: { x: 1 }, b: 2 } })({
      nested: { a: { y: 2 }, c: 3 }
    });
    expect((c as any).nested.a.x).toBe(1);
    expect((c as any).nested.a.y).toBe(2);
    expect((c as any).nested.b).toBe(2);
    expect((c as any).nested.c).toBe(3);
  });
});

describe("Edge cases", () => {
  test("empty objects produce empty result", () => {
    const c = join(JoinTypes.fullJoin)({})({});
    expect(Object.keys(c)).toHaveLength(0);
  });

  test("left object empty — result has only right-unique properties", () => {
    const c = join(JoinTypes.fullJoin)({})({ a: 1, b: 2 });
    expect((c as any).a).toBe(1);
    expect((c as any).b).toBe(2);
  });

  test("right object empty — result has only left-unique properties", () => {
    const c = join(JoinTypes.fullJoin)({ a: 1, b: 2 })({});
    expect((c as any).a).toBe(1);
    expect((c as any).b).toBe(2);
  });

  test("__proto__ pollution is prevented", () => {
    const malicious = JSON.parse('{"__proto__": {"polluted": true}}');
    join(JoinTypes.fullJoin)({ a: 1 })(malicious);
    expect((Object.prototype as any).polluted).not.toBeDefined();
  });

  test("invalid joinType throws an error", () => {
    expect(() => join(99 as JoinTypes)({ a: 1 })({ b: 2 })).toThrow();
  });
});
