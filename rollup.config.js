import commonjs from "@rollup/plugin-commonjs";
import {nodeResolve} from '@rollup/plugin-node-resolve';

const output = {
  dir: 'output',
  format: 'es'
};
const plugins = [
  commonjs({
    // non-CommonJS modules will be ignored, but you can also
    // specifically include/exclude files
    include: [ "./index.js", "node_modules/**" ], // Default: undefined

    // if true then uses of `global` won't be dealt with by this plugin
    ignoreGlobal: false, // Default: false

    // if false then skip sourceMap generation for CommonJS modules
    sourceMap: false // Default: true
  }),
  nodeResolve(),
];

export default [
  {
    input: 'src/react.js',
    output,
    plugins,
  },
  {
    input: 'src/react-all.js',
    output,
    plugins,
  },
  {
    input: 'src/react-dom.js',
    output,
    plugins,
  },
  {
    input: 'src/react-three-fiber.js',
    output,
    plugins,
  },
  {
    input: 'src/babel.js',
    output,
    plugins,
  },
];
