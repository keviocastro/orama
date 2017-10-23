module.exports = () => {
    const data = { 
        segments: [],
        partners: [], 
    }
    
    for (let i = 0; i < 1000; i++) {
        data.users.push({ id: i, name: `user${i}` })
    }
    return data
}

partners () => 1;

