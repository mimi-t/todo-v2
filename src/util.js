function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function setObjToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getObjFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export { generateId, setObjToLocalStorage, getObjFromLocalStorage };