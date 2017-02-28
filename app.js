var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');


app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname , 'public')));

// views is directory for all template files
app.set('views', path.join(__dirname , 'views'));
app.set('public', path.join(__dirname , 'public'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.redirect('/index');
});

var bio_info_map = {}
fs.readdirSync(path.join('views','templates')).forEach(file => {
    name = file.split('.')[0].split('_')[1]
    bio_info_map[name] = get_bio_info(name)
});

var gallery_list = []
fs.readdirSync(path.join('public', 'images', 'gallery')).forEach(file => {
    if(!file.startsWith('.')){
        gallery_list.push(file)
    }
});

global.bio_info_map = bio_info_map;
global.gallery_list = gallery_list;


function get_bio_info(name){
    file_name = 'bio_' + name + '.txt'
    bio_info = {}

    var bio_file = fs.readFileSync(path.join('views','templates', file_name)).toString().split('\n');
    bio_info['name'] = bio_file[0].split(',')[0].trim()
    bio_info['position'] = bio_file[0].split(',')[1].trim()
    bio_info['img'] = bio_file[1]
    var bio_qna = []
    for(var i = 2; i < bio_file.length;){
        bio_qna.push({question: bio_file[i], answer: bio_file[i+1]})
        i = i +2
    }
    bio_info['qna'] = bio_qna

    return bio_info
}

app.get('/bio-:name', function(request, response) {
    req_name = request.params.name

    response.render(path.join('pages','bio'), {
        bio_info: bio_info_map[req_name]
    });
});


app.get('/:type', function(request, response) {
    reqType = request.params.type
    response.render(path.join('pages', reqType), {});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});