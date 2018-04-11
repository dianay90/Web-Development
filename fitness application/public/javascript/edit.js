var ExerciseContent= ['name', 'reps', 'weight', 'unit'];
var ID, Item;
function updateEditTable() {

    // get the part of the url with the id to retrieve id number 
    
    //Cite:https://stackoverflow.com/questions/3730359/get-id-from-url-with-jquery

    var url = location.href;
    var idTransform = url.substring(url.lastIndexOf('/') + 2);
   ID = parseInt(idTransform);
  
    var req = new XMLHttpRequest();
    req.addEventListener("load", function (data) {
        Item = JSON.parse(this.responseText)[0]
        //restore data inside input fields  

        document.getElementById('name').value = Item.name
        document.getElementById('reps').value = Item.reps
        document.getElementById('weight').value = Item.weight
        document.getElementById('unit').value = Item.unit


    });
    
    req.open("GET", "http://flip3.engr.oregonstate.edu:9666/item/" + ID, true);
    req.send();

}

function submit() {

    var body = {}
    var validData = true

    var content = ['name', 'reps', 'weight', 'unit'];

    // checking if at least one of values is empty

    content.forEach(function (item) {
        if (!document.getElementById(item).value) {
            validData = false;
        }

        else {

            //collect edit information from input form 
            body.name = document.getElementById('name').value;
            body.reps = document.getElementById('reps').value;
            body.weight = document.getElementById('weight').value;
            body.unit = document.getElementById('unit').value;

            var date = new Date();
            var month = date.getMonth() + 1;

            var str = date.getFullYear() + '-' + month + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            body.date = str
        }

    })
    //isvalid is false

    if (validData) {

        var req = new XMLHttpRequest();

        //update items in server with newly entered inputs 

        req.open("POST", "http://flip3.engr.oregonstate.edu:9666/update/" + ID, true);
        req.addEventListener("load", function (data) {

            window.location = 'http://flip3.engr.oregonstate.edu:9666/'
        });
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(body));

    } else {
        alert('You got empty fields or you did not put in the correct data type!')
    }

}

updateEditTable()// update table
