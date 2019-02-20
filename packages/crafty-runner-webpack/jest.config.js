module.exports = {
    resolver: require.resolve(`jest-pnp-resolver`),
    collectCoverageFrom: [
        "**/*.{js,jsx}",
        "!**/node_modules/**",
        "!**/vendor/**"
    ],
    testEnvironment: "node",
    verbose: true
};