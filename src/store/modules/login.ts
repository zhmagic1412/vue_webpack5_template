import { Module } from 'vuex';
import { IGlobalState, ILoginState } from '../types';

const store:Module<ILoginState, IGlobalState> = {
    namespaced: true, // 开启命名空间
    state: {
        username: 'ADMIN',//md5加密过的,
        token: '',//每个请求头中需要带token,
        refreshToken: '',//更新token使用的，
        idCard:'' ,//用户身份证号
        tokenType:'' 
    },
    getters: {
        'USERNAME': (state): string => state.username
    },
    mutations: {
        'USERNAME': (state, payload: string) => state.username = payload
    },
    actions: {}
}
export default store
