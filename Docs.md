<div align=center>
    <h1>
        <span style='font-size:40px;font-weight:700;'>OSAPI 开发文档</span><br>
         <img src="https://img.shields.io/github/stars/yesmore/OSAPI.svg" alt="star"/>
    <img src="https://img.shields.io/github/issues/yesmore/OSAPI" alt="star"/>
     <img src="https://img.shields.io/github/license/yesmore/OSAPI" alt="star"/>
    </h1>
</div>

<span style='float:right'>**阅读文档**：中文版 | [English](https://github.com/yesmore/OSAPI)</span>

# 目录

> [项目结构](#项目结构)
>
> [前端](#前端)
>
> [后端](#后端)
>
> [线上部署](#线上部署)
>
> [接口文档](#接口文档)



# 项目结构



```js
|- api/
	|- libs/
    	|- db/
	|- public/
    	|- upload/
	|- src/
    	|- config/
    	|- interface/
    	|- middleware/
    	|- module/
		|- service/
		|- app.module.ts/
		|- mainr.ts
	|- config/
		|- config.default.js
		|- plugin.js
	|- test/
	|- views/
	|- package.json
	|- README.md
	|- ...

|- osapi/
	|- dist/
	|- public/
	|- src/
		|- assets/
    	|- components/
		|- router/
		|- utils/
		|- views/
    	|- App.vue
		|- main.ts
		|- env.d.ts
		|- vue.d.ts
	|- package.json
	|- README.md
	|- vite.config.ts
	|- ...
```

<a href='#目录' style='float:right'>回到顶部</a>

# 前端

架构：**Vue3 + Typescript + Vite2 + Element-Plus**

### 初始化项目

#### vite + vue3.0 

```bash
$ mkdir project
$ cd project

# 一条命令初始化 vue3+vite2
$ npm init @vitejs/app your-vue-app-name --template vue-ts
```

<a href='#目录' style='float:right'>回到顶部</a>

### 依赖安装

#### element-plus

```bash
# 安装
$ npm install element-plus --save
```

在`main.ts`全局引入Vant

```typescript
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

createApp(App)
  .use(ElementPlus)
  .mount('#app')
```

<a href='#目录' style='float:right'>回到顶部</a>

#### Less

安装less预处理器

```bash
$ npm i less less-loader -D
# or
$ yarn add less less-loader -D
```

在 `vue3/src/`目录下新建 `asserts` 文件夹，然后在 `vue3/vite.config.ts` 配置如下内容.

```typescript
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  return {
    ...
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/less/base.less";'
        }
      }
    }
  }
})

```

在 main.ts 中全局引入：

```typescript
import '@/assets/less/base.css'
```

> asserts文件夹中的 less 工具类库可以从github下载或者自己编写：[Tool-Class-of-CSS](https://github.com/yesmore/Tool-Class-of-CSS)

<a href='#目录' style='float:right'>回到顶部</a>

#### Axios

> 配置 http 请求模块

```bash
$ npm i -s axios
```

我封装了一个 `request` 工具模块作为独立的**http**请求模块，位于 `vue3/src/utils/request.ts` 中；

```js
import axios from "axios";

const _APP_BASE_API = import.meta.env.VITE_APP_BASE_API

const http = axios.create({
  // baseURL: '/api',
  baseURL: _APP_BASE_API,
  timeout: 100000, // request timeout
  headers: {
    // 设置token
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  }
})

export default http

```

```js
// xxx.vue
import http from './utils/request'

const fetchData = async () => {
    let res = await http.get('http://v2.aoau.top/pb?p=6)
    console.log(res.data)
}

```

其中，常量 **_APP_BASE_API** 是baseURL的环境变量，在下面两个文件中有定义：

**开发选项**

```js
// vue3/.env.development
VITE_APP_BASE_API = http://127.0.0.1:3009
```

**生产选项**

```js
// vue3/.env.production
VITE_APP_BASE_API = http://v3.aoau.top
```

vite会根据配置文件调用相对的baseURL

注意：配置的环境变量需要在 `vue3/src/env.d.ts` 中声明才能正常使用：

```typescript
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量提示
interface ImportMetaEnv {
  VITE_APP_BASE_API: string,
  VITE_APP_IMG_API: string
}
```

<a href='#目录' style='float:right'>回到顶部</a>

### 基本配置

#### Iconfont

在官网 [阿里巴巴图标库](https://www.iconfont.cn/) 中创建的项目，添加需要的图标并下载下来，将文件夹放在 `vue3/src/assets` 中，然后在 main.ts 中全局引入：

```typescript
import '@/assets/iconfont/iconfont.css'
```

项目中使用：

```vue
<i class="iconfont icon-Wifi"></i>
```

<a href='#目录' style='float:right'>回到顶部</a>

#### Vuex

该项目使用 store 来保存登陆用户的状态，主要有两个状态：

```typescript
export interface State {
  isLogin: boolean,
  username: string,
}
  
state: localStorage.getItem('store') ? getterLsState() : {
  isLogin: false, // 是否登录
  username: '',	  // 用户名	
},  
```

每次更新用户状态（登陆/注销/关闭页面）时，会触发 **state** 的更新，最新状态经过 base64编码后保存在本地存储中（localStorage），在 `vue3/src/utils/localStorage.ts` 中在定义了 set/get 本地存储的方法：

```typescript
import {Base64} from 'js-base64'

export const getterLsState = () => {
  return JSON.parse(Base64.decode(localStorage.getItem('store') || ''))
}

export const setterLsState = (store:any) => {
  localStorage.setItem(
    "store",
    Base64.encode(JSON.stringify(store.state))
  )
}
```

#### Vue-Router

前端路由守卫，通过 store 中保存的 **isLogin** 值来判断用户是否登录。

```typescript
beforeEnter:(to,from) =>{
  if (!getterLsState().isLogin && (to.path === '/control' || to.path === '/control/focus' || to.path === '/control/dataType' || to.path === '/control/data' || to.path === '/control/dataCate')) {
    ToolMsg('未登陆-路由','warning')
    router.push(from.path)
  }
},
```

<a href='#目录' style='float:right'>回到顶部</a>





# 后端

<a href='#目录' style='float:right'>回到顶部</a>

### 初始化项目

#### Installation

```bash
$ npm install
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

<a href='#目录' style='float:right'>回到顶部</a>



### 数据结构

#### RBAC模式数据库设计图

![RBAC模式数据库设计图](https://cdn.jsdelivr.net/gh/yesmore/img/img/RBAC模式数据库设计图.png)





#### 后台管理数据关系图

![后台管理数据关系图](https://cdn.jsdelivr.net/gh/yesmore/img/img/数据关系图.png)

<a href='#目录' style='float:right'>回到顶部</a>

### 基本配置

#### 中间件配置

...肝

#### 路由守卫

...肝



<a href='#目录' style='float:right'>回到顶部</a>

# 线上部署

...肝

<a href='#目录' style='float:right'>回到顶部</a>

# 接口文档

> 还在肝

<a href='#目录' style='float:right'>回到顶部</a>

## 一、Admin模块

### 1.登陆接口

#### /admin/login

描述：获取数据库所有用户

请求方式：**Get**

参数：无

| 字段 | 类型 | 说明 | 必需 |
| :--: | :--: | :--: | :--: |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  | 用户列表 |  否  |
|  msg   | str  |          |  是  |

示例：

```javascript
{
    
}
```



#### /admin/login/doLogin

描述：用户登陆

请求方式：**POST**

参数：

|   字段   | 类型 |  说明  | 必需 |
| :------: | :--: | :----: | :--: |
| username | str  | 用户名 |  是  |
| password | str  |  密码  |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |  用户名  |  否  |
|  msg   | str  | 登陆成功 |  是  |

示例：

```javascript
{
    
}
```





#### /admin/login/logout

描述：退出登陆

请求方式：**Get**

参数：无

返回值：

|  字段  | 类型 |  说明   | 必需 |
| :----: | :--: | :-----: | :--: |
| status | num  | 状态码  |  是  |
|  info  | any  | session |  否  |
|  msg   | str  | 已退出  |  是  |

示例：

```javascript
{
    
}
```



#### /admin/login/isLogin

描述：用户是否登录

请求方式：**Get**

参数：无

返回值：

|  字段  | 类型 |     说明      | 必需 |
| :----: | :--: | :-----------: | :--: |
| status | num  |    状态码     |  是  |
|  info  | any  | username/null |  否  |
|  msg   | str  | 已登陆/未登陆 |  是  |

示例：

```javascript
{
    
}
```



#### /admin/login/code

描述：生成图片验证码

请求方式：**POST**

参数：无

返回值：

|  字段  | 类型 |        说明        | 必需 |
| :----: | :--: | :----------------: | :--: |
| status | num  |       状态码       |  是  |
|  info  | any  | codeText & codeUrl |  否  |
|  msg   | str  |    code success    |  是  |

示例：

```javascript
{
    
}
```



### 2.角色接口

#### /admin/role

描述：获取所有角色

请求方式：**Get**

参数：无

返回值：

| 字段 | 类型 |   说明   | 必需 |
| :--: | :--: | :------: | :--: |
| role | arr  | 角色列表 |  否  |

示例：

```javascript
{
    
}
```





#### /admin/role/create

描述：创建角色

请求方式：**Post**

参数：

|    字段     | 类型 |  说明  | 必需 |
| :---------: | :--: | :----: | :--: |
|    title    | str  | 角色名 |  是  |
| description | str  |  描述  |  否  |

返回值：

|  字段  | 类型 |     说明     | 必需 |
| :----: | :--: | :----------: | :--: |
| status | num  |    状态码    |  是  |
|  info  | any  | 新建角色数据 |  否  |
|  msg   | str  |   创建成功   |  是  |

示例：

```javascript
{
    
}
```





#### /admin/role/edit

描述：编辑角色

请求方式：**Post**

参数：

|    字段     | 类型 |   说明   | 必需 |
| :---------: | :--: | :------: | :--: |
|    title    | str  | 角色名称 |  是  |
| description | str  |   描述   |  是  |
|     _id     | str  |    id    |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |    /     |  否  |
|  msg   | str  | 修改成功 |  是  |

示例：

```javascript
{
    
}
```





#### /admin/role/delete

描述：删除角色

请求方式：**Post**

参数：

| 字段 | 类型 |  说明  | 必需 |
| :--: | :--: | :----: | :--: |
| _id  | str  | 角色id |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |    /     |  否  |
|  msg   | str  | 删除成功 |  是  |

示例：

```javascript
{    }
```





#### /admin/role/beforeAuth

描述：根据当前角色关联查询角色所有操作权限

请求方式：**Get**

参数：

| 字段 | 类型 |  说明  | 必需 |
| :--: | :--: | :----: | :--: |
| _id  | str  | 角色id |  是  |

返回值：

|  字段  | 类型 |         说明         | 必需 |
| :----: | :--: | :------------------: | :--: |
| status | num  |        状态码        |  是  |
|  info  | any  | AccessList & role_id |  否  |
|  msg   | str  |       查询成功       |  是  |

示例：

```javascript
{    }
```





#### /admin/role/doAuth

描述：创建role-access关联表

请求方式：**Post**

参数：

|    字段     | 类型 |                    说明                    | 必需 |
| :---------: | :--: | :----------------------------------------: | :--: |
|   role_id   | str  |                   角色id                   |  是  |
| access_node | arr  | 操作节点（具体操作行为 - **action_name**） |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |    /     |  否  |
|  msg   | str  | 操作成功 |  是  |

示例：

```javascript
{    }
```





### 3.管理员接口

#### /admin/manager

描述：查询管理员（关联角色）

请求方式：**Get**

参数：无

返回值：

| 字段 | 类型 |   说明   | 必需 |
| :--: | :--: | :------: | :--: |
| info | any  | 用户列表 |  否  |

示例：

```javascript
{    }
```





#### /admin/manager/create

描述：创建管理员

请求方式：**Get**

参数：

|   字段   | 类型 |  说明  | 必需 |
| :------: | :--: | :----: | :--: |
| username | str  | 用户名 |  是  |
| password | str  |  密码  |  是  |
| role_id  | str  |  角色  |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  | 用户数据 |  否  |
|  msg   | str  | 创建成功 |  是  |

示例：

```javascript
{    }
```



#### /admin/manager/edit

描述：编辑管理员

请求方式：**Post**

参数：

|   字段   | 类型 |  说明  | 必需 |
| :------: | :--: | :----: | :--: |
| username | str  | 用户名 |  否  |
| password | str  |  密码  |  否  |
|  mobile  | str  |  手机  |  否  |
|   _id    | str  |   id   |  是  |
|  email   | str  |  邮箱  |  否  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |    /     |  否  |
|  msg   | str  | 修改成功 |  是  |

示例：

```javascript
{    }
```



#### /admin/manager/delete

描述：删除管理员

请求方式：**Post**

参数：

| 字段 | 类型 |   说明   | 必需 |
| :--: | :--: | :------: | :--: |
| _id  | str  | 管理员id |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |    /     |  否  |
|  msg   | str  | 删除成功 |  是  |

示例：

```javascript
{    }
```



#### /admin/manager/roles

描述：获取角色列表

请求方式：**Get**

参数：无

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  | 角色列表 |  否  |
|  msg   | str  | 获取成功 |  是  |

示例：

```javascript
{    }
```



### 4.模块接口

> 三级结构 —— 模块 + 菜单 + 操作

#### /admin/access

描述：关联查询  一级模块-二级模块

请求方式：**Get**

参数：无

返回值：

|  字段  | 类型 |     说明     | 必需 |
| :----: | :--: | :----------: | :--: |
| status | num  |    状态码    |  是  |
|  info  | any  | 树状模块列表 |  否  |
|  msg   | str  |   查询成功   |  是  |

示例：

```javascript
{    }
```



#### /admin/access/create

描述：创建模块

请求方式：**Post**

参数：

|    字段     | 类型 |                 说明                 | 必需 |
| :---------: | :--: | :----------------------------------: | :--: |
| module_name | str  |               模块名称               |  是  |
| action_name | str  |               操作名称               |  是  |
|    type     | num  |   节点类型： 1-模块 2-菜单 3-操作    |  是  |
|     url     | str  |               跳转地址               |  是  |
|  module_id  | mix  | 混合类型：0-当前模块 、_id-操作/菜单 |  是  |
| description | str  |                 描述                 |  否  |
|   status    | num  |                 状态                 |  是  |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  | 新建数据 |  否  |
|  msg   | str  | 创建成功 |  是  |

示例：

```javascript
{    }
```



#### /admin/access/beforeEdit

描述：获取模块列表

请求方式：**Post**

参数：

| 字段 | 类型 |  说明  | 必需 |
| :--: | :--: | :----: | :--: |
| _id  | str  | 模块id |  是  |

返回值：

|  字段  | 类型 |          说明           | 必需 |
| :----: | :--: | :---------------------: | :--: |
| status | num  |         状态码          |  是  |
|  info  | any  | accessList & moduleList |  是  |
|  msg   | str  |        查询成功         |  是  |

示例：

```javascript
{    }
```



#### /admin/access/edit

描述：编辑模块

请求方式：**Post**

参数：

|    字段     | 类型 |   说明   | 必需 |
| :---------: | :--: | :------: | :--: |
|  module_id  | str  |  模块id  |  是  |
| action_name | str  | 操作名称 |  是  |
|     _id     | str  |          |      |

返回值：

|  字段  | 类型 |   说明   | 必需 |
| :----: | :--: | :------: | :--: |
| status | num  |  状态码  |  是  |
|  info  | any  |    /     |  否  |
|  msg   | str  | 修改成功 |  是  |

示例：

```javascript
{    }
```





#### /admin/access

描述：关联查询  一级模块-二级模块

请求方式：**Post**

参数：

| 字段 | 类型 | 说明 | 必需 |
| :--: | :--: | :--: | :--: |
|      | str  |      |  是  |
|      | str  |      |  是  |

返回值：

|  字段  | 类型 |  说明  | 必需 |
| :----: | :--: | :----: | :--: |
| status | num  | 状态码 |  是  |
|  info  | any  |        |  否  |
|  msg   | str  |        |  是  |

示例：

```javascript
{    }
```



#### /admin/access

描述：关联查询  一级模块-二级模块

请求方式：**Get**

参数：

| 字段 | 类型 | 说明 | 必需 |
| :--: | :--: | :--: | :--: |
|      | str  |      |  是  |
|      | str  |      |  是  |

返回值：

|  字段  | 类型 |  说明  | 必需 |
| :----: | :--: | :----: | :--: |
| status | num  | 状态码 |  是  |
|  info  | any  |        |  否  |
|  msg   | str  |        |  是  |

示例：

```javascript
{    }
```











## 二、PC模块





## 附1 码表

| 状态 | 描述                                   |
| ---- | -------------------------------------- |
| 200  | 登陆成功、已登陆、注销、验证码生成成功 |
| 201  | 验证码错误、                           |
| 202  | 用户名或密码匹配错误                   |
| 203  | 用户名或密码格式错误、参数格式错误     |
| 401  | 未登陆                                 |
| 403  | 已存在、未修改                         |
| 404  | 无权限                                 |
| 405  | 不存在                                 |
| 501  | 服务器出错                             |

<a href='#目录' style='float:right'>回到顶部</a>



































































































































































































































