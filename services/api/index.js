import axios from 'axios';
import { getLocalStorage } from '@/plugins/local-storage'


export async function release(endpoint) {
    try {
        let result = await axios.get(endpoint)
        return result.data
    } catch (error) {
        throw new Error(`Erro ao obter os dados da API: ${error.message}`)
    }
}

export async function auth(endpoint, params = {}) {

    if (Object.keys(params).length > 0) {
        let urlFormat = new URLSearchParams(params).toString()
        endpoint += `?${urlFormat}`
    }
    try {
        let result = await axios.get(endpoint)
        return result.data
    } catch (error) {
        throw new Error(`Erro ao obter os dados da API: ${error.message}`)
    }
}

export async function get(endpoint, params = {}) {
    const headers = {
        Authorization: `Bearer `,
    };
    headers.Authorization += getLocalStorage("token")

    if (Object.keys(params).length > 0) {
        let urlFormat = new URLSearchParams(params).toString()
        endpoint += `?${urlFormat}`
    }
    try {

        let result = await axios.get(endpoint, { headers })
        return result.data
    } catch ({ message, response }) {
        throw {
            error: `Erro ao obter os dados da API: ${message}`,
            code: response.status,
            logoff: (response.status == 401) ? true : false
        }
    }
}
export async function getFile(endpoint, params = {}) {
    const headers = {
        Authorization: `Bearer `,
    };
    headers.Authorization += getLocalStorage("token")

    if (Object.keys(params).length > 0) {
        let urlFormat = new URLSearchParams(params).toString()
        endpoint += `?${urlFormat}`
    }
    try {
        let result = await axios.get(endpoint, { headers, responseType: 'arraybuffer' })
        return result.data
    } catch ({ message, response }) {
        throw {
            error: `Erro ao obter os dados da API: ${message}`,
            code: response.status,
            logoff: (response.status == 401) ? true : false
        }
    }
}

export async function post(endpoint, params = {}) {
    const headers = {
        Authorization: `Bearer `,
    };
    headers.Authorization += getLocalStorage("token")

    try {
        let result = await axios.post(endpoint, params, { headers })
        return result.data
    } catch (error) {
        throw {
            error: `Erro ao obter os dados da API: ${message}`,
            code: response.status,
            logoff: (response.status == 401) ? true : false
        }
    }
}

export async function put(endpoint, params = {}) {
    const headers = {
        Authorization: `Bearer `,
    };
    headers.Authorization += getLocalStorage("token")

    try {
        let result = await axios.put(endpoint, params, { headers })
        return result.data
    } catch (error) {
        throw {
            error: `Erro ao obter os dados da API: ${message}`,
            code: response.status,
            logoff: (response.status == 401) ? true : false
        }
    }
}

export async function del(endpoint, params = {}) {
    const headers = {
        Authorization: `Bearer `,
    };
    headers.Authorization += getLocalStorage("token")

    if (Object.keys(params).length > 0) {
        let urlFormat = new URLSearchParams(params).toString()
        endpoint += `?${urlFormat}`
    }
    try {
        let result = await axios.delete(endpoint, { headers })
        return result.data
    } catch (error) {
        throw {
            error: `Erro ao obter os dados da API: ${message}`,
            code: response.status,
            logoff: (response.status == 401) ? true : false
        }
    }
}