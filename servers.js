const http = require("http");
const pug = require('pug');
const {findActivePage,loadFile,extractNameFromDeleteUrl} = require('./utils/utils')
const fs = require('fs');
const querystring = require('querystring');
const StudentManager = require('./Data/students/studentsManager.js')
require('dotenv').config();

const pathJsonStudent = './Data/students/students.json'
const hostname = process.env.APP_LOCALHOST  || "localhost";
const port = process.env.APP_PORT || 3000;
const env = process.env.APP_ENV || "dev";
const FormatFrDate = 'DD/MM/YY'
const menuItems = [
    {path: '/', title: 'Home', isActive: false },
    {path: '/users', title: 'Users', isActive: false}
];


const server = http.createServer((req, res) => {
    console.log(req.url)
    if (req.url === '/style.css') {
    
        loadFile('./assets/css/style.css').then( data => {

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);

        }).catch(err => {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);

        }) 
    
            return;
    }
    const activePage = findActivePage(menuItems,req,'title')
    console.log(activePage) 
    if (!activePage) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
    }
    menuItems.forEach(item => item.isActive = (item.path === req.url));
    if (req.method === 'GET') {
   
        try {
     
            if (!req.url.includes('/users/delete/')){

                StudentManager.getAllStudents(pathJsonStudent,FormatFrDate).then(students => {
     
                    pug.renderFile('./view/index.pug', { menuItems: menuItems, title : activePage.title,students: activePage.title=='Users' ? students:null}, (err, data) => {
                        if (err) {
                            console.log('err',err)
                            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end(err.message);
                            return;
                        }
                        res.end(data);
                    });
                }).catch(err => {
                    console.log(err)
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(err.message);
    
                }) 
            } else {
                const name = extractNameFromDeleteUrl(req.url)

                StudentManager.deleteStudent(name,pathJsonStudent).then(resp => {
                    res.writeHead(301, { Location : '/users'});
                    res.end()
                }).catch(err =>{
                    console.log(err)
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(err.message);

                })
            }
        } catch (error) {
            console.log(error)
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(error.message);
        }
    } else if (req.method === 'POST') {
       
        let data = '';
        req.on('data', chunk => {data += chunk;});
        req.on('end', () => {
        
            const parsedData = querystring.parse(data);

        
          StudentManager.addStudent(parsedData?.name,parsedData?.birth,pathJsonStudent).then(resp => {
            pug.renderFile('./view/index.pug', { menuItems: menuItems, title : activePage.title,students: activePage=='users' ? students:null, msg :`Utilisateur ${parsedData.name} bien ajouté`}, (err, data) => {
                if (err) {
                    console.log('err',err)
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(err.message);
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            });

          }).catch(err => {
            pug.renderFile('./view/index.pug', { menuItems: menuItems, title : activePage.title,students: activePage=='users' ? students:null, msg :err.message}, (err, data) => {
                if (err) {
                    console.log('err',err)
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(err.message);
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            });

          })
         
    });
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
