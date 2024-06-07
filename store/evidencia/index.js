import moment from "moment"
export const state = () => ({
    evidencias: [],
    hasEvidencias: false,
    updateGet: {
        endpoint: "", 
        data:{},
        share: false,
        formato:[],
        formatos: [],
    }
})

export const getters = {
    getEvidencias: state => state.evidencias,
    showEvidencias: state => state.hasEvidencias,
    //getEvidenciasGroupData: state => state.evidencias,

    getEvidenciasGroupData: state => {
        let todasDatas = state.evidencias.map(ev => moment(ev.data).format("YYYY-MM-DD"));
        let datas = [...new Set(todasDatas)].sort((a, b) => b.localeCompare(a));
        let grupo = {}
        datas.forEach( data => {
            grupo[data] = state.evidencias.filter( ev => moment(ev.data).format("YYYY-MM-DD") === data)
        })
        return grupo
    },
    getUpdate: state => state.updateGet,
}

export const mutations = {
    ADD_EVIDENCIAS(state, evidencias) {
        state.evidencias = evidencias
    },
    SHOW(state, has) {
        state.hasEvidencias = has
    },
    GET(state, get){
        state.updateGet.endpoint = get.endpoint
        state.updateGet.data = get.data
        state.updateGet.share = get.share
        state.updateGet.formato = get.formato
        state.updateGet.formatos = get.formatos
    }
}

export const actions = {
    async setEvidencias({ commit }, evidencias) {
        await commit("ADD_EVIDENCIAS", evidencias)
        await commit("SHOW", true)
    },
    updateEvidenciasFormatos({ state, commit }, { value, formatos }) {
        if (value.length < formatos.length) {
            let evidencias = state.evidencias.filter(ev => value.includes(ev.tipo_Arquivo))
            commit("ADD_EVIDENCIAS", evidencias)
        }
    },
    setEndpoint({commit}, get){
        commit("GET", get)
    }
}