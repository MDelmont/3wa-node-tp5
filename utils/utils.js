const fs = require('fs');
exports.findActivePage = (menuItems, req) => {
    const foundItem = menuItems.find(item => item.path != '/' && req.url.includes(item.path) || req.url == item.path);
    return foundItem ? foundItem : null;
}

exports.findParamActivePage  = (menuItems,param) => {
    const foundItem = menuItems.find(item => item.isActive);
    return foundItem ? foundItem[param] : null;
}

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

exports.extractNameFromDeleteUrl = (url) => {
    const match = url.match(/\/users\/delete\/([^/]+)/);
    return match ? match[1] : null;
}