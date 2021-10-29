<div align=center>
    <h1>
        <span style='font-size:40px;font-weight:700;'>👋 OSAPI - 开源Api管理平台</span><br>
         <img src="https://img.shields.io/github/stars/yesmore/OSAPI.svg" alt="star"/>
        <img src="https://img.shields.io/github/package-json/v/yesmore/OSAPI" alt="version"/>
    <img src="https://img.shields.io/github/issues/yesmore/OSAPI" alt="issues"/><br>
     <img src="https://img.shields.io/github/license/yesmore/OSAPI" alt="mit"/>
    </h1>
</div>



<span style='float:right'>**阅读文档**：中文版 | [English](https://github.com/yesmore/OSAPI)</span>

## ⚡️最新版本

### v0.1.0_beta.1

- 更新内容

数据、数据类型、数据分类、角色授权、管理员、权限的增删改查

- 修复 Bug
  

无

- 线上版本：当前最新版已上线




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
- 数据库：**MongoDB 4.x **(typegoose 5.10)、**Redis** (nestjs-redis)
- 打包工具：**Vite 2.5** (前端)、**Webpack** (后端)



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



## 📖 开发文档

更多详细配置，请参考 [OSAPI 开发文档](https://github.com/yesmore/OSAPI/blob/dev/Docs.md).



## 贡献者

[@yesmore](https://github.com/yesmore/)

## License

MIT
