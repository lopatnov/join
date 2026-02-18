import { join, JoinTypes } from "../src/join";

describe("Simple tests", () => {
  test("join left", () => {
    const c = join(JoinTypes.left)({
      sample1: "One",
      sample2: "Two",
      sample3: "Three"
    })({
      sample2: "Dos",
      sample3: "Tres",
      sample4: "Quatro"
    });

    expect(c.sample1).toBe("One");
    expect(c.sample2).not.toBeDefined();
    expect(c.sample3).not.toBeDefined();
    expect(c.sample4).not.toBeDefined();
  });

  test("join right", () => {
    const rightJoin = join(JoinTypes.right);
    const joinObject = rightJoin({
      sample1: "One",
      sample2: "Two",
      sample3: "Three"
    });
    const m = joinObject({
      sample2: "Dos",
      sample3: "Tres",
      sample4: "Quatro"
    });

    expect(m.sample1).not.toBeDefined();
    expect(m.sample2).not.toBeDefined();
    expect(m.sample3).not.toBeDefined();
    expect(m.sample4).toBe("Quatro");
  });

  test("join middle none", () => {
    const joinBy = join(JoinTypes.left | JoinTypes.right)({
      sample1: "One",
      sample2: "Two",
      sample3: "Three"
    });
    const c = joinBy({
      sample2: "Dos",
      sample3: "Tres",
      sample4: "Quatro"
    });

    expect(c.sample1).toBe("One");
    expect(c.sample2).not.toBeDefined();
    expect(c.sample3).not.toBeDefined();
    expect(c.sample4).toBe("Quatro");
  });

  test("join middle left", () => {
    const c = join(JoinTypes.innerLeft)({
      sample1: "One",
      sample2: "Two",
      sample3: "Three"
    })({
      sample2: "Dos",
      sample3: "Tres",
      sample4: "Quatro"
    });

    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).toBe("Two");
    expect(c.sample3).toBe("Three");
    expect(c.sample4).not.toBeDefined();
  });

  test("join middle right", () => {
    const c = join(JoinTypes.innerRight)({
      sample1: "One",
      sample2: "Two",
      sample3: "Three"
    })({
      sample2: "Dos",
      sample3: "Tres",
      sample4: "Quatro"
    });

    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).toBe("Dos");
    expect(c.sample3).toBe("Tres");
    expect(c.sample4).not.toBeDefined();
  });

  test("join middle merge", () => {
    const c = join(JoinTypes.innerJoin)({
      sample1: "One",
      sample2: "Two",
      sample3: {
        smile: "cheese"
      }
    })({
      sample2: "Dos",
      sample3: {
        sorrir: "queijo"
      },
      sample4: "Quatro"
    });

    expect(c.sample1).not.toBeDefined();
    expect(c.sample2).toBe("Dos");
    expect(c.sample3.smile).toBe("cheese");
    expect(c.sample3.sorrir).toBe("queijo");
    expect(c.sample4).not.toBeDefined();
  });
});
