import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'

// 引入全局样式
import 'animate.css'
import './assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/display.css';
import './assets/css/common.css'//全局样式

// 引入mavon-editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 引入infiniteScroll
import infiniteScroll from 'vue-infinite-scroll'

// 引入音乐播放器
import APlayer from '@moefe/vue-aplayer';



// 按需引入element ui
import {
  Autocomplete,
  Aside,
  Avatar,
  Backtop,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CollapseItem,
  Collapse,
  Carousel,
  CarouselItem,
  Card,
  Col,
  Container,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DatePicker,
  Dialog,
  Divider,
  Form,
  FormItem,
  Icon,
  Input,
  Image,
  Main,
  Message,
  MessageBox,
  Menu,
  MenuItem,
  MenuItemGroup,
  Notification,
  Option,
  Popconfirm,
  Pagination,
  Popover,
  Row,
  RadioGroup,
  Radio,
  RadioButton,
  Select,
  Submenu,
  Steps,
  Step,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tag,
  Timeline,
  TimelineItem,
  Tooltip,
  Upload
} from 'element-ui';





// 注册全局组件
Vue.component(Menu.name, Menu);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Submenu.name, Submenu);
Vue.component(Icon.name, Icon);
Vue.component(Input.name, Input);
Vue.component(Image.name, Image);
Vue.component(Pagination.name, Pagination);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Button.name, Button);
Vue.component(Card.name, Card);
Vue.component(Tag.name, Tag);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Container.name, Container);
Vue.component(Aside.name, Aside);
Vue.component(MenuItemGroup.name, MenuItemGroup);
Vue.component(Avatar.name, Avatar);
Vue.component(Steps.name, Steps);
Vue.component(Step.name, Step);
Vue.component(Timeline.name, Timeline);
Vue.component(TimelineItem.name, TimelineItem);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Radio.name, Radio);
Vue.component(Dialog.name, Dialog);
Vue.component(Option.name, Option);
Vue.component(Select.name, Select);
Vue.component(Message.name, Message);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(BreadcrumbItem.name, BreadcrumbItem);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Divider.name, Divider);
Vue.component(Upload.name, Upload);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(CarouselItem.name, CarouselItem);
Vue.component(Carousel.name, Carousel);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(Dropdown.name, Dropdown);
Vue.component(RadioButton.name, RadioButton);
Vue.component(Main.name, Main);
Vue.component(Backtop.name, Backtop);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Popover.name, Popover);
Vue.component(CollapseItem.name, CollapseItem);
Vue.component(Collapse.name, Collapse);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(MessageBox.name, MessageBox);
Vue.component(Autocomplete.name, Autocomplete);


// 注册mavonEditor
Vue.use(mavonEditor)
// 注册infiniteScroll
Vue.use(infiniteScroll)

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm;

// 注册音乐播放器
Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: true,
});




Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  }
}).$mount('#app')
