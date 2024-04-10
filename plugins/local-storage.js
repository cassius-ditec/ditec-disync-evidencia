export function setLocalStorage(Key, Value){
    if(typeof localStorage !== "undefined"){
        let valueFormat = JSON.stringify(Value)
        localStorage.setItem(Key, valueFormat)
    }else{
        console.error("Não encontrou o metodo LOCALSTORAGE setLocalStorage")
    }
}

export function getLocalStorage(Key){
    if(typeof localStorage !== "undefined"){
        let Value = localStorage.getItem(Key)
        let valueFormat = JSON.parse(Value)
        return valueFormat
    }else{
        console.error("Não encontrou o metodo LOCALSTORAGE getLocalStorage")
    }
}