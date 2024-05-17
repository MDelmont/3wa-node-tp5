const fs = require('fs');

/**
 * 
 * @param {list} menuItems 
 * @param {*} req 
 * @returns 
 */
exports.findActivePage = (menuItems, req) => {
    const foundItem = menuItems.find(item => item.path !== '/' && req.url.includes(item.path) || req.url === item.path);
    return foundItem ? foundItem : null;
}

/**
 * 
 * @param {string} path 
 * @returns 
 */
exports.loadFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err); 
                return;
            }
            resolve(data); 
        });
    });
};

/**
 * 
 * @param {string} url 
 * @returns 
 */
exports.extractNameFromDeleteUrl = (url) => {
    const match = url.match(/\/users\/delete\/([^/]+)/);
    return match ? match[1] : null;
}