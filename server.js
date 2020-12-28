const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;
const path = require("path")
var formidable = require('formidable');
const hbs = require('express-handlebars')
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));

let context = { pliki: [] }
i = 1
let obrazek

app.get("/upload", function (req, res) {

    res.render('upload.hbs');
})
app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        let data = Date.now()
        if (Array.isArray(files.imageupload)) {
            for (let j = 0; j < files.imageupload.length; j++) {
                if (files.imageupload[j].name.slice(-3) == 'png')
                    obrazek = 'png.png'
                else if (files.imageupload[j].name.slice(-3) == 'txt')
                    obrazek = 'txt.png'
                else if (files.imageupload[j].name.slice(-3) == 'jpg')
                    obrazek = 'jpg.png'
                else if (files.imageupload[j].name.slice(-3) == 'pdf')
                    obrazek = 'pdf.png'
                else obrazek = "nieWiadomo.png"

                context.pliki.push({ id: i, obrazek: obrazek, name: files.imageupload[j].name, size: files.imageupload[j].size, type: files.imageupload[j].type, path: files.imageupload[j].path, data: data, nazwaUploadu: files.imageupload[j].path.slice(files.imageupload[j].path.search('upload_')) })
                i++
            }

        }
        else {
            if (files.imageupload.name.slice(-3) == 'png')
                obrazek = 'png.png'
            else if (files.imageupload.name.slice(-3) == 'txt')
                obrazek = 'txt.png'
            else if (files.imageupload.name.slice(-3) == 'jpg')
                obrazek = 'jpg.png'
            else if (files.imageupload.name.slice(-3) == 'pdf')
                obrazek = 'pdf.png'
            else obrazek = "nieWiadomo.png"
            context.pliki.push({ id: i, obrazek: obrazek, name: files.imageupload.name, size: files.imageupload.size, type: files.imageupload.type, path: files.imageupload.path, data: data, nazwaUploadu: files.imageupload.path.slice(files.imageupload.path.search('upload_')) })
            i++
        }
        res.redirect("/filemanager")
    });
});

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', context)
})
app.get("/", function (req, res) {
    res.redirect("/upload")
})
app.get("/delete", function (req, res) {
    for (let j = 0; j < context.pliki.length; j++) {
        if (context.pliki[j].id == req.query.id) {
            context.pliki.splice(j, 1)
        }
    }
    res.redirect("/filemanager")
})

app.get("/info", function (req, res) {
    let plik = { konkretny: {} }
    for (let j = 0; j < context.pliki.length; j++) {
        if (context.pliki[j].id == req.query.id) {
            plik.konkretny = { id: context.pliki[j].id, name: context.pliki[j].name, path: context.pliki[j].path, size: context.pliki[j].size, type: context.pliki[j].type, savedate: context.pliki[j].data }
        }
    }
    res.render('info.hbs', plik)
})
app.get("/usunDane", function (req, res) {
    context.pliki = []
    i = 1
    res.redirect("/filemanager")
})
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})