function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function setToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export { generateId, setToLocalStorage, getFromLocalStorage };