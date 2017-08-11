## 1.5.0
### 因angular aot 优化的原因，package.json module 配置项改变ts

## 1.4.20
### 新增功能
`UiFormsModeule`内，增加新组件
+ `<ui-editor></ui-editor>`

## 1.4.3
### 新增功能
`UiNativeModule`内，增加新组件
+ `<ui-row></ui-row>`
+ `<ui-col></ui-col>`
+ `<ui-scroll></ui-scroll>`

`UiComponentModule`内，增加日历控件

+ `<ui-input type="date"></ui-input>`

## 1.4.0
### 破坏性更改
`UiComponentModule`下的`ui-button`组件改为`ui-loading-button`（原`ui-button`组件移到`UiNativeModule`下）  

### 新增功能
`UiNativeModule`基本功能完成，添加了如下组件及功能：

#### 组件
+ `<ui-native-app></ui-native-app>`
+ `<ui-content></ui-content>`
+ `<ui-footer></ui-footer>`
+ `<ui-header></ui-header>`
+ `<ui-back></ui-back>`
+ `<ui-button></ui-button>`
+ `<ui-title></ui-title>`
+ `<ui-page></ui-page>`
+ `<ui-tab></ui-tab>`
+ `<ui-tab-bar></ui-tab-bar>`
+ `<ui-tab-bar-item></ui-tab-bar-item>`
+ `<ui-tab-view></ui-tab-view>`
+ `<ui-tab-view-item></ui-tab-view-item>`

#### 服务
+ `NavController`

#### 生命周期勾子
+ `OnViewEnter`
+ `OnViewLeave`


## 1.3.0

### 破坏性更改
`ConfirmService`改为`ConfirmController`，且不需要在应用根模块中注册   
`NotifyService`改为`ToastController`，且不需要在应用根模块中注册

### 新增的功能

+ 增加了`<ui-app></ui-app>`组件
+ 增加了NativeModule，（开发中，不可使用）
+ 增加了CHANGELOG.md

## 1.2.2

添加项目在线文档