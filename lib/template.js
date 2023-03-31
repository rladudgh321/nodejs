module.exports={
    html: function(title, list, data, control){
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>${title}</title>
        </head>
        <body>
            <h1><a href=".">WEB</a></h1>
            <ol>
                ${list}
            </ol>
            <h2>${title}</h2>
            <p>${data}</p>
            ${control}
        </body>
        </html>
        `;
    },

    list: function(filelist){
        let list = ``;
        filelist.forEach(element => {
            list += `<li><a href="/?id=${element}">${element}</a></li>`;
        });
        return list;
    }
}