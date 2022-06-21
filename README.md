# webpack5入门学习

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

[Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/)

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

```js
module.exports =  {
    plugins: ['postcss-preset-env'],
}
```

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



## 8、importLoaders

在css中，可以使用`@import`操作符来导入其他css文件的样式内容，这个import操作符是可以被`css-loader`解析的，但是需要注意的是，分析一下这个`import`执行的过程：

- 使用`postcss-loader`进行了适配转译，而`postcss-loader`并不会去处理`import`的内容
- 然后`css-loader`解析`import`导入了其他css文件的样式内容

导入的css样式其实并没有进行过`postcss-loader`的转译适配，所以需要让`css-loader`在处理`import`的内容时，进行一下`postcss-loader`的转译适配。在`module`中进行配置：

```js
module: {
	rules: [
		{
			test: /\.css$/,
			use: [
				'style-loader', 
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1
					}
				}, 
				'postcss-loader'
			]
		}
	]
}
```

在`css-loader`配置项的`options`中配置`importLoaders: 1`就可以将`import`的文件先进行上一级的解析。

## 9、file-loader

如果在页面中引入了图片，那么webpack也是不能直接解析的，需要配置解析图片的加载器，这里可以使用`file-loader`加载器。`file-loader`加载器会将图片打包到输出目录下，然后将原位置替换为相应的路径解析实现图片的加载。

安装file-loader：

```shell
npm install file-loader -d
```

webpack.config.js中配置：

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	use: [{
		loader: 'file-loader',
		options: {
			esModule: false
		}
	}]
}
```

注意这里的`options`中，配置了`esModule: false`。这是因为如果我们不配置该选项，在js中导入图片文件，会被默认解析为es模块，也就是一个对象，而不是对应的文件路径，该模块的`default`属性才是对应的文件路径。配置了该项之后，就会解析为一个路径，直接可以使用。例如：

```js
const oImg = document.createElement('img')
// 如果没有配置esModule: false
oImg.src = require('../img/logo.png').default
// 配置了esModule: false
oImg.src = require('../img/logo.png')
```

当然我们也可以使用`import`的方式，就不用考虑`esModule`的配置

```js
import img from '../img/logo.png'

const oImg = document.createElement('img')
oImg.src = img
```

如果在css文件中使用了`url()`的方式，`css-loader`是会解析图片文件的，但是同样存在之前的问题，就是解析默认的是es模块对象，而在css中不能使用`.default`来访问对象的属性，所以需要在`css-loader`中配置`options`，将`esModule`配置为`false`。

```js
{
    test: /\.css$/,
	use: [
		'style-loader', 
		{
			loader: 'css-loader',
			options: {
				importLoaders: 1,
				esModule: false
			}
		}, 
		'postcss-loader'
	]
}
```

在上面使用`file-loader`解析图片文件后，可以发现输出目录中多出了一些hash值编码作为文件名的图片文件。这就是`file-loader`加载器打包后的图片文件，我们可以配置打包后的文件设置输出的目录以及输出的名称：

**输出的名称**

可以给`file-loader`的`options`中添加`name`属性配置输出的文件名，`name`属性可以使用占位符的方式配置：

- `[ext]`：扩展名
- `[name]`：文件名
- `[hash]`：文件内容
- `[contentHash]`：类似hash
- `[hash:<length>]`：可以限制hash的长度

例如：

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	use: [{
		loader: 'file-loader',
		options: {
			esModule: false,
			name: '[name].[hash:6].[ext]'
		}
	}]
}
```

**输出的位置**

可以给`file-loader`的`options`中添加`outputPath`属性配置输出的位置：

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	use: [{
		loader: 'file-loader',
		options: {
			esModule: false,
			name: '[name].[hash:6].[ext]',
			outputPath: 'img'
		}
	}]
}
```

当然可以简化这个过程，直接在`name`前添加`img/`就可以实现输出文件位置的配置：

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	use: [{
		loader: 'file-loader',
		options: {
			esModule: false,
			name: 'img/[name].[hash:6].[ext]'
		}
	}]
}
```



## 10、url-loader

url-loader也可以被用来解析图片文件，与file-loader不同的地方是，url-loader默认将图片解析为base64 uri的二进制形式直接放在js代码中。

直接放在js中的好处是，可以减少请求的次数，但是当很大的图片文件在main.js文件中会导致首次的请求加载非常的慢。

当然进行一些配置后，可以允许某些小于指定大小的文件解析为base64的形式，而大于指定大小的同file-loader一样打包生成文件输出。这样就可以很好的平衡优缺点。

安装url-loader：

```shell
npm install url-loader -d
```

配置url-loader：

url-loader如果不添加options配置项，就会默认把所有的图片文件都解析为base64的形式，可以在options中配置limit来实现小于指定大小的解析为base64，大于指定大小的打包输出图片文件。

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	use: [{
		loader: 'url-loader',
		options: {
			esModule: false,
			name: 'img/[name].[hash:6].[ext]',
			limit: 100 * 1024
		}
	}]
}
```

## 11、asset

webpack5可以使用 **资源模块类型**（assetmodule type），替代file-loader等

> 资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：
>
> - `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
> - `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
> - `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现。
> - `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。
>
> 👆来自webpack官方文档

asset是webpack5中自带的，不需要额外安装。

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	type: '[ asset/resource`  | asset/inline | asset/soutce | asset ]'
}
```

当然asset也可以配置输出的文件名和位置

可以在`webpack.config.js`的配置对象中的`output`中，添加`assetModuleFilename`，文件名的配置方式同之前的`file-loader`和`url-loader`类似，只是需要注意，在asset中`[ext]`已经包含了点号`.`。

```js
module.exports = {
    output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'img/[name].[hash:8][ext]'
	},
}
```

或者我们可以在module.rules列表中定位到图片解析那块，然后添加generator属性，在generator属性中配置filename。

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	type: 'asset/resource',
	generator: {
		filename: 'img/[name].[hash:8][ext]',
	}
}
```

上面都展示的是`asset/resource`，类似于`file-loader`，会将图片文件打包输出，如果要实现`url-loader`那样通过限制大小在打包输出文件和解析为uri中自动选择，可以直接使用`asset`然后添加一个`parser`配置限制大小：

```js
{
	test: /\.(jpe?g|png|gif|svg)$/,
	type: 'asset',
	generator: {
		filename: 'img/[name].[hash:8][ext]',
	},
	parser: {
		dataUrlCondition: {
			maxSize: 100 * 1024
		}
	}
}
```

`asset/resource`也可以用于解析font资源。配置方式类似：

```js
{
	test: /\.(ttf|woff2?)$/,
	type: 'asset/resource',
	generator: {
		filename: 'font/[name].[hash:8][ext]'
	}
}
```

## 12、webpack插件简介

> `plugins` 选项用于以各种方式自定义 webpack 构建过程。webpack 附带了各种内置插件，可以通过 `webpack.[plugin-name]` 访问这些插件。请查看插件页面获取插件列表和对应文档，但请注意这只是其中一部分，社区中还有许多插件。
>
> 👆来自webpack官网文档

## 13、clean-webpack-plugin

每次通过webpack进行打包，都需要将之前输出的文件夹删除，非常麻烦，就可以使用`clean-webpack-plugin`来实现自动删除之前的打包文件。

安装`clean-webpack-plugin`：

```shell
npm install clean-webpack-plugin -d
```

在`webpack.config.js`导出的配置对象的`plugins`属性中配置`clean-webpack-plugin`：

```js
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```



## 14、html-webpack-plugin

之前的使用中都是自己创建html文件，导入webpack打包的main.js。

通过`html-webpack-plugin`插件就可以实现根据配置的ejs模板自动打包输出一个`index.html`。

安装`html-webpack-plugin`：

```shell
npm install html-webpack-plugin -d
```

在`webpack.config.js`中配置`html-webpack-plugin`：

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```

上面的状态下打包会默认生成该插件内部指定模板的html：

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Webpack App</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <script defer="defer" src="main.js"></script>
</head>

<body></body>

</html>

```

当然我们可以进行一些配置，实现指定的输出模板和输出内容：

在项目中创建public目录，在public目录中存放的就是一些静态资源。可以在public目录下创建一个index.html作为模板，使用ejs模板语法来实现内容的展示。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>

<body>
    <div id="app">learning-webpack</div>
</body>

</html>
```

plugin中需要进行配置：

```js
new HtmlWebpackPlugin({
	title: 'learning-webpack',
	template: './public/index.html'
}),
```

注意前面的模板html中有用到`<%= BASE_URL %>`

这个常量的传递需要用到webpack中的`DefinePlugin`：

```js
const path = require('path')
const {DefinePlugin} = require('webpack')

module.exports = {
    plugins: [
        new DefinePlugin({
            BASE_URL: "'./'"
            // 这里传递过去的是引号内的值，而不是字符串，所以我们需要自己加上一层引号作为字符串
        })
    ]
}
```



## 15、babel

babel用来实现编译解析js实现向下版本兼容。例如箭头函数、`const`、`let`之类的es6+语法并不是所有浏览器都适配的，通过babel的转译就可以实现开发使用新特性不影响浏览器的适配。

安装babel，如果需要能在命令行中执行`npx babel`需要安装`@babel/core`和`@babel/cli`：

```shell
npm install @babel/core @babel/cli -d
```

使用babel，在项目中创建一个需要转译的js程序：

```js
const foo = () => {
    console.log('foo')
};

const baz = 'baz';
```

该段程序中使用了es6的块级作用域语法以及箭头函数。

在命令行终端中使用`npx babel [目标文件位置] --out-dir [输出位置]`

执行完成后，发现并没有任何的转译变化，依然是块作用域语法以及箭头函数。因为babel跟postcss一样，如果需要对代码进行转译，还需要相应的插件才能够实现。例如：

- `plugin-transform-arrow-functions`：转译箭头函数的插件
- `plugin-transform-block-scoping`：转译块作用域语法的插件

安装插件：

```shell
npm install @babel/plugin-transform-arrow-functions -d
npm install @babel/plugin-transform-block-scoping -d
```

使用插件：

```shell
npx babel src --out-dir build --plugins=@babel/plugin-transform-arrow-function,@babel/plugin-transform-block-scoping
```

使用插件后输出的js代码已经进行了相应的转译：

```js
var foo = function () {
  console.log('foo');
};

var baz = 'baz';
```

当然每一种转译操作都需要添加相应的插件，这个过程过于繁琐，所以类似于postcss，babel也有一种预设的编译环境。

安装预设：

```shell
npm install @babel/preset-env -d
```

使用预设：

```shell
npx babel src --out-dir build --presets=@babel/preset-env
```

使用预设环境编译输出的js文件：

```js
"use strict";

var foo = function foo() {
  console.log('foo');
};

var baz = 'baz';
```



## 16、babel-loader

`babel-loader`就是webpack中利用babel加载解析js文件的加载器。

安装`babel-loader`：

```shell
npm install babel-loader -d
```

在`webpack.config.js`中配置`babel-loader`：

```js
{
	test: /\.js$/,
	use: ['babel-loader'],
}
```

当然直接这样配置后打包是没有效果的，我们需要配置解析的插件：

```js
{
	test: /\.js$/,
	use: [
		{
			loader: 'babel-loader',
			options: {
				plugins: [
					'@babel/plugin-transform-arrow-functions',
					'@babel/plugin-transform-block-scoping'
				]
			}
		}
	],
}
```

或者也可以直接配置解析预设：

```js
{
	test: /\.js$/,
	use: [
		{
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env'],
			}
		}
	],
}
```

直接在`webpack.config.js`中配置如果比较繁琐，还可以单独配置一个`babel.config.js`，在项目中创建一个`babel.config.js`：

```js
module.exports = {
	presets: ['@babel/preset-env']
}
```

有了`babel.config.js`后，`webpack.config.js`中就可以简化：

```js
{
	test: /\.js$/,
	use: ['babel-loader'],
}
```



## 17、@babel/polyfill

为什么需要`polyfill`？

使用`@babel/preset-env`并不能将所有语法都进行适配转译，例如es6+中的`Promise`、`WeakMap`之类的，而polyfill就是将这些不能转译并且会出现适配问题的语法，进行一个定义，使其能够正常的运行。例如将Promise实现一下。

在webpack5之前，默认会将`polyfill`内容全部打包进来，但是这就导致了打包体积扩大，速度变慢。webpack5为了加快打包速度，减小打包体积，这些内容需要我们按需配置。

在以往的babel版本中，我们可以直接使用`@babel/polyfill`，但是在babel7以后，官方文档中提示直接使用：`core-js`

> 🚨 As of Babel 7.4.0, this package has been deprecated in favor of directly including `core-js/stable` (to polyfill ECMAScript features):
>
> ```js
> import "core-js/stable";
> ```
>
> If you are compiling generators or async function to ES5, and you are using a version of `@babel/core` or `@babel/plugin-transform-regenerator` older than `7.18.0`, you must also load the [`regenerator runtime`](https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime) package. It is automatically loaded when using `@babel/preset-env`'s `useBuiltIns: "usage"` option or `@babel/plugin-transform-runtime`.

通过使用`core-js`和`regenerator-runtime`，来实现`polyfill`填充功能。如果我们已经使用了@babel/preset-env并且设置`useBuiltIns: "usage"`后，会自动加载`regenerator-runtime`，不需要手动配置，或者我们可以使用`@babel/plugin-transform-runtime`。

安装`core-js/stable`：

````shell
npm install core-js -d
````

`useBuiltInt`默认值为`false`，即不对当前js做`polyfill`处理。可以配置为`'usage'`或者`'entry'`：

- `usage`：依据用户源代码中使用到的新语法进行兼容填充。
- `entry`：依据browserlistrc获取的需要配置的浏览器列表，来进行兼容填充。

> 在一般情况下，`usage`会更节省空间，因为只会对我们代码中使用到的新语法进行兼容，而`entry`则会将适配浏览器需要的所有兼容内容都填充。但是如果需要兼容的浏览器适配比较好，或者说目标浏览器比较新，只有很少部分内容需要兼容，那么`entry`是一个更好的选择。

`usage`方式配置：（在babel.config.js中）

```js
module.exports = {
    presets: [
        '@babel/preset-env',
        {
            useBuiltIns: 'usage',
            corejs: 3, 
            // 注意这里默认的corejs版本一般是2
            // 如果使用其他版本需要自己手动指定。
        }
    ]
}
```

`entry`方式配置：

```js
module.exports = {
    presets: [
        '@babel/preset-env',
        {
            useBuiltIns: 'entry',
            corejs: 3, 
            // 注意这里默认的corejs版本一般是2
            // 如果使用其他版本需要自己手动指定。
        }
    ]
}
```

配置的`entry`模式需要在js文件中，手动`import 'core-js'`



## 18、copy-webpack-plugin

在项目public目录下的内容是不希望被webpack打包，而直接复制到输出目录下的，那么通过`copy-webpack-plugin`插件就可以实现目标的复制。

安装`copy-webpack-plugin`：

```shell
npm install copy-webpack-plugin -d
```

在`webpack.config.js`中配置插件：

```js
{
	plugins: [
		new CopyWebpackPlugin({
            patterns: [
                {
                    from: './public',
                    // 由于我们使用html-webpack-plugin插件会在输出目录中生成index.html文件
                    // 而copy插件会将public又拷贝过去，index.html文件重复了
                    // 所以需要配置忽略index.html文件。
                    globOptions: {
                        ignore: '**/index.html'
                    }
                }
            ]
        })
	]
}
```



## 19、webpack-dev-server

为了开发的便利，希望能够在内容修改后，webpack重新打包，并且在页面上刷新内容。

可以使用webpack的观察模式：`webpack --watch`，该打包模式打包完成后会监听项目文件，当发生变化保存后，就会重新打包。结合vscode中的live server插件就可以实现页面自动更新的简单开发服务器，快速开发应用程序。

当然这个方法存在很多的问题：

- 修改保存后所有源代码都会重新编译
- 每次编译成功后都需要重新输出打包文件，进行文件的读写
- live server本身是vsc的插件，而不是webpack生态的插件
- 不能实现局部刷新，live server监听到内容变化后只会全局刷新

所以可以利用webpack的webpack-dev-server插件来实现开发服务器。

安装`webpack-dev-server`：

```shell
npm install webpack-dev-server --save-dev
```

在webpack.config.js中配置：

```js
devServer: {
	static: {
		directory: path.join(__dirname, 'public'),
	},
	compress: true,
	port: 9000,
},
// 利用 gzips 压缩 public/ 目录当中的所有内容并提供一个本地服务 端口号9000
```

配置一个运行脚本：`"serve": "webpack serve --open"`

使用`npm run serve`即可。



## 20、webpack-dev-middleware

> `webpack-dev-middleware` is a wrapper that will emit files processed by webpack to a server. This is used in `webpack-dev-server` internally, however it's available as a separate package to allow more custom setups if desired. We'll take a look at an example that combines `webpack-dev-middleware` with an express server.
>
> 👆来自webpack官方文档[Development | webpack](https://webpack.js.org/guides/development/)



## 21、HMR简单使用

当更新完内容保存后，可以发现页面是全局刷新的。

而通过**模块热替换**（Hot Module Replacement），只需要局部刷新页面上发生变化的模块，同时可以保留当前的页面状态，比如复选框的选中状态、输入框的输入等不需要重新去操作。

HMR可以节省我们的开发时间、提升开发的体验。

使用HMR我们只需要在`devServer`中配置`hot: true`

然后在index.js文件中对需要热替换的模块进行一些操作：

```js
if(module.hot){
    module.hot.accept('./js/print.js', () => {
        console.log('print.js update')
    })
}
```



## 22、HMR实现原理（待补充）



## 23、vue组件热替换

vue组件通过`vue-loader`插件可以非常方便的实现组件热替换。

安装`vue`、`vue-lodaer`：

```shell
npm install vue vue-loader --save
```

在`webpack.config.js`中配置：

```js
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: ['vue-loader']
			}
		]
	},
	plugins: [new VueLoaderPlugin()]
}
```

项目src目录中创建vue入口文件`App.vue`和`index.js`，创建一个`Title.vue`组件做为热替换测试。

`Title.vue`：

```vue
<template>
    <div>
        <h1>{{ title }}</h1>
    </div>
</template>

<script setup>
const title = 'hello vue!'
</script>
```

`App.vue`：

```vue
<template>
<div>
    <TitleVue></TitleVue>
</div>
</template>

<script setup>
import TitleVue from './components/Title.vue'
</script>
```

`index.js`：

```js
import { createApp }  from 'vue'
import App from './App.vue'

const app = createApp(App).mount('#app')
```

运行后，修改`Title`组件中的内容，即可观察到。



## 24、proxy代理设置

在开发阶段，前后端数据的请求可能会出现跨域的问题，所以需要进行一个转发代理。

我们在之前已经使用`devServer`创建了一个开发服务器，可以通过设置`proxy`属性，利用该服务器进行转发，解决跨域的问题。

```js
devServer: {
	proxy: {
		'/api': {
			target: 'https://api.github.com'
		}
	}
}
```

如上配置后，我们使用axios请求`/api/user`，就会转发到`https://api.github.com/api/user`。但是这个api并不需要，所以可以重写该字段：

```js
devServer: {
	proxy: {
		'/api': {
			target: 'https://api.github.com',
			pathRewrite: {'^/api': ''},
             // 又因为该api的限制问题，所以需要把我们的请求的host伪装一下👇
             changeOrigin: true
		}
	}
}
```



## 25、resolve属性

webpack的`resolve`属性用来配置解析模块的规则。

例如vue模块，在之前必须要将`.vue`后缀名加上才能够正常的通过`vue-loader`对其进行解析，如果不加上后缀名，就无法匹配为vue解析。

利用`resolve`属性的`extensions`属性可以配置后缀名的解析：

```js
module.exports = {
	resolve: {
    	extensions: ['.js', '.json', '.ts', '.vue']
	},
};
```

同时也可以利用`resolve`属性的`alias`属性配置其他的解析规则，例如`@`符号表示`src`目录：

```js
const path = require('path')

module.exports = {
	resolve: {
    	extensions: ['.js', '.json', '.ts', '.vue'],
    	alias: {
    		'@': path.resolve(__dirname, 'src')
    	}
	},
};
```



## 26、source-map

source-map就是一个对于打包前后代码对应位置的映射，可以在调试的时候定位到源代码中的信息。

在webpack.config.js中的devtool属性用于选择一种 source map风格来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。

> | devtool                                    | performance                              | production | quality        | comment                                                      |
> | :----------------------------------------- | :--------------------------------------- | :--------- | :------------- | :----------------------------------------------------------- |
> | (none)                                     | **build**: fastest  **rebuild**: fastest | yes        | bundle         | Recommended choice for production builds with maximum performance. |
> | **`eval`**                                 | **build**: fast  **rebuild**: fastest    | no         | generated      | Recommended choice for development builds with maximum performance. |
> | `eval-cheap-source-map`                    | **build**: ok  **rebuild**: fast         | no         | transformed    | Tradeoff choice for development builds.                      |
> | `eval-cheap-module-source-map`             | **build**: slow  **rebuild**: fast       | no         | original lines | Tradeoff choice for development builds.                      |
> | **`eval-source-map`**                      | **build**: slowest  **rebuild**: ok      | no         | original       | Recommended choice for development builds with high quality SourceMaps. |
> | `cheap-source-map`                         | **build**: ok  **rebuild**: slow         | no         | transformed    |                                                              |
> | `cheap-module-source-map`                  | **build**: slow  **rebuild**: slow       | no         | original lines |                                                              |
> | **`source-map`**                           | **build**: slowest  **rebuild**: slowest | yes        | original       | Recommended choice for production builds with high quality SourceMaps. |
> | `inline-cheap-source-map`                  | **build**: ok  **rebuild**: slow         | no         | transformed    |                                                              |
> | `inline-cheap-module-source-map`           | **build**: slow  **rebuild**: slow       | no         | original lines |                                                              |
> | `inline-source-map`                        | **build**: slowest  **rebuild**: slowest | no         | original       | Possible choice when publishing a single file                |
> | `eval-nosources-cheap-source-map`          | **build**: ok  **rebuild**: fast         | no         | transformed    | source code not included                                     |
> | `eval-nosources-cheap-module-source-map`   | **build**: slow  **rebuild**: fast       | no         | original lines | source code not included                                     |
> | `eval-nosources-source-map`                | **build**: slowest  **rebuild**: ok      | no         | original       | source code not included                                     |
> | `inline-nosources-cheap-source-map`        | **build**: ok  **rebuild**: slow         | no         | transformed    | source code not included                                     |
> | `inline-nosources-cheap-module-source-map` | **build**: slow  **rebuild**: slow       | no         | original lines | source code not included                                     |
> | `inline-nosources-source-map`              | **build**: slowest  **rebuild**: slowest | no         | original       | source code not included                                     |
> | `nosources-cheap-source-map`               | **build**: ok  **rebuild**: slow         | no         | transformed    | source code not included                                     |
> | `nosources-cheap-module-source-map`        | **build**: slow  **rebuild**: slow       | no         | original lines | source code not included                                     |
> | `nosources-source-map`                     | **build**: slowest  **rebuild**: slowest | yes        | original       | source code not included                                     |
> | `hidden-nosources-cheap-source-map`        | **build**: ok  **rebuild**: slow         | no         | transformed    | no reference, source code not included                       |
> | `hidden-nosources-cheap-module-source-map` | **build**: slow  **rebuild**: slow       | no         | original lines | no reference, source code not included                       |
> | `hidden-nosources-source-map`              | **build**: slowest  **rebuild**: slowest | yes        | original       | no reference, source code not included                       |
> | `hidden-cheap-source-map`                  | **build**: ok  **rebuild**: slow         | no         | transformed    | no reference                                                 |
> | `hidden-cheap-module-source-map`           | **build**: slow  **rebuild**: slow       | no         | original lines | no reference                                                 |
> | `hidden-source-map`                        | **build**: slowest  **rebuild**: slowest | yes        | original       | no reference. Possible choice when using SourceMap only for error reporting purposes. |
>
> 验证 devtool 名称时， 我们期望使用某种模式， 注意不要混淆 devtool 字符串的顺序， 模式是： `[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`.
>
> 👆来自webpack官方文档



## 27、typescript解析

### 27.1、使用ts-loader

安装ts-loader：

```shell
npm install ts-loader -D
```

配置ts-loader：

```js
module.exports = {
	module: {
        rules: [
            {
                test: /\.ts&/,
                use: ['ts-loader']
            }
        ]
    }
}
```

配置完成后，编译打包即可。



### 27.2、使用babel-loader

babel-loader基本的安装以及一些配置在之前的实践中已经熟悉了。这里只记录配置与ts编译相关内容：

安装@babel/preset-typescript：

```shell
npm install @babel/preset-typescript -D
```

在webpack.config.js中：

```js
module.exports = {
	module: {
        rules: [
            {
                test: /\.ts&/,
                use: ['ts-loader']
            }
        ]
    }
}
```

在babel.config.js中：

```js
module.exports = {
	presets: ["@babel/preset-typescript"]
}
```



### 27.3、最佳实践

因为使用ts-loader不能够利用pollyfill对某些新语法进行解析填充，而使用babel-loader不能够在编译阶段发现代码中的错误。

所以我们可以利用typescript插件，在使用babel-loader进行打包前，先使用`tsc`对项目文件进行一次语法检查，然后再进行打包。

配置一个编译脚本：

```json
"scripts": {
    "build": "npm run check && webpack",
    "check": "tsc --noEmit"
},
```



## 28、区分打包环境

生存环境和开发环境的配置会又一定程度的区别，所以我们需要将配置文件拆分开来，在特定的需求下组合特定的环境。

根据生产环境和开发环境各自的需求，配置webapck.prod.js、webpack.dev.js。在webpack.common.js中配置公共内容，然后根据传入的env来判断需要组合哪个配置文件。

组合配置文件使用webpack-merge：

安装webpack-merge：

```shell
npm install webpack-merge -D
```

导入webpack-merge：

```js
const { merge } = require('webpack-merge')
// merge(a, b)
```

`webpack.common.js`：

```js
const resolvePath = require('./paths');
const {merge} = require('webpack-merge');
const prodConfig = require('./webpack.prod.js');
const devConfig = require('./webpack.dev.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {DefinePlugin} = require('webpack');

const commonConfig = {
    entry: './src/index.ts',
    devServer: {
        hot: true,
    },
    output: {
        path: resolvePath('./dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Learning webpack',
            template: './public/index.html',
        }),
        new DefinePlugin({
            BASE_URL: "'./'"
        })
    ]
}

module.exports = (env) => {
    const isProduction = env.production;
    const config = isProduction ? prodConfig : devConfig;
    return merge(commonConfig, config);
}
```

`webpack.dev.js`：

```js
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        hot: true,
    },
}
```

`webpack.prod.js`：

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
    ]
}
```

`paths.js`：

```js
const path = require('path')

const appDir = process.cwd()

const resolvePath = (relativePath) => {
    return path.resolve(appDir, relativePath)
}

module.exports = resolvePath
```

配置的脚本：

```JSON
"build2": "webpack --config ./config/webpack.common.js --env production",
"serve2": "webpack serve --config ./config/webpack.common.js --env development --open"
```



如果其他的加载器的配置文件需要进行区分打包环境，例如babel的presets和plugins在生产环境和开发环境中有各自的需求。

可以使用`process.env.NODE_ENV`来获取当前的webpack模式，根据获得的模式，来配置不同的环境：

在`webpack.common.js`中：

```js
process.env.NODE_ENV = isProduction ? 'production' : 'development';
```

`babel.config.js`：

```js
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
```



## 29、代码拆分打包

之前的实践中，所有项目打包完后都发射到一个main.js文件中，这样会导致main.js非常的大，首屏加载时会很慢，很多不需要用到的内容都被包含在main.js中。所以需要可以对代码进行拆分打包。

在webpack配置的entry属性可以配置多个入口，通过这种方式可以手动的配置代码的拆分打包。

```js
module.exports = {
	entry: {
        // 方法1
		index: './src/index.js',
		print: './src/print.js',
        // 方法2 需要对导入的模块进行拆分
        index: {
            import: './src/index.js',
            dependOn: 'lodash'
        },
        print: {
            import: './src/print.js',
            dependOn: 'lodash'
        },
        lodash: 'lodash',
        // 方法3 需要多个模块时
        index: {
            import: './src/index.js',
            dependOn: 'shared'
        },
        print: {
            import: './src/print.js',
            dependOn: 'shared'
        },
        shared: ['lodash', 'jquery']
	},
	output: {
		filename: 'js/[name].build.js',
		path: path.resolve(__dirname, 'dist'),
	}
}
```



## 30、splitchunks配置

上篇中已经介绍了代码拆分打包的方式，而webpack也为我们提供了对于异步/同步导入的文件的自动拆分打包方式：splitchunk

下面这个配置对象代表 `SplitChunksPlugin` 的默认行为。

在webpack.config.js中配置：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

配置样例：

```js
optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                syVandors: {
                    test: /[\\/]node_modules[\\/]/,
                    filename: 'js/[contenthash].vendor.js',
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    filename: 'js/[contenthash].js',
                    priority: -20,
                }
            }
        }
    },
    output: {
        path: resolvePath('./dist'),
        filename: 'js/[contenthash].bundle.js'
    },
```



## 31、import动态导入

通过import函数异步导入的内容，会被自动的拆分打包，可以通过设置output的chunkFilename来对输出文件名进行配置：

```js
output: {
    path: resolvePath('./dist'),
    filename: 'js/[contenthash].bundle.js',
    chunkFilename: 'js/[contenthash].chunk.js',
},
```

还可以通过魔法注释来实现配置name：

index.js：

```js
import(/*webpackChunkName: "title"*/'./components/title');
```

webpack.common.js：

```js
output: {
    path: resolvePath('./dist'),
    filename: 'js/[contenthash].bundle.js',
    chunkFilename: 'js/[name].chunk.js',
},
```



## 32、runtimeChunk优化配置

> 设置runtimeChunk是将包含`chunks 映射关系`的 list单独从 app.js里提取出来，因为每一个 chunk 的 id 基本都是基于内容 hash 出来的，所以每次改动都会影响它，如果不将它提取出来的话，等于app.js每次都会改变。缓存就失效了。设置runtimeChunk之后，webpack就会生成一个个runtime~xxx.js的文件。
>  然后每次更改所谓的运行时代码文件时，打包构建时app.js的hash值是不会改变的。如果每次项目更新都会更改app.js的hash值，那么用户端浏览器每次都需要重新加载变化的app.js，如果项目大切优化分包没做好的话会导致第一次加载很耗时，导致用户体验变差。现在设置了runtimeChunk，就解决了这样的问题。所以`这样做的目的是避免文件的频繁变更导致浏览器缓存失效，所以其是更好的利用缓存。提升用户体验。`
>
> 查看下runtime~xxx.js文件内容:
>
> ```jsx
> function a(e){return i.p+"js/"+({about:"about"}[e]||e)+"."+{about:"3cc6fa76"}[e]+".js"}f
> ```
>
> 发现文件很小，且就是加载chunk的依赖关系的文件。虽然每次构建后app的hash没有改变，但是runtime~xxx.js会变啊。每次重新构建上线后，浏览器每次都需要重新请求它，它的 http 耗时远大于它的执行时间了，所以建议不要将它单独拆包，而是将它内联到我们的 index.html 之中。这边我们使用[script-ext-html-webpack-plugin](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fnumical%2Fscript-ext-html-webpack-plugin)来实现。（也可使用html-webpack-inline-source-plugin，其不会删除runtime文件。）
>
> ```jsx
> // vue.config.js
> const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
> module.exports = {
>   productionSourceMap: false,
>   configureWebpack: {
>     optimization: {
>       runtimeChunk: true
>     },
>     plugins: [
>       new ScriptExtHtmlWebpackPlugin({
>         inline: /runtime~.+\.js$/  //正则匹配runtime文件名
>       })
>     ]
>   },
>   chainWebpack: config => {
>     config.plugin('preload')
>       .tap(args => {
>         args[0].fileBlacklist.push(/runtime~.+\.js$/) //正则匹配runtime文件名，去除该文件的preload
>         return args
>       })
>   }
> }
> ```
>
> 重新打包，查看index.html文件
>
> ```html
> <!DOCTYPE html>
> <html lang=en>
> 
> <head>
>     <meta charset=utf-8>
>     <meta http-equiv=X-UA-Compatible content="IE=edge">
>     <meta name=viewport content="width=device-width,initial-scale=1">
>     <link rel=icon href=/favicon.ico>
>     <title>runtime-chunk</title>
>     <link href=/js/about.cccc71df.js rel=prefetch>
>     <link href=/css/app.b087a504.css rel=preload as=style>
>     <link href=/js/app.9f1ba6f7.js rel=preload as=script>
>     <link href=/css/app.b087a504.css rel=stylesheet>
> </head>
> 
> <body><noscript><strong>We're sorry but runtime-chunk doesn't work properly without JavaScript enabled. Please enable it
>             to continue.</strong></noscript>
>     <div id=app></div>
>     <script>(function (e) { function r(r) { for (var n, a, i = r[0], c = r[1], l = r[2], f = 0, s = []; f < i.length; f++)a = i[f], Object.prototype.hasOwnProperty.call(o, a) && o[a] && s.push(o[a][0]), o[a] = 0; for (n in c) Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n]); p && p(r); while (s.length) s.shift()(); return u.push.apply(u, l || []), t() } function t() { for (var e, r = 0; r < u.length; r++) { for (var t = u[r], n = !0, a = 1; a < t.length; a++) { var c = t[a]; 0 !== o[c] && (n = !1) } n && (u.splice(r--, 1), e = i(i.s = t[0])) } return e } var n = {}, o = { "runtime~app": 0 }, u = []; function a(e) { return i.p + "js/" + ({ about: "about" }[e] || e) + "." + { about: "cccc71df" }[e] + ".js" } function i(r) { if (n[r]) return n[r].exports; var t = n[r] = { i: r, l: !1, exports: {} }; return e[r].call(t.exports, t, t.exports, i), t.l = !0, t.exports } i.e = function (e) { var r = [], t = o[e]; if (0 !== t) if (t) r.push(t[2]); else { var n = new Promise((function (r, n) { t = o[e] = [r, n] })); r.push(t[2] = n); var u, c = document.createElement("script"); c.charset = "utf-8", c.timeout = 120, i.nc && c.setAttribute("nonce", i.nc), c.src = a(e); var l = new Error; u = function (r) { c.onerror = c.onload = null, clearTimeout(f); var t = o[e]; if (0 !== t) { if (t) { var n = r && ("load" === r.type ? "missing" : r.type), u = r && r.target && r.target.src; l.message = "Loading chunk " + e + " failed.\n(" + n + ": " + u + ")", l.name = "ChunkLoadError", l.type = n, l.request = u, t[1](l) } o[e] = void 0 } }; var f = setTimeout((function () { u({ type: "timeout", target: c }) }), 12e4); c.onerror = c.onload = u, document.head.appendChild(c) } return Promise.all(r) }, i.m = e, i.c = n, i.d = function (e, r, t) { i.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: t }) }, i.r = function (e) { "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, i.t = function (e, r) { if (1 & r && (e = i(e)), 8 & r) return e; if (4 & r && "object" === typeof e && e && e.__esModule) return e; var t = Object.create(null); if (i.r(t), Object.defineProperty(t, "default", { enumerable: !0, value: e }), 2 & r && "string" != typeof e) for (var n in e) i.d(t, n, function (r) { return e[r] }.bind(null, n)); return t }, i.n = function (e) { var r = e && e.__esModule ? function () { return e["default"] } : function () { return e }; return i.d(r, "a", r), r }, i.o = function (e, r) { return Object.prototype.hasOwnProperty.call(e, r) }, i.p = "/", i.oe = function (e) { throw console.error(e), e }; var c = window["webpackJsonp"] = window["webpackJsonp"] || [], l = c.push.bind(c); c.push = r, c = c.slice(); for (var f = 0; f < c.length; f++)r(c[f]); var p = l; t() })([]);</script>
>     <script src=/js/chunk-vendors.1e5c55d3.js></script>
>     <script src=/js/app.9f1ba6f7.js></script>
> </body>
> </html>
> ```
>
> index.html中已经没有对runtime~xxx.js的引用了，而是直接将其代码写入到了index.html中，故不会在请求文件，减少http请求。
>
> 👆来自博客：链接：https://www.jianshu.com/p/714ce38b9fdc
