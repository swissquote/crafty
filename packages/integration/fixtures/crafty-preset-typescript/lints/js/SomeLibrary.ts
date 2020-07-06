
export interface RandomInterface {
  someType: {
    someSubType: number;
  }
}

export default class SomeLibrary {
    add(a: number, b): RandomInterface["someType"]["someSubType"] {
        return a + b;
    }

    substract(a, b) {
  return a - b;
    }

    divide(a, b)
    {
        return a / b;
      }
}
