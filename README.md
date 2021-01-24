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

    $ npm install -g yarn

    $ yarn

复制 `env` 文件：

    $ cp .env.example ./.env

在 `.env` 中的填写你自己的 `API_KEY`

然后运行：

    $ yarn start

启动成功后访问

    http://localhost:3000

界面成功显示说明启动成功。

## `.env` 文件

本项目通过环境变量配置 `API_KEY` 及第三方工具，如：百度统计。 您只需要把自己的`key`配置到`.env`文件即可生效。

```
# 必填项（api key 二选一）
# google map api key
REACT_APP_GOOGLE_MAP_KEY=
# baidu api key
REACT_APP_BAIDU_API_KEY=

# 选填
# 转换间隔（单位：毫秒，默认0）
REACT_APP_INRERVAL=
# google analytics
REACT_APP_GOOGLE_ANALYTICS_ID=
# hotjar
REACT_APP_HOTJAR_ID=
# baidu analytics
REACT_APP_BAIDU_ANALYTICS_ID=
# sentry
REACT_APP_SENTRY_KEY=
REACT_APP_SENTRY_ID=
# tucao
REACT_APP_TUCAO_ID=
```

**如果启动成功但是查询失败的话**，请检查自己的`API_KEY`是否正确。确认`API_KEY`是否有`geocoding api`服务的权限。

## 调整转换间隔时间

为了防止并发过高，提供了每条转换后间隔一段时间的功能，可以通过修改`.env`文件中的`REACT_APP_INRERVAL`设置。默认间隔时间为`0ms`
## LICENSE

MIT
