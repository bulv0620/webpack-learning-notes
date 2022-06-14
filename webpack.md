# webpack5

## 1、webpack初体验

全局安装webpack、webpack-cli

```shell
npm install webpack -g
npm install webpack -g
```

通过`webpack --version`命令查看是否安装成功以及安装的版本

创建`01_start_webpack`项目目录

在目录中新建`src`文件夹，`index.html`文件

在`src`文件夹中创建入口文件`index.js`，并编写一些内容

在终端运行`webpack`

就会输出一个`dist`文件夹，文件夹中的`main.js`就是经过打包压缩的js文件

在index.html引入`./dist/main.js`查看输出

## 2、webpack局部安装

创建`02_webpack_config`项目目录

全局的webpack打包并不推荐，因为不同电脑环境下的不同版本的webpack会导致很多问题

所以为了锁定版本，方便开发统一版本号，我们需要配置项目局部的webpack开发环境，终端运行：

```shell
npm init -y
npm install webpack -d
npm install webpack-cli -d
```

将上篇中的src文件夹以及index.html复制到当前项目目录下

在终端运行`npx webpack`，node会在项目的 `node_modules` 文件夹中找到webpack命令的引用执行打包

打包完成后如同上篇一样输出了dist目录

## 3、webpack配置体验

在之前，我们使用webpack进行打包，入口文件都是`./src/index.js`，输出目录都是`./dist`。

如果需要定制webpack的入口和输出位置，就需要进行一些配置

最简单的我们可以通过命令的方式：

- --entry：配置入口文件位置
- --output-path：输出位置

```shell
npx webpack --entry ./src/main.js --output-path ./build
```

当然这样的脚本非常长，也很麻烦，我们可以在`package.json`中对script进行一个配置：

```JSON
"scripts": {
    "build":  "webpack --entry ./src/main.js --output-path ./build"
},
```

当然这也不是最好的方式，因为我们现在只配置了入口和输出位置，如果后续需要很多很多的配置，光靠脚本上去添加配置选项是很繁琐的，我们可以在项目目录下创建`webpack.config.js`文件：

```js
const path = require('path')

module.exports = {
    // 要注意，这里的entry是可以使用项目的相对路径的
    // 而输出位置必须使用绝对路径
    // 引用node的path模块，解决问题
    entry: './src/index.js', // 入口文件位置
    output: {
        filename: 'build.js', // 输出文件名
        path: path.resolve(__dirname, 'dist') // 输出位置
    }
}
```

当添加了配置文件后，只需要执行`npx webpack`即可完成对应我们配置的打包

或者将`script`修改一下执行`npm run build`

```JSON
"scripts": {
    "build":  "webpack"
},
```

当然配置文件的名称我们也可以自定义，比如将文件改为test.config.js，只需要在命令后面添加`--config [文件位置]`即可

```JSON
"scripts": {
    "build":  "webpack --config test.config.js"
},
```

## 4、css相关的配置体验

当我们需要给页面添加样式的时候，需要编写一个css文件（或者less、sass）

而webpack默认不能够解析这些js之外的文件，所以需要加载器loader

### 4.1、css-lodaer

css-loader的作用是让webpack能够正常解析打包js中导入的css文件。

在终端中执行命令，安装css-loader：

```shell
npm install css-loader -d
```

css-loader使用方式：

1. 行内解析

   ```js
   // 在js文件import导入的时候，在文件前缀添加css-loader!
   import 'css-loader!../css/login.css';
   ```

2. 配置webpack解析规则

   在`webpack.config.js`导出的配置对象中，在之前使用到了`entry`和`output`，这次将会用到`module`

   `module`属性是一个对象，而配置解析规则就在`module`对象中的`rules`属性中

   ```js
   module.exports = {
       entry: './src/index.js',
       output: {
           filename: 'main.js',
           path: path.resolve(__dirname, 'dist')
       },
       module: {
           rules: [
               // 1、第一种方式，适用于使用多个loader但是不需要添加配置
               {
                   test: /\.css$/,
                   use: ['css-loader']
               },
               // 2、第二种方式，适用于只使用一个loader并且需要添加配置
               {
                   test: /\.css$/,
                   use: 'css-loader'
               },
               // 3、第三种方式，适用于使用多个loader并且需要添加配置
               {
                   test: /\.css$/,
                   use: [
                       {
                           loader: 'css-loader',
                           // options: ''
                       }
                   ]
               },
           ]
       }
   }
   ```

### 4.2、style-loader

配置`css-loader`可以让webpack可以正常打包css的内容，但是要使样式文件生效，还需要配置`style-loader`

安装`style-loader`：

```shell
npm install style-loader -d
```

在刚刚配置的`rules`数组中，匹配`css`文件对应的那个对象的`use`数组上添加上`style-loader`

```js
rules: [
	{
		test: /\.css$/,
		use: ['style-loader', 'css-loader']
	},
]
```

这里需要注意一个点，`use`数组中配置的`loader`执行顺序是从后往前或者从下往上，而在解析css的时候，我们需要先使用`css-loader`解析css文件，在通过`style-loader`使样式生效。

### 4.3、less-loader

通过less插件我们可以将less样式文件转译成css文件，less-loader就是解析less文件的加载器。

理论上只需要在css-loader之前，使用less-loader就行了

安装`less-loader`：

```shell
npm install less-loader -d
```

配置`rules`：

```js
rules: [
	{
		test: /\.less$/, // 这里需要匹配的就是less后缀的文件了
		use: ['style-loader', 'css-loader', 'less-loader']
	},
]
```

## 5、browserslistrc配置

目标浏览器配置

webpack很大的一个作用就是浏览器的适配打包，例如将es6编译为es5以实现不同浏览器的适配。而browserslistrc配置文件就是配置一些浏览器适配条件，在进行适配解析的时候，就会根据这些适配条件来获取到需要适配的目标浏览器列表，从而适配解析的loader插件可以因地制宜的进行解析适配。

1、在package.json中配置

```json
{
  "browserslist": [
    "last 1 version",
    "> 1%",
    "maintained node versions",
    "not dead"
  ]
}
```

2、也可在.browserslistrc中配置

```
# 注释是这样写的，以#号开头 
last 1 version # 最后的一个版本 
> 1% # 代表全球超过1%使用的浏览器 
maintained node versions # 所有还被 node 基金会维护的 node 版本 
not dead
```

> 对于部分配置参数做一些解释:
>  " >1%" :代表着全球超过1%人使用的浏览器
>  “last 2 versions” : 表示所有浏览器兼容到最后两个版本
>  “not ie <=8” :表示IE浏览器版本大于8（实则用npx browserslist 跑出来不包含IE9 ）
>  “safari >=7”:表示safari浏览器版本大于等于7
>  不配置默认为： **> 0.5%, last 2 versions, Firefox ESR, not dead**
>  在当前目录下查询目标浏览器 **npx browserslist**

**查询条件列表**
 你可以用如下查询条件来限定浏览器和 node 的版本范围（大小写不敏感）：

```
> 5%: 基于全球使用率统计而选择的浏览器版本范围。>=,<,<=同样适用。
> 5% in US : 同上，只是使用地区变为美国。支持两个字母的国家码来指定地区。
> 5% in alt-AS : 同上，只是使用地区变为亚洲所有国家。这里列举了所有的地区码。
> 5% in my stats : 使用定制的浏览器统计数据。
cover 99.5% : 使用率总和为99.5%的浏览器版本，前提是浏览器提供了使用覆盖率。
cover 99.5% in US : 同上，只是限制了地域，支持两个字母的国家码。
cover 99.5% in my stats :使用定制的浏览器统计数据。
maintained node versions :所有还被 node 基金会维护的 node 版本。
node 10 and node 10.4 : 最新的 node 10.x.x 或者10.4.x 版本。
current node :当前被 browserslist 使用的 node 版本。
extends browserslist-config-mycompany :来自browserslist-config-mycompany包的查询设置
ie 6-8 : 选择一个浏览器的版本范围。
Firefox > 20 : 版本高于20的所有火狐浏览器版本。>=,<,<=同样适用。
ios 7 :ios 7自带的浏览器。
Firefox ESR :最新的火狐 ESR（长期支持版） 版本的浏览器。
unreleased versions or unreleased Chrome versions : alpha 和 beta 版本。
last 2 major versions or last 2 ios major versions :最近的两个发行版，包括所有的次版本号和补丁版本号变更的浏览器版本。
since 2015 or last 2 years :自某个时间以来更新的版本（也可以写的更具体since 2015-03或者since 2015-03-10）
dead :通过last 2 versions筛选的浏览器版本中，全球使用率低于0.5%并且官方声明不在维护或者事实上已经两年没有再更新的版本。目前符合条件的有 IE10,IE_Mob 10,BlackBerry 10,BlackBerry 7,OperaMobile 12.1。
last 2 versions :每个浏览器最近的两个版本。
last 2 Chrome versions :chrome 浏览器最近的两个版本。
defaults :默认配置> 0.5%, last 2 versions, Firefox ESR, not dead。
not ie <= 8 : 浏览器范围的取反。
#可以添加not在任和查询条件前面，表示取反
```

## 6、postcss

`postcss`用于解析css文件内容，实现目标浏览器的适配支持。

`postcss`需要使用到`postcss-cli`才可以在终端使用`npx postcss`的命令，并且`postcss`本身不能解析css，解析css还需要用到插件，例如`autoprefixer`插件可以将css前缀名转化为目标浏览器适配的形式。

安装postcss、postcss-cli、autoprefixer：

```shell
npm install postcss -d
npm install postcss-cli -d
npm install autoprefixer -d
```

在终端执行命令：

```shell
npx postcss --use autoprefixer -o ret.css ./src/css/test.css
```

在上面这条命令中，`--use`后配置的是插件，`-o`后配置的是输出的css文件，最后再加上输入的css文件。

执行完成后，查看ret.css中如果需要适配的前缀名已经进行了适配的转译。

## 7、postcss-loader

我们手动使用`npx postcss`命令解析css文件的方法在开发中非常的低效，类似于less-loader，postcss也有相应的postcss-loader可以在配置完成后，加载打包时，自动转译。

安装postcss-loader：

```shell
npm install postcss-loader -d
```

分析css解析执行的顺序，一开始的css文件需要经过postcss解析成浏览器适配，然后通过css-loader解析做过浏览器适配转译的css文件，最后通过style-loader实现样式的生效。

所以在`webpack.config.js`中的配置如下：

```js
const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
}
```

在上面的配置代码中，可以看到，postcss-loader并不能直接实现对css的转译，需要在`options`中配置插件，例如这里的`autoprefixer`。

在这样的配置中发现，`options`中添加`postcssOptions`，再添加`plugins`，`plugins`数组中再添加插件的名称或`require([插件名])`。这样会导致`webpack.config.js`非常的臃肿，所以可以将postcss的配置独立开来：

在项目中创建`postcss.config.js` 

然后在webpack.config.js中的配置就只需要加载器的名字：

```js
{
	test: /\.css$/,
	use: ['style-loader', 'css-loader', 'postcss-loader']
},
```

上面我们只使用了`autoprefixer`插件解析前缀，如果需要解析其他内容，例如：`#12345678`第7、8位置的透明度设置不是所有浏览器适配的，如果需要适配，就要解析成通用rgba的形式。那么我们需要配置很多的插件，来实现预解析。

所有可以使用`postcss-preset-env`插件，该插件包含了很多常规的`postcss`会使用到的解析插件，只需要配置一个就可以实现了各种解析非常方便。

分析解析less文件的流程：需要先使用`less-loader`将less文件解析为css文件，再通过`postcss-loader`实现目标浏览器适配解析，然后再使用`css-loader`和`style-loader`来实现css样式的生效。

所以use的插件列表：

```js
use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
```



