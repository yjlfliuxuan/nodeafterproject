# 项目介绍 nodejs项目
----
## 注册登录页面
#### 主要用到的知识点：jquery ，和HTML5 form表单控件和form表单提交，正则应用，mongodb数据库，bootstrap外部样式库的引用
#### 实现普通用户和管理员的区别
----
## index主页面
#### 主要用到的知识点：ejs模板语言规范渲染和页面公共部分的分离，express框架的引用，还有nodejs的模板对象module.export暴露，路由中间件的使用，还有cookies的获取设置
#### 实现普通用户和管理员登录，主页上用户管理一栏的存在与否
----
## users用户管理页面
#### 主要用到的知识点：ejs模板语言规范渲染和页面公共部分的分离，nodejs的express框架使用，async模块的异步串行无关联使用，还有对mongodb数据库的增删改查的操作，还有对mongodb数据中ObjectId对象的引用操作，bootstrap外部样式库的引用，路由重定向res.redirect()的使用，cookies的获取设置
#### 实现了用户列表的显现，删除，搜索，分页和退出登录
----
## 手机管理页面
#### 主要用到的知识点：jquery，ejs模板语言规范渲染和页面公共部分的分离，express框架的使用，async模块串行无关联的使用，path模块的resolve绝对路径的使用，fs模块的读取写入操作，配合multer模块和mongodb数据库的操作进行图片上传和数据修改
#### 实现了手机列表的显现，新增，删除，修改，分页和退出登录
----
## 品牌管理页面
#### 主要用到的知识点与手机管理页面一样
#### 实现了品牌列表的显现，新增，删除，修改，分页和退出登录

## bug
#### 1.注册时没能在第一时间对用户名唯一检测，只是在提交时才进行了唯一检测
#### 2.用管理页面没有做修改功能