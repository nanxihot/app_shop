/*
 * @Author: 张闯
 * @Date: 2021-03-11 14:40:32
 * @LastEditors: 张闯
 * @LastEditTime: 2021-03-26 15:55:23
 * @Description:
 * @FilePath: \src\plugins\element.js
 */
import Vue from 'vue'
import {
  Button, Form,
  FormItem, Input,
  Message, Container,
  Main, Aside, Header,
  Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem,
  Card, Row, Col, Switch,
  Table, TableColumn, Tooltip,
  Pagination, Dialog, MessageBox,
  Tag, Tree, Select, Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
