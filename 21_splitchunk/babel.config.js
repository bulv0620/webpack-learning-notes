const presets = [
    [
        '@babel/preset-env',
        {
            useBuiltIns: 'usage',
            corejs: 3,
        }
    ],
    '@babel/preset-typescript',
]

const plugins = []

if (process.env.NODE_ENV === 'production') {
    plugins.push('@babel/plugin-transform-runtime')
}

module.exports = {
    presets,
    plugins,
}