# Tasks

## Phase 1: 代码重复消除 (P0)

- [x] Task 1: 统一五行元素工具函数
  - [x] SubTask 1.1: 分析现有 getElementColor 函数的所有定义位置
  - [x] SubTask 1.2: 在 `src/utils/elementHelper.ts` 中创建统一的 getElementColor 函数
  - [x] SubTask 1.3: 在 `src/utils/elementHelper.ts` 中创建统一的 getElementMeta 函数
  - [x] SubTask 1.4: 在 `src/utils/elementHelper.ts` 中创建统一的 getElementIconDataUri 函数
  - [x] SubTask 1.5: 更新 DetailPage.tsx 使用统一工具函数
  - [x] SubTask 1.6: 更新 ResultPage.tsx 使用统一工具函数
  - [ ] SubTask 1.7: 更新 ProPage.tsx 使用统一工具函数
  - [x] SubTask 1.8: 删除各页面中重复的工具函数定义

- [x] Task 2: 统一日期解析函数
  - [x] SubTask 2.1: 在 `src/utils/dateHelpers.ts` 中创建统一的 parseDateTime 函数
  - [x] SubTask 2.2: 更新 DetailPage.tsx 使用统一函数
  - [x] SubTask 2.3: 更新 ResultPage.tsx 使用统一函数
  - [x] SubTask 2.4: 删除各页面中重复的 parseDateTime 定义

- [x] Task 3: 统一藏干获取函数
  - [x] SubTask 3.1: 在 `src/utils/hiddenStems.ts` 中创建统一的 getHiddenStems 函数
  - [x] SubTask 3.2: 更新 ResultPage.tsx 使用统一函数
  - [x] SubTask 3.3: 删除 ResultPage.tsx 中重复的 getHiddenStems 定义

## Phase 2: 共享组件提取 (P1)

- [x] Task 4: 提取用户头像组件
  - [x] SubTask 4.1: 创建 `src/components/shared/Avatar.tsx` 组件
  - [x] SubTask 4.2: 定义 AvatarProps 接口
  - [x] SubTask 4.3: 实现头像加载失败降级逻辑
  - [ ] SubTask 4.4: 更新 DetailPage.tsx 使用 Avatar 组件
  - [ ] SubTask 4.5: 更新 ResultPage.tsx 使用 Avatar 组件
  - [ ] SubTask 4.6: 更新 ProPage.tsx 使用 Avatar 组件

- [x] Task 5: 提取头部信息卡片组件
  - [x] SubTask 5.1: 创建 `src/components/shared/HeaderCard.tsx` 组件
  - [x] SubTask 5.2: 定义 HeaderCardProps 接口
  - [x] SubTask 5.3: 实现头部信息展示逻辑
  - [ ] SubTask 5.4: 更新 DetailPage.tsx 使用 HeaderCard 组件
  - [ ] SubTask 5.5: 更新 ResultPage.tsx 使用 HeaderCard 组件
  - [ ] SubTask 5.6: 更新 ProPage.tsx 使用 HeaderCard 组件

- [ ] Task 6: 提取四柱表格组件
  - [ ] SubTask 6.1: 创建 `src/components/shared/PillarTable.tsx` 组件
  - [ ] SubTask 6.2: 定义 PillarTableProps 接口
  - [ ] SubTask 6.3: 实现表格行渲染逻辑
  - [ ] SubTask 6.4: 更新 DetailPage.tsx 使用 PillarTable 组件

## Phase 3: 类型定义完善 (P1)

- [ ] Task 7: 完善共享类型定义
  - [ ] SubTask 7.1: 在 `src/types/bazi.ts` 中添加 BaziColumn 接口
  - [ ] SubTask 7.2: 在 `src/types/bazi.ts` 中添加 BaseInfo 接口
  - [ ] SubTask 7.3: 更新 DetailPage.tsx 使用共享类型
  - [ ] SubTask 7.4: 更新 ResultPage.tsx 使用共享类型

- [x] Task 8: 优化组件 Props 类型
  - [x] SubTask 8.1: 为 Avatar 组件定义严格的 Props 类型
  - [x] SubTask 8.2: 为 HeaderCard 组件定义严格的 Props 类型
  - [ ] SubTask 8.3: 为 PillarTable 组件定义严格的 Props 类型

## Phase 4: 样式统一 (P2)

- [ ] Task 9: 迁移内联样式至 Tailwind CSS
  - [ ] SubTask 9.1: 分析 Sidebar.tsx 内联样式
  - [ ] SubTask 9.2: 将 Sidebar.tsx 内联样式迁移为 Tailwind 类名
  - [ ] SubTask 9.3: 分析 InputPage.tsx 内联样式
  - [ ] SubTask 9.4: 将 InputPage.tsx 内联样式迁移为 Tailwind 类名

- [ ] Task 10: 优化样式常量管理
  - [ ] SubTask 10.1: 审查 `src/styles/constants.ts` 使用情况
  - [ ] SubTask 10.2: 将常用样式常量迁移至 Tailwind 配置
  - [ ] SubTask 10.3: 更新组件使用新的样式方案

## Phase 5: 测试覆盖 (P2)

- [ ] Task 11: 完善工具函数测试
  - [ ] SubTask 11.1: 为 `elementHelper.ts` 编写单元测试
  - [ ] SubTask 11.2: 为 `dateHelpers.ts` 编写单元测试
  - [ ] SubTask 11.3: 为 `hiddenStems.ts` 编写单元测试

- [ ] Task 12: 添加组件测试
  - [ ] SubTask 12.1: 为 Avatar 组件编写测试
  - [ ] SubTask 12.2: 为 HeaderCard 组件编写测试
  - [ ] SubTask 12.3: 为 PillarTable 组件编写测试

## Phase 6: 验证与文档 (P2)

- [ ] Task 13: 功能验证
  - [ ] SubTask 13.1: 运行 `bun run lint` 确保无 lint 错误
  - [ ] SubTask 13.2: 运行 `bun run build` 确保构建成功
  - [ ] SubTask 13.3: 运行 `bun run dev` 验证功能正常

- [ ] Task 14: 代码审查
  - [ ] SubTask 14.1: 检查所有重构文件是否符合项目规范
  - [ ] SubTask 14.2: 确认无遗留的重复代码
  - [ ] SubTask 14.3: 确认类型定义完整

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 1, Task 7]
- [Task 7] depends on [Task 1]
- [Task 8] depends on [Task 4, Task 5, Task 6]
- [Task 9] depends on [Task 4, Task 5, Task 6]
- [Task 10] depends on [Task 9]
- [Task 11] depends on [Task 1, Task 2, Task 3]
- [Task 12] depends on [Task 4, Task 5, Task 6]
- [Task 13] depends on [Task 1-12]
- [Task 14] depends on [Task 13]
