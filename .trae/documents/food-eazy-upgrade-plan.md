# Food Eazy 全栈升级改造实施计划

## 仓库调研结论

当前项目为前后端同目录结构：后端入口 `server.js` 及 `routes/models/middleware/config/controllers/scripts/images/paytm` 均位于项目根目录；前端位于 `client/`，使用 React 16 + react-scripts 3 + Material UI 4 + React Router 5 + Context API，组件全部堆在 `components/`，路由在 `App.js`，API 地址写死 Heroku（上一轮已改为同域）。

存在的主要问题：
- 前端构建工具老旧（CRA 3），React 16、react-router-dom 5、axios 0.19、Material UI 4 均为过时版本，构建需要 `--openssl-legacy-provider` 补丁。
- 前端缺少 `@/` 别名，路由未独立成文件夹，页面与组件未拆分，业务逻辑散落在组件内。
- 后端 Express 4.17、Mongoose 5.9 等版本老旧；路由文件同时承担业务逻辑与邮件/上传，缺少 controller 层，没有统一错误处理中间件。
- 后端未收纳到独立目录，与前端 `client/` 平级不符合“前后端分离”约定。
- 邮件 / Cloudinary / PayTM 依赖需保留但应做可降级处理，保证本地功能完整。

## 目标技术栈

### 前端（client/）
- Vite 6 + React 18（函数组件 + Hooks）
- React Router v6
- Ant Design v5（替换 Material UI，统一美观 UI）
- Axios 最新版
- zustand（轻量状态管理，替换 Context 样板）
- `@/` 指向 `client/src`

目录结构：
```
client/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── router/            # 路由配置
    ├── pages/             # 页面级组件
    ├── components/        # 可复用组件（按子目录拆分）
    ├── store/             # zustand store（auth/cart/loading 等）
    ├── api/               # axios 实例与接口方法
    ├── utils/             # 工具方法
    ├── assets/            # 图片等静态资源
    └── styles/            # 全局样式
```

### 后端（server/）
- Node.js + Express 4 最新版、Mongoose 8
- jsonwebtoken、bcryptjs、express-validator、multer、cors、morgan、dotenv
- nodemailer（SendGrid 可选）、cloudinary（可选）、paytm checksum（保留）
- CommonJS，现代语法（async/await、解构、可选链）

目录结构：
```
server/
├── package.json
├── server.js              # 入口
├── .env / .env.sample
├── config/                # db.js、常量
├── controllers/           # 各模块控制器（提取路由逻辑）
├── middleware/            # auth、error handler、upload
├── models/                # Mongoose 模型
├── routes/                # 路由（仅挂载控制器）
├── services/              # 邮件、支付等服务（可选）
├── utils/                 # 通用工具
├── images/                # 菜品图片静态目录
├── paytm/                 # paytm 校验和工具
└── scripts/seed.js        # 种子脚本
```

## 需要改动的文件与模块

### 新建（前端）
- `client/index.html`、`client/vite.config.js`（配置 `@/` 别名、server 代理）
- `client/package.json`（Vite + React 18 + antd5 + axios + zustand）
- `client/src/main.jsx`、`client/src/App.jsx`
- `client/src/router/index.jsx`（路由表 + 守卫）
- `client/src/pages/*.jsx`（Auth、Menu、Cart、Checkout、Order、Verify、Forget、Reset、Success、Fail、Contact、AddProduct、DeleteItems、NotFound）
- `client/src/components/{layout,DishCard,CartItem,...}`（拆分通用组件）
- `client/src/api/{request,auth,items,cart,order,admin}`（axios 实例 + 接口封装）
- `client/src/store/{auth,cart,loading}.js`
- `client/src/utils/*`

### 新建/迁移（后端）
- 全部后端文件迁入 `server/`
- `server/package.json`（升级依赖）
- `server/server.js`（入口，统一挂载路由、错误中间件、托管前端 dist）
- `server/config/db.js`（mongoose 8 连接）
- `server/controllers/*`（authController、orderController、adminController、cartController、paymentController、userController）
- `server/middleware/auth.js`、`errorHandler.js`、`upload.js`
- `server/models/*`（保持字段兼容）
- `server/routes/*`（薄路由）
- `server/services/mail.js`、`cloudinary.js`（可选降级）
- `server/scripts/seed.js`（升级）

### 删除
- 旧 `client/src`（全部重写）
- 根目录 `server.js`、`routes/`、`models/`、`middleware/`、`controllers/`、`config/`（迁入 server 后删除）
- 根目录 `node_modules/`、`package.json`、`package-lock.json`（改由根级聚合 scripts 或各自独立）
- 无用的 `paytm/.DS_Store`、各 `.DS_Store`、旧 `build/`、`readme_images`（如不再用于 README 可删）

### 更新
- 根目录 `README.md`（中文，更新技术栈、目录、接口、启动方式、Git 地址）
- `.gitignore`、`.dockerignore`、`Dockerfile`（多阶段构建 client + server）
- 根目录保留一个聚合 `package.json`（含 dev/build/seed 脚本，使用 concurrently 启动前后端），或在根 README 说明分别启动。决定：根目录保留聚合 package.json 方便一键启动。

## 实施步骤（按依赖顺序）

1. **清理与目录准备**：删除旧前端 src、旧根目录后端文件（保留 images、paytm checksum、seed 逻辑、models 字段），创建 `server/` 与新的 `client/src` 目录骨架。
2. **后端迁移升级**：
   - 建立 `server/package.json`，升级依赖到最新版。
   - 迁移 models（字段保持兼容），重写 `config/db.js`（mongoose 8）。
   - 编写 `middleware/errorHandler.js`、`auth.js`、`upload.js`。
   - 编写 controllers，将各 routes 中的业务逻辑提取到 controller。
   - 编写 services（邮件 / cloudinary / paytm），保留未配置时的降级。
   - 编写 routes 仅调用 controller。
   - 编写 `server.js` 入口，挂载路由、错误中间件、静态资源与 SPA 回退。
   - 迁移 `scripts/seed.js`，使用新路径。
3. **前端重写**：
   - 初始化 Vite + React 18，配置 `@/` 别名与代理。
   - 编写 `api/request.js`（axios 实例、token 注入、错误处理）。
   - 编写 `store/auth.js`、`store/cart.js`。
   - 编写 `router/index.jsx`（路由表与登录/管理员守卫）。
   - 编写 pages 与 components，使用 Ant Design v5 组件。
   - 接入接口，实现完整业务链路。
4. **聚合脚本与构建**：根目录 `package.json` 提供 `dev`、`build`、`seed`、`start` 脚本；Dockerfile 多阶段构建。
5. **验证**：
   - `npm install`（根 + client + server）。
   - `npm run build`（前端能产出 dist）。
   - `npm run seed`（写入演示账号与菜品）。
   - `npm start`（后端启动，托管 dist）。
   - 浏览器端到端验证：登录 → 菜品列表 → 加入购物车 → 结算下单 → 订单详情 → 管理员新增/删除菜品。
6. **README 更新**：中文，包含 Git 地址、技术栈、目录结构、接口清单、启动方式、演示账号、可选服务说明。

## 依赖与注意事项

- 端口：macOS AirPlay 占用 5000，后端使用 5050，前端 Vite 使用 5173 并代理 `/api`、`/images` 到 5050。
- 数据库：复用已运行的 MongoDB 容器（27017），库名 `foodeazy`。
- 数据兼容：models 字段保持与现有数据库一致，避免种子数据不兼容。
- 邮件 / Cloudinary / PayTM：保留可选降级，无配置时不影响注册、下单、图片上传（图片存本地）。
- Ant Design v5 与 React 18 兼容；React Router v6 路由写法需用 `createBrowserRouter` 或 `Routes/Route`。
- `@/` 别名需在 `vite.config.js` 与（如使用）jsconfig.json 中配置。
- 构建产物：Vite 输出到 `client/dist`，后端 `server.js` 托管该目录。

## 验证清单

- [ ] 后端 `npm run seed` 成功，账号/菜品可查。
- [ ] 前端 `npm run build` 成功无报错。
- [ ] 服务启动后 `/` 返回 SPA，`/api/items` 返回菜品。
- [ ] 普通用户登录、浏览菜品、加购、结算（货到付款）、查看订单成功。
- [ ] 管理员登录后可见并使用“新增菜品 / 删除菜品”。
- [ ] 未配置 SendGrid / Cloudinary / PayTM 时相关流程仍可用（验证码日志 / 本地图片 / 货到付款）。
- [ ] 非管理员不可见管理员入口。

## 风险与应对

- **依赖安装慢/失败**：使用 `registry.npmmirror.com` 镜像。
- **Ant Design v5 按需引入**：Vite 无需 babel-plugin-import，直接全量引入；如体积过大再优化。
- **Mongoose 8 连接参数变化**：移除 `useFindAndModify`/`useCreateIndex`，仅保留 `useNewUrlParser` 外的必要项（mongoose 8 默认即可）。
- **React Router v6 守卫写法**：用自定义 `<RequireAuth>` 组件包裹路由。
- **旧数据库字段差异**：种子脚本 upsert 以邮箱/菜名去重，避免重复。
- **端到端验证受环境限制**：核心接口先通过 curl 验证，再用浏览器验证关键页面。
