export const setInput = (setter) => (event) => {
    setter(event.currentTarget.value);
}

export const groupByKey = (list, key) => list.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {})

export const chatNameGen = (name, friend_names) => {
    const all_names = [name, ...friend_names]
    const sorted_all_names = [...all_names].sort()
    return sorted_all_names.join('-')
}

export const truncate = (input) => input.length > 15 ? `${input.substring(0, 15)}...` : input;

export const setsAreEqual = (a, b) => {
    if (a.size !== b.size) {
        return false;
    }

    return Array.from(a).every(element => {
        return b.has(element);
    });
}
const serverIP = '172.20.10.3'
export const client = new WebSocket(`ws://${serverIP}:4000/`)