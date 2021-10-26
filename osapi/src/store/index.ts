import { InjectionKey } from 'vue'
import { useStore as baseUseStore, createStore, Store } from "vuex";
import { getterLsState } from '../utils/localStorage'

// 为 store state 声明类型
export interface State {
  isLogin: boolean,
  username: string,
}

// 定义Injection Key
export const key: InjectionKey<Store<State>> = Symbol()

// 导出store模块
export const store = createStore<State>({
  state: localStorage.getItem('store') ? getterLsState() : {
    isLogin: false,
    username: '',
  },
  getters: {
    getLoginState: (state:any) => {
      return state.isLogin
    },
    getName: (state:any) => {
      return state.username
    }
  },
  mutations: {
    SET_NAME (state:any, params:string) {
      state.username = params
    },
    SET_LoginState (state:any, params:boolean) {
      state.isLogin = params
    }
  },
  actions: {
  },
  modules: {}
});

// 定义自己的 useStore 组合式函数, 优化store操作
export function useStore () {
  return baseUseStore(key)
}
