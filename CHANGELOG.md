### 2.2.5
添加根据不同的运行环境，如：iphoneX、android、iphone678头部高度自动扩展的判断。
ui-app 组件，添加版本号
导出版本号

### 2.2.0

#### 功能更改
UIComponentsModule 添加 forRoot、forChild 方法，主要用于修复 UIComponentsModule 的 provide 在多模块情况下，不能保持全局单例的问题  

#### bug 修复
全局引入 tanbo-ui-native.min.css 时，找不到 icon 字体。

### 2.1.3

修复异步模块点击后退，不能冒泡到根组件的问题

### 2.1.0

angular 更新到 @^5.0.0