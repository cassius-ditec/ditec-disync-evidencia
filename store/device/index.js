export const state = () => ({
    center: {
        lat: -27.8043641,
        lng: -50.399732,
    },
    devices: [],
    unidades: [],
    enderecos: [],
    detalhe: {
        show: false,
        device: {}
    },
    cameras: [],
})


function deviceNull(device) {
    return {
        "_id": "0",
        "IMEI": device.IMEI,
        "DEVID": device.IMEI,
        "SW_VER": "1.0.5_8",
        "DATE": "0",
        "TIME": "0",
        "MSGTYPE": 2,
        "CTRLMSG": 0,
        "CTRLRETURN": "1",
        "DATA": null,
        "LAT": "0",
        "LON": "0",
        "SPEED": "0",
        "ALTITUDE": 0,
        "COURSE": "0",
        "DATA_VALIDITY": "V",
        "SIGNAL": 0,
        "POWER": 0,
        "STATUS": "OFF-LINE",
        "AGENTID": device.IMEI,
        "AGENTE": "SEM COMUNICAÇÃO",
        "DATE_TIME_GPS": 0,
        "DATE_TIME_REC": 0,
        "ADDRESS": "",
        "ADDRESS_DETAIL": {
            "house_number": null,
            "road": null,
            "suburb": null,
            "city": null,
            "municipality": null,
            "region": null,
            "state": null,
            "postcode": null,
            "country": null,
            "country_code": null
        },
        "CAMERA": {},
        "AGENTE_DADOS": null,
        "GRUPOS": null,
        "URL_VIDEO": ""
    }
}

export const getters = {
    initCanvas: state => state.devices.every(el => el.listen && el.listen._id),

    getDevices: state => state.devices,
    getDeviceWithLocation: state => state.devices.filter(el => {
        let mapa = el.mapa;
        let status = el.status
        return mapa && status && status.equipamentoLigado && typeof mapa.lat === 'number' && typeof mapa.lng === 'number' && mapa.lat !== 0 && mapa.lng !== 0;
    }),
    getCameras: state => state.cameras,
    getDeviceImei: state => imei => state.devices.find(el => el.IMEI == imei),
    getDevicesOn: state => state.devices.filter((el) => el.agruparPor.ligado),
    getDevicesOff: state => state.devices.filter((el) => !el.agruparPor.ligado),
    getDevicesUnidade: state => unidade => state.devices.filter(el => el.agruparPor.unidade == unidade),
    getDevicesEndereco: state => endereco => state.devices.filter(el => el.agruparPor.endereco == endereco),
    center: state => state.center,
}

export const mutations = {
    SET_CENTER(state, {lat,lng}){
        state.center = {lat,lng}
    },
    ADD_DEVICE(state, device) {
        let d = { ...device, listen: {}, status: {}, agruparPor: {}, mapa: {} }
        state.devices.push(d)
    },
    UPDATE_LISTEN(state, { indexDevice, findDevice, listen }) {
        if (listen._id === null) listen = deviceNull(listen)
        state.devices[indexDevice].listen = listen
        state.devices[indexDevice].status = {
            equipamentoLigado: listen.STATUS !== "OFF-LINE",
            gps: listen.SIGNAL,
            gpsLigado:
                listen.STATUS != "OFF-LINE" &&
                listen.LAT !== 0 &&
                listen.LON !== 0 &&
                listen.SIGNAL > 0,
            streaming: ["START_VEO_STRM", "START_VEO_REC_STRM", "START_VEO_REC"].includes(listen.STATUS) ? true : false,
            gravacao: ["START_REC_SUCCESS", "START_VEO_REC", "START_VEO_REC_STRM"].includes(listen.STATUS) ? true : false,
            bateria: `${listen.POWER}%`,
            bateriaEm: listen.POWER <= 15 ? "low" : "high",
        }
        state.devices[indexDevice].agruparPor = {
            ligado: listen.STATUS !== "OFF-LINE",
            unidade: listen.GRUPOS ? listen.GRUPOS[0].Nome : "DESVINCULADO",
            endereco: listen.ADDRESS_DETAIL.road || "Endereço desconhecido",
        },
            state.devices[indexDevice].mapa = {
                lat: parseFloat(listen.LAT),
                lng: parseFloat(listen.LON),
                center: false,
                on: listen.STATUS != "OFF-LINE",
            }
    },
    UPDATE_UNIDADES(state) {
        let unidades = state.devices
            .map((el) => el.agruparPor.unidade)
            .filter((un) => un !== undefined)
        state.unidades = Array.from(new Set(unidades)).sort((a, b) => {
            if (a === "DESVINCULADO") return 1;
            if (b === "DESVINCULADO") return -1;
            return a.localeCompare(b);
        });
    },
    UPDATE_ENDERECOS(state) {
        let enderecos = state.devices
            .map((el) => el.agruparPor.endereco)
            .filter((end) => end !== undefined);
        state.enderecos = Array.from(new Set(enderecos)).sort((a, b) => {
            if (a === "Endereço desconhecido") return 1;
            if (b === "Endereço desconhecido") return -1;
            return a.localeCompare(b);
        });
    },
    SET_DETALHE(state, detalhe) {
        state.detalhe = detalhe
    },
    ADD_CAMERA(state, device) {
        let imei = device.IMEI
        let findCamera = state.cameras.find(el => imei == el.IMEI)
        if (!findCamera) {
            state.cameras.push(device)
        }
    },
    REMOVE_CAMERA(state, imei) {
        let findIndex = state.cameras.findIndex(el => imei == el.IMEI)
        if (findIndex !== -1) {
            state.cameras.splice(findIndex, 1);
        }
    }
}
export const actions = {
    setDevices({ state, commit }, newDevices) {
        for (let device of newDevices) {
            let findDevice = state.devices.find(d => d.IMEI === device.IMEI)
            if (!findDevice) {
                commit("ADD_DEVICE", device)
            }
        }
    },
    updateDeviceImei({ state, commit }, listen) {
        let indexDevice = state.devices.findIndex(el => listen.IMEI == el.IMEI)
        let findDevice = state.devices.find(el => listen.IMEI == el.IMEI)
        commit("UPDATE_LISTEN", { indexDevice, findDevice, listen })
        commit("UPDATE_UNIDADES")
        commit("UPDATE_ENDERECOS")
    },
    updateDetalhe({ commit }, { show, device }) {
        commit("SET_DETALHE", { show, device })
    },
    add_camera({ state, commit }, imei) {
        let findDevice = state.devices.find(el => imei == el.IMEI)
        commit("ADD_CAMERA", findDevice)
    },
    remove_camera({ commit }, imei) {
        commit("REMOVE_CAMERA", imei)
    },
    centerMap({commit}, center){
        commit("SET_CENTER", center)
    }
}