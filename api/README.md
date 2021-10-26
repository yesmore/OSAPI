# 快速开始

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

[MIT licensed](LICENSE).



# 接口文档



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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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
{
    
}
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





































































































































































































































