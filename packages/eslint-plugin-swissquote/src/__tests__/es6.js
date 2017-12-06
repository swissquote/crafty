/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(require("../es6"));

it("Works fine with ES6 code", () => {
  const result = lint(
    engine,
    `
class SkinnedMesh extends THREE.Mesh {
  constructor(geometry, materials) {
    super(geometry, materials);

    this.idMatrix = SkinnedMesh.defaultMatrix();
    this.bones = [];
    this.boneMatrices = [];
    //...
  }
  update(camera) {
    //...
    super.update();
  }
  get boneCount() {
    return this.bones.length;
  }
  set matrixType(matrixType) {
    this.idMatrix = SkinnedMesh[matrixType]();
  }
  static defaultMatrix() {
    return new THREE.Matrix4();
  }
}

const { op: a, lhs: { op: b }, rhs: c } = getASTNode();

const someString = \`In JavaScript this is
    not legal.\`;

const obj = {
    // __proto__
    __proto__: theProtoObj,
    // Shorthand for ‘someString: someString’
    someString,
    // Methods
    toString() {
     // Super calls
     return \`d \${  super.toString()}\`;
    },
    // Computed (dynamic) property names
    [ \`prop_\${  (() => 42)()}\` ]: 42
};

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(0);
});
