# Frontend Refactor Checklist

## Phase 1: 代码重复消除

- [x] 五行元素工具函数已统一至 `src/utils/elementHelper.ts`
- [x] `getElementColor` 函数在所有页面中使用统一版本
- [x] `getElementMeta` 函数在所有页面中使用统一版本
- [x] `getElementIconDataUri` 函数在所有页面中使用统一版本
- [x] DetailPage.tsx 中无重复的工具函数定义
- [x] ResultPage.tsx 中无重复的工具函数定义
- [ ] ProPage.tsx 中无重复的工具函数定义
- [x] `parseDateTime` 函数已统一至 `src/utils/dateHelpers.ts`
- [x] `getHiddenStems` 函数已统一至 `src/utils/hiddenStems.ts`

## Phase 2: 共享组件提取

- [x] `src/components/shared/Avatar.tsx` 组件已创建
- [x] Avatar 组件支持加载失败降级
- [ ] DetailPage.tsx 使用 Avatar 组件
- [ ] ResultPage.tsx 使用 Avatar 组件
- [ ] ProPage.tsx 使用 Avatar 组件
- [x] `src/components/shared/HeaderCard.tsx` 组件已创建
- [x] HeaderCard 组件正确展示用户信息
- [ ] DetailPage.tsx 使用 HeaderCard 组件
- [ ] ResultPage.tsx 使用 HeaderCard 组件
- [ ] ProPage.tsx 使用 HeaderCard 组件
- [ ] `src/components/shared/PillarTable.tsx` 组件已创建
- [ ] PillarTable 组件正确渲染四柱数据
- [ ] DetailPage.tsx 使用 PillarTable 组件

## Phase 3: 类型定义完善

- [ ] `src/types/bazi.ts` 包含 BaziColumn 接口
- [ ] `src/types/bazi.ts` 包含 BaseInfo 接口
- [ ] DetailPage.tsx 使用共享类型定义
- [ ] ResultPage.tsx 使用共享类型定义
- [x] 所有组件 Props 有明确的接口定义
- [ ] 代码中无 any 类型使用

## Phase 4: 样式统一

- [ ] Sidebar.tsx 内联样式已迁移至 Tailwind CSS
- [ ] InputPage.tsx 内联样式已迁移至 Tailwind CSS
- [ ] 样式常量已迁移至 Tailwind 配置或 CSS 变量
- [ ] 所有组件使用统一的样式方案

## Phase 5: 测试覆盖

- [ ] `elementHelper.test.ts` 测试文件已创建
- [ ] `dateHelpers.test.ts` 测试文件已创建
- [ ] `hiddenStems.test.ts` 测试文件已创建
- [ ] `Avatar.test.tsx` 测试文件已创建
- [ ] `HeaderCard.test.tsx` 测试文件已创建
- [ ] `PillarTable.test.tsx` 测试文件已创建
- [ ] 核心业务逻辑测试覆盖率 >= 80%

## Phase 6: 验证与文档

- [x] `bun run lint` 执行无错误
- [x] `bun run build` 执行成功
- [ ] `bun run dev` 启动正常
- [ ] 所有页面功能正常
- [x] 无遗留的重复代码（DetailPage、ResultPage已清理）
- [ ] 类型定义完整
- [ ] 代码符合项目规范

## 最终验收

- [ ] 代码结构清晰，模块边界明确
- [ ] 可维护性强，易于理解
- [ ] 扩展性良好，支持新功能开发
- [ ] 测试覆盖完善，保障代码质量
