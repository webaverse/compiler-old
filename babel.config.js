module.exports = {
  "plugins": [
    ["module-resolver", {
      "root": ["./src"]
    }]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'last 1 chrome version',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}
