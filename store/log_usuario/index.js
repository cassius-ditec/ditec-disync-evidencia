import moment from "moment"

export const state = () => ({
    log_usuarios: [],
    hasLogUsuarios: false,
    updateGet: {endpoint: "", data:{}}
})

export const getters = {
    getLogUsuarios: state => { return state.log_usuarios},
    showLogUsuarios: state => state.hasLogUsuarios,

    getLogUsuariosGroupData: state => {
        let todasDatas = state.log_usuarios.map(ev => moment(ev.data).format("YYYY-MM-DD"));
        let datas = [...new Set(todasDatas)].sort((a, b) => b.localeCompare(a));
        let grupo = {}
        datas.forEach( data => {
            grupo[data] = state.log_usuarios.filter( ev => moment(ev.data).format("YYYY-MM-DD") === data)
        })
        return grupo
    }
}

export const mutations = {
    ADD_LOGUSUARIO(state, log_usuarios) {
        state.log_usuarios = log_usuarios
    },
    SHOW(state, has) {
        state.hasLogUsuarios = has
    },
}

export const actions = {
    async setLogUsuarios({ commit }, log_usuarios) {
        await commit("ADD_LOGUSUARIO", log_usuarios)
        await commit("SHOW", true)
    },

    /*
    updateEvidenciasCaso({ state, commit }, caso) {
        if (caso > 0) {
            let evidencias = state.evidencias.filter(ev => ev.iD_Caso == caso)
            commit("ADD_EVIDENCIAS", evidencias)
        }
    },
    updateEvidenciasFormatos({ state, commit }, { value, formatos }) {
        if (value.length < formatos.length) {
            let evidencias = state.evidencias.filter(ev => value.includes(ev.tipo_Arquivo))
            commit("ADD_EVIDENCIAS", evidencias)
        }
    },
    */
}