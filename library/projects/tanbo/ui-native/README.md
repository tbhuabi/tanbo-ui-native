# 简介

`@tanbo/ui-native` 是基于 angular 开发的移动端开发框架，支持常见的如路由转场动画、触摸手势、上拉加载、下拉刷新等功能。文档地址：[https://www.tanboui.com/native](https://www.tanboui.com/native)。

### 安装

```bash
npm install @tanbo/ui-native --save
```

## 页面结构

```html
<ui-page>
  <ui-header>
    <!-- 如果不需要头部，ui-header 是可选的 -->
    <ui-navbar>
      <!-- ui-back 组件是可选的，只有在需要返回父页面才声明-->
      <ui-back>返回</ui-back>
      <!-- ui-buttons 组件不是必需的，只有在需要左上角有按扭时才声明-->
      <ui-buttons>
        <button>按扭</button>
      </ui-buttons>
      <!-- 如果需要头部，ui-navbar 是必需的，因为在 webview 全屏的情况下，ui-header 会有 20px 的 padding-top，用来显示手机的状态栏。如果你需要设置整个头部的背景颜色，则应该设置 ui-header 的背景，而不是 ui-navbar -->
      <ui-title>标题<ui-title>
      <!-- ui-buttons 组件不是必需的，只有在需要右上角有按扭时才声明-->
      <ui-buttons>
        <button>按扭</button>
      </ui-buttons>
    </ui-navbar>
  </ui-header>
  <ui-content>
    <!-- ui-content 是必需的，页面的主要内容应该放在这里 -->
    <ui-scroll>
    <!--ui-content 的内容是不可滚动的，如果需要内容可滚动，则需要把内容放在 ui-scroll 内。-->
    </ui-scroll>
  </ui-content>
  <ui-footer>
    <!-- 如果不需要固定底部，ui-footer 是可选的 -->
  </ui-footer>
</ui-page>
```


### 在项目中导入 @tanbo/ui-native

tanbo-ui-native 主要分为三个模块，分别是 `UIComponentsModule`、`UIDirectivesModule`、`UIFormsModule`。
+ `UIComponentsModule` 主要提供了 native 页面常用的 ui 组件
+ `UIDirectivesModule` 主要提供了一些常用指令
+ `UIFormsModule` 主要提供了一些表单组件，及一些表单校验的指令

```typescript
// # app.module.ts 入口模块

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UIComponentsModule, UIDirectivesModule, UIFormsModule } from '@tanbo/ui-native';

import { AppComponent } from './app.component';

@NgModule({
    imports: [
        UIComponentsModule.forRoot(), // 如果是异步模块，如路由模块，请调用 `forChild()` 方法
        UIDirectivesModule,
        UIFormsModule, // UIFormsModule 一定要写在 FormsModule 之前，否则会导致部分校验指令不能正常工作
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
```

```typescript
// # app.component.ts 根组件

import { Component } from '@angular/core';

@Component({
    selector: '<my-app></my-app>',
    template: '<ui-app></ui-app>'
})
export class AppComponent {
}
```


### 在项目中导入 @tanbo/ui-native 的样式表

tanbo-ui-native 的样式表采用 sass 开发，你可以导入 sass 源文件，进行定制化开发，也可以直接导入已编译好的 css 文件。

在 ts 文件中导入编译好的 css 文件
```typescript
// # main.ts
// 按照 angular 项目的约定，在 main.ts 里导入全局样式表
import '@tanbo/ui-native/bundles/index.min.css';
```

在 global.scss 中导入 scss 源文件和字体 css 文件，然后导入 global.scss 到 main.ts
```scss
// # global.scss
@import "~@tanbo/ui-native/assets/scss/varibles";
@import "~@tanbo/ui-native/assets/scss/custom-index";
@import "~@tanbo/ui-native/assets/fonts/style.css";
```
```typescript
// # main.ts
// 按照 angular 项目的约定，在 main.ts 里导入全局样式表
import './global.scss';
```

