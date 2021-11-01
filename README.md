<div align=center>
    <h1>
        <span style='font-size:40px;font-weight:700;'>👋 OSAPI - 开源Api管理平台</span><br>
         <img src="https://img.shields.io/github/stars/yesmore/OSAPI.svg" alt="star"/>
        <img src="https://img.shields.io/github/forks/yesmore/OSAPI" alt="fork"/>
    <img src="https://img.shields.io/github/issues/yesmore/OSAPI" alt="issues"/><br>
     <img src="https://img.shields.io/github/license/yesmore/OSAPI" alt="mit"/>
    </h1>
</div>


<div style='float:right;margin-bottom:20px;'><strong>阅读文档</strong>：中文版 | <a href='https://github.com/yesmore/OSAPI'>English</a></div>

<br>

# 📖 使用者须知

> 迭代中：每周花半天维护及更新，支持pr。

## OSAPI是干嘛的？

**作者君**：

平时写点有趣或者有用（bushi）的接口，比如隔壁的 [photosapi](https://github.com/yesmore/photosapi) ，使用该平台进行**统一管理**且**开源**，同时**收集**整理互联网上其他的 Api，并通过该管理平台集成为接口文档的形式开放出来，目前还没有打算使用这些接口二次开发网页形式的 Api分享平台，如果你有这方面的想法，支持合作。

**面向人群**：

- 热衷白嫖的朋友们
- 想自己开发管理平台的coder们

---

下面是已经开源或收集整理的 Api：

> 注意：请合理利用

## 站内Api

> 预览请注意参数，一般为默认参数

| 接口名称  | 文档地址   | 预览     |
| --------- | ---------- | -------- |
| 1、开发中 | [开发中]() | 不可预览 |

## 站外Api

> 以下接口均来自互联网，如有侵权，请联系本人及时处理

> 接口失效请上 issues，本人会及时删除 

| 接口名称                        | 集成地址   | 预览/1                                                       |
| ------------------------------- | ---------- | ------------------------------------------------------------ |
| 1、小舍图片Api                  | [开发中]() | [可预览](http://v2.aoau.top/pb?p=6)                          |
| 2、开源中国                     | [开发中]() | [可预览](https://query.asilu.com/news/oschina-news)          |
| 3、获取当前经纬度、ip、地址信息 | [开发中]() | [可预览](https://api.asilu.com/geo/)                         |
| 4、百度天气查询                 | [开发中]() | [可预览](https://api.asilu.com/geo/)                         |
| 5、高德天气查询                 | [开发中]() | [可预览](https://query.asilu.com/weather/gaode)              |
| 6、实时降雨量查询               | [开发中]() | [可预览](https://query.asilu.com/weather/now/)               |
| 7、手机归属地查询               | [开发中]() | [可预览](https://api.asilu.com/phone/?phone=13666666666&callback=jsonp_9) |
| 8、IP 归属地查询                | [开发中]() | [可预览](https://api.asilu.com/ip/?ip=www.baidu.com&callback=jsonp_10) |
| 9、历史上的今天                 | [开发中]() | [可预览](https://query.asilu.com/today/list)                 |
| 10、身份证校验                  | [开发中]() | [可预览](https://api.asilu.com/idcard/?id=152502199405148245) |
| 11、有道翻译                    | [开发中]() | [可预览](http://fanyi.youdao.com/openapi.do?keyfrom=Skykai521&key=977124034&type=data&doctype=jsonp&version=1.1&q=I+love+you) |
| 12、Baidu 搜索 关键字           | [开发中]() | [可预览](https://suggestion.baidu.com/su?wd=yyds)            |
| 13、获取用户设备信息            | [开发中]() | [可预览](https://api.asilu.com/user-agent/?USER_AGENT=)      |
| 14、获取QQ头像                  | [开发中]() | [可预览](https://api.xiaobaibk.com/api/qq.php?qq=123456789)  |
| 15、获取qq信息                  | [开发中]() | [可预览](https://api.xiaobaibk.com/api/qq/?qq=123456)        |
| 16、随机动漫图片                | [开发中]() | [可预览](https://api.xiaobaibk.com/api/pic/?pic=acg)         |
| 17、随机妹子图片                | [开发中]() | [可预览](https://api.xiaobaibk.com/api/pic/?pic=girl)        |
| 18、随机一句段子                | [开发中]() | [可预览](https://api.xiaobaibk.com/api/wdz/?type=json)       |
| 19、网站二维码生成接口          | [开发中]() | [可预览](https://api.xiaobaibk.com/api/qr/?text=https://yesmore.cc) |
| 20、B站热搜                     | [开发中]() | [可预览](https://s.search.bilibili.com/main/hotword)         |



····················································我是分界线·····················································

# 📖 开发者须知

## ⚡️更新列表

<details>
<summary><span style='font-size:24px;'><strong>v0.1.1_beta.1</strong></span></summary> 
<ul>
  <li style='margin:10px 0;'><strong>更新内容</strong>：</li><br>
    <div style='margin-bottom:8px'>1、首页加入 <strong>Echarts</strong> 图表；</div><br>
    <div style='margin-bottom:8px'>2、新增个人中心修改管理员信息功能；</div><br>
    <div style='margin-bottom:8px'>3、新增获取管理员登陆 <strong>ip</strong> 功能。</div><br>
  <li style='margin:10px 0'><strong>修复 Bug</strong>：</li> <br> 
    <div style='margin-bottom:8px'>1、修复了首页redis缓存问题（仅 datas 表使用redis， 后续添加其他表）。</div><br>
  <li style='margin:10px 0'><strong>线上版本</strong>：最新版已上线</li>    
</ul>    
</details>    

<details>
<summary><span style='font-size:24px;'><strong>v0.1.0_beta.1</strong></span></summary> 
<ul>
  <li style='margin:10px 0'><strong>更新内容</strong>：</li><br>
    <div style='margin-bottom:8px'>1、数据、数据类型、数据分类、角色授权、管理员、权限的增删改查</div><br>
  <li style='margin:10px 0'><strong>修复 Bug</strong>：</li><br>
    <div style='margin-bottom:8px'>无</div><br>
  <li style='margin:10px 0'>线上版本：最新版已上线</li>    
</ul>    
</details>    


查看 [其他版本](https://github.com/yesmore/OSAPI/releases)



## 🖖 项目简介

> 简介：前后端分离架构的<u>通用性</u>后台管理平台。
>
> 线上地址：http://osapi.aoau.top （登陆账号: admin，密码: 123456）

### 项目特色

- 基于角色控制管理员权限的 **RBAC** 权限管理系统
- 基于 **token** 的鉴权机制
- 可拓展的后台管理模板（例“xxx电商后台管理平台”、“xxx数据管理平台”）

### 开发框架

此项目使用了以下框架：

- 前端框架：**Vue 3.2**、**Element Plus 1.1.0** 
- 后端框架：**Nestjs 7.6**
- 数据库：**MongoDB 4.x** 、**Redis**
- 打包工具：**Vite 2.5** (前端)、**Webpack** (后端)

### 项目截图

<img src='https://cdn.jsdelivr.net/gh/yesmore/img/img/QQ图片20211031161458.png'/>

<div style='display:flex;'><img style='width:270px' src='https://cdn.jsdelivr.net/gh/yesmore/img/img/}@(`7)1CO7)Q(IG{RR1FOG7.png'/><img style='width:270px' src='https://cdn.jsdelivr.net/gh/yesmore/img/img/6]K}FZR84{K5$}`H$DYW177.png'/></div>

<div style='display:flex;'><img style='width:270px' src='https://cdn.jsdelivr.net/gh/yesmore/img/img/3QT3L~T6GZDBQ9F62]Z{[DS.png'/><img style='width:270px' src='https://cdn.jsdelivr.net/gh/yesmore/img/img/D9F0GM}0~WO11)7PJ}@5GHI.png'/></div>

## 快速开始

开始之前，请确保你有以下环境：

- Nodejs 14.x.x
- Npm 6.x
- MongoDB 4.x
- Vue-cli 4.x

## 安装步骤

### 1.克隆仓库

```bash
# git bash
$ git clone git@github.com:yesmore/OSAPI.git
# or http
$ git clone https://github.com/yesmore/OSAPI.git
# or release
```

### 2.安装 & 启动

```bash
# 为了避免不必要的bug，建议先启动后台
$ cd api
$ npm i
# Start Back-end
$ npm run start:dev

$ cd osapi
$ npm i
# Start Front-end
$ npm run dev
```

登录页：

- http://127.0.0.1::4000/#/login

接口：

- http://127.0.0.1:3009

> 前端默认端口为 4000，后端默认端口为 3009， 可自行配置

## 测试

- 未测试



# 📖 开发文档

更多详细配置，请参考 [OSAPI 开发文档](https://github.com/yesmore/OSAPI/blob/dev/Docs.md).



# 贡献者

[@yesmore](https://github.com/yesmore/)

# License

[MIT]()
