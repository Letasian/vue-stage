const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCssPlugin = require('purifycss-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: ['./src/index.js'], //绝对路径
    devServer: {
        // npm install webpack-dev-server -D   保存热更新

        hot: true,
        open: true,
        port: 8888,
        contentBase: '../dist'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            // npm install vue-loader vue-template-compiler cache-loader thread-loader -D
            // npm install vue -S

            // vue-loader 作用解析.vue文件
            // vue-template-compiler 作用编译模板
            // cache-loader 作用缓存loader编译的结果
            // thread-loader 作用使用 worker 池来运行loader，每个 worker 都是一个 node.js 进程
            // vue 一个用于构建用户界面渐进式的MVVM框架
            {
                test: /\.vue$/,
                use: [{
                        loader: 'cache-loader'
                    },
                    {
                        loader: 'thread-loader'
                    },
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            }
                        }
                    }
                ]
            },
            {
                //npm install babel-loader @babel/core @babel/preset-env -D    

                //babel-loader是将ES6等高级语法转换为能让浏览器能够解析的低级语法，新的api需要使用babel-polyfill转换
                //@babel/core是babel的核心模块，编译器。提供转换的API
                //@babel/preset-env 可以根据配置的目标浏览器或者运行环境来自动将ES2015+的代码转换为es5

                // npm install @babel/polyfill -S    

                // babel-polyfill是解决babel-loader不能对新的api进行转换为当前环境添加一个垫片        
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        // npm install @babel/runtime @babel/plugin-transform-runtime -D

                        // @babel/runtime就是提供统一的模块化的helper, 使用能大大减少打包编译后的体积
                        // @babel/plugin-transform-runtime它会帮我自动动态require @babel/runtime中的内容
                        // 注意：还有一些常见的babel:
                        // @babel/plugin-proposal-decorators将es6+中更高级的特性转化---装饰器
                        // @babel/plugin-proposal-class-properties将es6中更高级的API进行转化---类

                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }], //将es6中更高级的特性转化，装饰器
                            ["@babel/plugin-proposal-class-properties", { "loose": true }], //将es6中更高级的API进行转化，类
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                }
            },
            {
                // npm install stylus stylus-loader less less-loader sass-loader node-sass(window上缺少环境会报错) css-loader style-loader -D

                // css-loader主要的作用是解析css文件, 像@import等动态语法
                // style-loader主要的作用是解析的css文件渲染到html的style标签内
                // stylus、less、sass是CSS的常见预处理器
                // stylus-loader、less-loader、sass-loader主要是将其对应的语法转换成css语法

                test: /\.less$/,
                use: [
                    // npm install mini-css-extract-plugin -D
                    // // or 或
                    // npm install extract-text-webpack-plugin@next -D // 不推荐使用
                    // npm install optimize-css-assets-webpack-plugin -D
                    // npm install uglifyjs-webpack-plugin -D
                    // // 扩展 消除未使用的css
                    // npm install purify-webpack purify-css -D

                    process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        // npm install postcss-loader autoprefixer -D

                        // postcss-loader autoprefixer 处理浏览器兼容,自动为CSS3的某些属性添加前缀

                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            //npm install file-loader url-loader -D

            // file-loader可以用来帮助webpack打包处理一系列的图片文件；比如：.png 、 .jpg 、.jepg等格式的图片。打包的图片会给每张图片都生成一个随机的hash值作为图片的名字
            // url-loader封装了file-loader,它的工作原理：1.文件大小小于limit参数，url-loader将会把文件转为Base64；2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader

            {
                test: /\.(jpg|png|jpeg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },

        ]
    },
    plugins: [
        //npm install html-webpack-plugin -D

        //html-webpack-plugin主要有两个作用: 1、为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题。2、可以生成创建html入口文件

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html')
        }),
        //npm install clean-webpack-plugin -D

        //clean-webpack-plugin是删除webpack打包后的文件夹以及文件
        new CleanWebpackPlugin('dist/*.*')
    ]
}