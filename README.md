# Food Eazy

项目地址：<https://github.com/rick-peng-li/FoodEazy-web>

Food Eazy 是一个在线点餐平台，支持菜品浏览、搜索排序、购物车、结算下单（外卖/自取、货到付款/在线支付）、订单查询，以及管理员新增/删除菜品。项目采用前后端分离架构：前端使用 Vite + React + Ant Design，后端使用 Node.js + Express + MongoDB，生产环境由后端托管前端构建产物。

## 技术架构

### 前端（client/）

| 技术 | 说明 |
| --- | --- |
| Vite 6 | 构建工具，替代老旧的 Create React App |
| React 18 | 函数组件 + Hooks |
| React Router 6 | 路由，集中在 `src/router` |
| Ant Design 5 | UI 组件库，统一视觉风格 |
| Axios | HTTP 请求，统一封装与错误处理 |
| Zustand | 轻量状态管理（auth、cart） |

目录结构：

```text
client/
├── index.html
├── vite.config.js          # @/ 别名 + 代理到后端
├── jsconfig.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── router/             # 路由表与守卫
    ├── pages/              # 页面级组件
    ├── components/         # 可复用组件（layout、DishCard、CartItem、路由守卫）
    ├── store/              # zustand 状态
    ├── api/                # axios 实例与接口方法
    └── utils/
```

### 后端（server/）

| 技术 | 说明 |
| --- | --- |
| Node.js + Express 4 | 服务框架 |
| Mongoose 8 | MongoDB ODM |
| jsonwebtoken + bcryptjs | 鉴权与密码加密 |
| express-validator | 参数校验 |
| Multer | 图片上传 |
| nodemailer + SendGrid | 邮件（可选） |
| Cloudinary | 图片云存储（可选） |
| PayTM Checksum | 在线支付（可选） |

目录结构：

```text
server/
├── server.js               # 入口
├── package.json
├── .env / .env.sample
├── config/                 # 数据库连接
├── controllers/            # 业务逻辑（auth、admin、cart、order、items、paytm）
├── middleware/             # auth、errorHandler、upload
├── models/                 # user、product、order、forget
├── routes/                 # 薄路由，仅挂载控制器
├── services/               # mail、cloudinary
├── utils/
├── images/                 # 菜品图片静态目录
├── paytm/                  # PayTM 校验和工具
└── scripts/seed.js         # 初始化演示账号与菜品
```

## 页面与路由

| 路由 | 页面 | 权限 |
| --- | --- | --- |
| `/` | 菜品首页（搜索/排序） | 登录且已验证 |
| `/auth` | 登录 / 注册 | 公开 |
| `/verify` | 邮箱验证码验证 | 公开 |
| `/forget` | 忘记密码 | 公开 |
| `/forget/:code` | 重置密码 | 公开 |
| `/cart` | 购物车 | 登录 |
| `/checkout` | 结算 | 登录 |
| `/success` | 下单成功 | 公开 |
| `/fail` | 支付失败 | 公开 |
| `/order` | 我的订单 | 登录 |
| `/addproduct` | 新增菜品 | 管理员 |
| `/deleteitems` | 删除菜品 | 管理员 |
| `/contact` | 关于与联系方式 | 公开 |

## 接口说明

统一前缀 `/api`，需登录接口通过请求头 `x-auth-token` 携带 JWT。

### 账号

| 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| POST | `/api/register` | 注册 | 否 |
| POST | `/api/login` | 登录 | 否 |
| GET | `/api/login` | 当前用户信息 | 是 |
| POST | `/api/verify` | 校验验证码 | 否 |
| POST | `/api/resend` | 重发验证码 | 否 |
| POST | `/api/forget` | 发送重置链接 | 否 |
| GET | `/api/reset?code=` | 校验重置链接 | 否 |
| POST | `/api/reset` | 重置密码 | 否 |

### 菜品

| 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| GET | `/api/items` | 菜品列表 | 否 |
| GET | `/api/admin/items` | 管理端菜品列表 | 否 |
| POST | `/api/admin/upload` | 新增菜品（multipart） | 是，管理员 |
| POST | `/api/admin/items` | 删除菜品 | 是，管理员 |

### 购物车 / 订单 / 支付

| 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| GET | `/api/cart` | 读取购物车 | 是 |
| POST | `/api/cart` | 保存购物车 | 否 |
| PUT | `/api/cart` | 清空购物车 | 是 |
| POST | `/api/orders` | 创建订单 | 是 |
| GET | `/api/orders?orderid=` | 订单详情 | 否 |
| GET | `/api/get_orders` | 当前用户订单 | 是 |
| POST | `/api/paytm` | 发起 PayTM 支付 | 是 |
| POST | `/api/paytm/success` | PayTM 回调 | 否 |

### 静态资源

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/images/:file` | 菜品与本地上传图片 |

## 环境变量

复制 `server/.env.sample` 为 `server/.env` 后按需修改：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `5050` | 服务端口 |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/foodeazy` | MongoDB 地址 |
| `JWT_SECRET` | `food_eazy_dev_secret` | JWT 密钥 |
| `PUBLIC_BASE_URL` | `http://localhost:5050` | 邮件链接与支付回调地址 |
| `SEND_GRID_KEY` | 空 | SendGrid 密钥，留空跳过邮件 |
| `CLOUDINARY_CLOUD_NAME` | 空 | Cloudinary 云名称 |
| `CLOUDINARY_API_KEY` | 空 | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | 空 | Cloudinary API Secret |
| `PAYTM_MERCHANT_ID` | 空 | PayTM 商户号 |
| `PAYTM_MERCHANT_API_KEY` | 空 | PayTM 商户密钥 |

前端通过 `client/vite.config.js` 的代理将 `/api`、`/images` 转发到后端，无需额外配置。生产环境前端与后端同域。

## 快速开始

### 前置条件

- Node.js 18 及以上
- MongoDB（本地或 Docker）

### 一键安装与启动

```bash
# 安装根、前端、后端依赖
npm run install:all

# 初始化演示账号与菜品
npm run seed

# 构建前端（产出 client/dist，由后端托管）
npm run build

# 启动后端服务
npm start
```

打开 <http://localhost:5050>。

### 开发模式（前后端热更新）

```bash
npm run dev
```

后端运行在 5050，前端 Vite 开发服务器运行在 5174（自动代理到后端）。

### Docker 运行

```bash
docker build -t food-eazy .
docker run -d --name food-eazy \
  -p 5050:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/foodeazy \
  food-eazy
docker exec food-eazy node scripts/seed.js
```

## 演示账号

| 角色 | 邮箱 | 密码 |
| --- | --- | --- |
| 管理员 | `admin@foodeazy.com` | `Admin@123` |
| 普通用户 | `user@foodeazy.com` | `User@123` |

## 可选服务降级说明

- **邮件**：未配置 `SEND_GRID_KEY` 时，注册会自动通过邮箱验证，验证码打印在服务端日志；订单确认邮件被跳过。
- **图片上传**：未配置 Cloudinary 时，图片保存到 `server/images/`，通过 `/images/文件名` 访问。
- **在线支付**：未配置 PayTM 商户参数时，请选择“货到付款”；选择 PayTM 会提示支付未配置。
