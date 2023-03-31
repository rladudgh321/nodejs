const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const app = http.createServer(function(request,response){

    const queryData = url.parse(request.url,true).query;
    // console.log(url.parse(request.url,true));
    const pathname = url.parse(request.url,true).pathname;
    //HOME
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data',function(error,filelist){
                const title = 'welcome';
                const data = 'node.js'
                const list = template.list(filelist);
                const html = template.html(title, list, data,`
                <a href="/create">CREATE</a>
                `);
                response.writeHead(200);
                response.end(html);
            });
        //if(id) => read            
        } else {
            const title = queryData.id;
            fs.readdir('./data',function(error,filelist){
                const filteredId = path.parse(queryData.id).base;
                fs.readFile(`./data/${filteredId}`,'utf8',function(error,data){
                    const list = template.list(filelist);
                    const html = template.html(title, list, data,`
                    const sanitizedHtml_title = sanitizeHtml(title);
                    <a href="/create">CREATE</a>
                    <a href="/update?id=${title}">UPDATE</a>
                    <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="submit" value="DELETE"></p>
                    </form>
                    `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname === '/create'){
        fs.readdir('./data',function(error,filelist){
            const title = 'CREATE';
            const data = `
            <form action="create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit" value="CREATE"></p>
            </form>
            `;
            const list = template.list(filelist);
            const html = template.html(title, list, data,``);
            response.writeHead(200);
            response.end(html);
        });
    } else if(pathname === '/create_process'){
        let body = '';
        request.on('data',function(data){
            body += data;
            // console.log(body);
        });
        request.on('end',function(){
            const post = qs.parse(body);
            // console.log(post);
            const title = post.title;
            const description = post.description;
            const filteredId = path.parse(title).base;
            fs.writeFile(`./data/${filteredId}`,description,'utf8',function(error){
                response.writeHead(302, {location:`/?id=${title}`});
                response.end();
            });
        });
    } else if(pathname === '/update'){
        fs.readdir('./data',function(error,filelist){
            const filteredId = path.parse(queryData.id).base;
            fs.readFile(`./data/${filteredId}`,'utf8',function(error,uDesc){
                // console.log(filelist);
                const title = 'UPDATE';
                const data = `
                <form action="update_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <p><input type="text" name="title" placeholder="title" value="${queryData.id}"></p>
                <p><textarea name="description" placeholder="description">${uDesc}</textarea></p>
                <p><input type="submit" value="UPDATE"></p>
                </form>
                `;
                const list = template.list(filelist);
                const html = template.html(title, list, data,``);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process'){
        let body = '';
        request.on('data',function(data){
            body += data;
            // console.log(body);
        });
        request.on('end',function(){
            const post = qs.parse(body);
            // console.log(post);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            const filteredId = path.parse(id).base;
            fs.rename(`./data/${filteredId}`,`./data/${title}`,function(error){
                fs.writeFile(`./data/${title}`,description,'utf8',function(error){
                    response.writeHead(302, {location:`/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if(pathname === '/delete_process'){
        let body = '';
        request.on('data',function(data){
            body += data;
            // console.log(body);
        });
        request.on('end',function(){
            const post = qs.parse(body);
            console.log(post);
            const id = post.id;
            const filteredId = path.parse(id).base;
            fs.unlink(`./data/${filteredId}`,function(error){
                response.writeHead(302, {location:`/`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('not Found');
    }
    
});
app.listen(3000);