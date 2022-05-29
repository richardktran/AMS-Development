const mix = require('laravel-mix')
require('laravel-mix-eslint')

mix.webpackConfig({
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                math: { 'parens-division': true },
                modifyVars: {
                  'primary-color': '#CF2338',
                  'link-color': '#CF2338',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
        // ...other rules
      },
    ],
  },
})

/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel applications. By default, we are compiling the CSS
| file for the application as well as bundling up all the JS files.
|
*/

mix.sass('resources/css/app.scss', 'public/css')
mix
  .js('resources/js/app.jsx', 'public/js')
  .react()
  .extract(['react'])
  .eslint({
    fix: true,
    extensions: ['js', 'jsx'],
    exclude: 'node_modules/',
  })
  .sourceMaps()

if (mix.inProduction()) {
  mix.version()
}
