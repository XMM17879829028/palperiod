# 月经周期跟踪应用

这是一个基于Next.js和Supabase构建的月经周期跟踪应用，专为中文用户设计。该应用提供月经周期记录、症状跟踪、周期预测和健康报告生成等功能。

## 功能特点

- 📅 月经周期跟踪与记录
- 📊 经期长度和周期规律性分析
- 🔮 下次经期和排卵期预测
- 🩸 经血量记录
- 😣 症状跟踪与分析
- 📝 健康报告生成
- 🗓️ 日历集成
- 🔔 重要日期提醒
- 🌙 暗色模式支持
- 🔒 用户数据安全保护

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **数据库**: PostgreSQL (通过Supabase)
- **认证**: Supabase Auth
- **样式**: Tailwind CSS
- **日期处理**: date-fns
- **API**: RESTful API设计

## 项目结构

```
/app
  /api             # API端点
    /cycles        # 经期周期管理
    /symptoms      # 症状记录管理
    /calendar      # 日历事件管理
    /predictions   # 周期预测
    /reports       # 健康报告生成
    /settings      # 用户设置管理
  /components      # UI组件
  /lib             # 工具函数库
  /types           # TypeScript类型定义
/public            # 静态资源
/db_schema.sql     # 数据库结构定义
```

## API端点说明

### 1. 经期周期 `/api/cycles`

- `GET` - 获取用户的经期周期记录
- `POST` - 创建新的经期周期记录
- `PUT` - 更新经期周期记录
- `DELETE` - 删除经期周期记录

### 2. 症状记录 `/api/symptoms`

- `GET` - 获取用户的症状记录
- `POST` - 创建新的症状记录
- `PUT` - 批量添加症状记录
- `PATCH` - 更新症状记录
- `DELETE` - 删除症状记录
- `OPTIONS` - 获取预定义症状类别

### 3. 日历事件 `/api/calendar`

- `GET` - 获取用户的日历事件
- `POST` - 创建新的日历事件
- `PUT` - 更新日历事件
- `DELETE` - 删除日历事件
- `PATCH` - 同步经期和预测数据到日历

### 4. 周期预测 `/api/predictions`

- `GET` - 获取用户的周期预测
- `POST` - 自定义预测周期

### 5. 健康报告 `/api/reports`

- `GET` - 获取用户的健康报告

### 6. 用户设置 `/api/settings`

- `GET` - 获取用户设置
- `PUT` - 更新用户设置
- `DELETE` - 重置用户设置为默认值

## 数据库设计

该应用使用PostgreSQL数据库，包含以下表：

1. **settings** - 用户设置
2. **cycles** - 经期周期记录
3. **symptoms** - 症状记录
4. **calendar_events** - 日历事件
5. **predictions** - 预测结果

数据库结构详见 `db_schema.sql` 文件。

## 开始使用

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件，并设置以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 数据库设置

1. 在Supabase控制台中创建新项目
2. 使用 `db_schema.sql` 中的SQL语句创建数据库表

### 启动开发服务器

```bash
npm run dev
```

## 部署

应用可以部署到Vercel：

```bash
npm run build
vercel deploy
```

## 隐私政策

本应用尊重用户隐私，所有数据均存储在用户自己的Supabase数据库中。用户可以随时导出或删除自己的数据。

## 贡献者

欢迎为项目贡献代码，请遵循以下步骤：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 许可证

此项目采用MIT许可证。
