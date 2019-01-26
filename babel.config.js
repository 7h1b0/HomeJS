module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.11',
        },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
  ],
};
