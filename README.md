[![Build Status](https://travis-ci.org/sjfkai/mapLocation.svg?branch=master)](https://travis-ci.org/sjfkai/mapLocation)

# mapLocation

批量转换地址为经纬度 [mapLocation](http://maplocation.sjfkai.com)

## 介绍

一个 `web` 小工具，提供地名批量转换为经纬度，并下载的功能。

基于 [React](https://reactjs.org/) 和 [Ant Design](https://ant.design/)

托管在 [github](http://github.com) 和 [coding](http://coding.net/)（为了百度SEO） 上。

## 本地部署

运行此项目需要 [node.js](https://nodejs.org) 环境。安装方法很多种，如果只是为了运行此项目直接在[官网下载](https://nodejs.org/en/download/)安装即可。如果对 `node.js` 感兴趣，建议使用 [nvm](https://github.com/creationix/nvm)( linux 和 macOS 用户) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) (windows 用户) 安装。

之后打开控制台，在源码根目录运行：

    npm install

或 （如果你用 yarn 的话）

    yarn

复制 `api key` 配置文件：

    cp src/ak.json.example src/ak.json

把 `ak.json` 中的 `key` 改成你自己的

然后运行：

    yarn start

启动成功后访问

    http://localhost:3000

界面成功显示说明启动成功。

**如果启动成功但是查询失败的话**，请检查自己的`ak`是否正确。确认`ak`是否有`geocoding api`服务的权限。

## LICENSE

MIT
