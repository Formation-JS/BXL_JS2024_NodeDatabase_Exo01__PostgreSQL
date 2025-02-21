const data = { name: 'Nom', desc: 'Demo', release: new Date(2020,2,20), duration: 190, rating: undefined };

let test1  = '';
let i = 1;

for(const [key, value] of Object.entries(data)) {
    if(value === undefined) {
        continue;   
    }
    
    const column = key[0].toUpperCase() + key.slice(1) 
    test1 += `"${column}" = $${i}, `;
    i++;
}

const test2 = Object.entries(data).filter(elem => elem[1] !== undefined).reduce((acc, current, index) => {
    
    const [key] = current;

    const column = key[0].toUpperCase() + key.slice(1) 
    acc += `"${column}" = $${index +1}, `;

    return acc;

}, '');