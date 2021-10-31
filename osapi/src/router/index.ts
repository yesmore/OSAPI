import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from "vue-router";
import LayOut from "@/components/layout/index.vue"
import { getterLsState } from '../utils/localStorage'
import { ToolMsg } from "../utils/ToolMsg";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "layout",
    redirect: '/home',
    component: LayOut,
    meta: {
      title: ""
    },
    children: [
      {
        path: '/home',
        name: "Home",
        component: () => import("@/views/Home/index.vue"),
        meta: {
          title: "首页",
          description: '后台管理平台主页'
        },
      },
      {
        path: '/control',
        name: "Control",
        redirect: '/control/focus',
        component: () => import("@/views/Control/index.vue"),
        meta: {
          title: "控制台",
          description: '数据管理概览'
        },
        beforeEnter:(to,from) =>{
          if (!getterLsState().isLogin && (to.path === '/control' || to.path === '/control/focus' || to.path === '/control/dataType' || to.path === '/control/data' || to.path === '/control/dataCate')) {
            ToolMsg('未登陆-路由','warning')
            router.push(from.path)
          }
        },
        children: [
          {
            path: '/control/focus',
            name: "controlFocus",
            meta: {
              title: "首页轮播图",
              description: '首页轮播图数据管理'
            },
            component: () => import("@/views/Control/FocusImg/index.vue"),
          },
          {
            path: '/control/dataType',
            name: "controlDataType",
            meta: {
              title: "数据类型",
              description: '用于管理数据类型'
            },
            component: () => import("@/views/Control/DataTypes/index.vue"),
            children: [
              {
                path: '/control/dataType/attribute',
                name: "controlDataTypeAttribute",
                meta: {
                  title: "数据类型属性设置",
                  description: '用于管理数据类型属性'
                },
                component: () => import("@/views/Control/DataTypes/Attribute.vue"),
              },
            ]
          },
          {
            path: '/control/dataCate',
            name: "controlDataCate",
            meta: {
              title: "数据分类",
              description: '用于管理数据分类'
            },
            component: () => import("@/views/Control/DataCate/index.vue"),
          },
          {
            path: '/control/data',
            name: "controlData",
            meta: {
              title: "数据",
              description: '用于管理数据'
            },
            component: () => import("@/views/Control/Data/index.vue"),
            children: [
              {
                path: '/control/data/detail',
                name: "controlDataDetail",
                meta: {
                  title: "数据详情",
                  description: '管理数据详情'
                },
                component: () => import("@/views/Control/Data/DataDetail.vue"),
              }
            ]
          }
        ]
      },
      {
        path: '/setting',
        name: "setting",
        redirect: '/setting/manager',
        component: () => import("@/views/Setting/index.vue"),
        meta: {
          title: "设置",
          description: '设置概览'
        },
        beforeEnter:(to,from) =>{
          if (!getterLsState().isLogin && (to.path === '/setting' || to.path ===  '/setting/role' || to.path === '/setting/manager' || to.path === '/setting/access')) {
            ToolMsg('未登陆-路由','warning')
            router.push(from.path)
          }
        },
        children: [
          {
            path: '/setting/role',
            name: "settingRole",
            meta: {
              title: "角色设置",
              description: 'RBAC-角色管理、授权'
            },
            component: () => import("@/views/Setting/Role/index.vue"),
          },
          {
            path: '/setting/manager',
            name: "settingManager",
            meta: {
              title: "管理员设置",
              description: 'RBAC-管理员管理'
            },
            component: () => import("@/views/Setting/Manager/index.vue"),
          },
          {
            path: '/setting/manager/update',
            name: "settingManagerUpdate",
            meta: {
              title: "管理员个人中心",
              description: '管理员个人中心'
            },
            component: () => import("@/views/Setting/Manager/Update.vue"),
          },
          {
            path: '/setting/access',
            name: "settingAccess",
            meta: {
              title: "权限设置",
              description: 'RBAC-所有权限列表'
            },
            component: () => import("@/views/Setting/Access/index.vue"),
          },
        ]
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/index.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
