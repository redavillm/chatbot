const data = {};

const getData = (id, field) => {
    if (data[id]){
       return data[id][field];
    }
    return null;
}

const setData = (id, field, value) => {
    if (!data[id]){
        data[id] = {};
    }
    data[id][field] = value;
}

module.exports = {
    getData,
    setData
}
