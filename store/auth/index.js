import { getLocalStorage, setLocalStorage } from '@/plugins/local-storage'

export const state = () => ({
    user: {
        perfil: {
            perfil_Data: [],
        },
    },
    token: '',
    status: false,
    startSession: 0,
})

export const mutations = {
    TOKEN(state, payload) {
        state.token = payload
    },
    STATUS(state, payload) {
        state.status = payload
    },
    USER(state, payload) {
        state.user = payload
    },
    SESSAO(state, payload) {
        state.startSession = payload
    }
}
export const getters = {
    getToken: state => state.token,
    getStatus: state => state.status,
    getUser: state => state.user,
    getUserId: state => state.user.iD_Usuario,
    getUserEmpresa: state => state.user?.iD_Empresa,
    getPermission: state => modulo => state.user.perfil.perfil_Data.find(el => el.modulo == modulo),
    getIsGoogleApi: state => {
        if(state.user.empresa.chaveGoogle != ""){
            return true
        }
        return false
    }
}

export const actions = {
    start({ commit }) {
        let token = getLocalStorage("token")
        if (token != "") {
            commit("TOKEN", token)
        }

        let status = getLocalStorage("status")
        if (status != "") {
            commit("STATUS", status)
        }

        let user = getLocalStorage("user")
        if (user != "") {
            commit("USER", user)
        }

        let sessao = getLocalStorage("sessao")
        if (sessao != "") {
            commit("SESSAO", sessao)
        }
    },
    setUser({ commit }, payload) {
        setLocalStorage("user", payload)
        commit("USER", payload)
    },
    setToken({ commit }, payload) {
        setLocalStorage("token", payload)
        commit("TOKEN", payload)
    },
    setStatus({ commit }, payload) {
        setLocalStorage("status", payload)
        commit("STATUS", payload)
    },
    zerar({ commit }) {
        commit("TOKEN", '')
        setLocalStorage("token", '')
        commit("STATUS", false)
        setLocalStorage("status", false)
        commit("USER", {})
        setLocalStorage("user", {})
    },
    setSession({ commit }, payload) {
        setLocalStorage("sessao", payload)
        commit("SESSAO", payload)
    },
    validateSession({ state, dispatch }, payload) {
        let loggedIn = payload - state.startSession
        let timeAllowed = 60 * 60 * 6 // 6horas

        if (loggedIn > timeAllowed) {
            dispatch("setStatus", false);
        }
    },
}