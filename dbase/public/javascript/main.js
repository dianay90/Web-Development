
var list = []

//  render display table based on current data
function buildTable() {

    document.getElementById('tableMain').innerHTML = ''
    var header = '<tr><th>Name</th><th>Reps</th><th>Weight</th><th>Date</th><th>Unit</th><th></th></tr>'
    var tableBody = ''

    list.forEach(function (item) {

        var date = new Date(item.date)
        var month = date.getMonth() + 1;
        var dateDisp = month + '-' + date.getDate() + '-' + date.getFullYear();
        var name = item.name
        var reps = item.reps
        var weight = item.weight
        var unit= item.unit 

        tableBody +=
           
          "<tr>" + "<td>" + name + "</td>" +  "<td>" + reps + "</td>" +"<td>" + weight + "</td>" +
         "<td>" + dateDisp + "</td>" + "<td>" + unit + "</td>" +

            "<td class='buttonRow'>" +
              "<button class='editButton'><a href='http://flip3.engr.oregonstate.edu:9666/edit#" + item.id+"'>Edit</a></button>" +
              "<button class='removeButton' onclick='removeItem(" + item.id + ")'>Remove</button>" +
            "</td>" +
          "</tr>"

    })
    document.getElementById('tableMain').innerHTML = header + tableBody


}



// retrieve all current table data from server and build table with it 

function getData() {

    var req = new XMLHttpRequest();
    req.addEventListener("load", function (data) {
 
        list = JSON.parse(this.responseText)
        buildTable()
    });
    req.open("GET", "http://flip3.engr.oregonstate.edu:9666/list", true);
    req.send();

}



function submit() {

    var body = {}

    // checking if at least one of values is empty
    var validData = true

    var content = ['name', 'reps', 'weight', 'unit'];

    content.forEach(function (item) {
        if (!document.getElementById(item).value) {
            validData = false;
        }

        else {
            body.name = document.getElementById('name').value;
            body.reps = document.getElementById('reps').value;
            body.weight = document.getElementById('weight').value;
            body.unit = document.getElementById('unit').value;

            var date = new Date();
            var month = date.getMonth() + 1;

            var str = date.getFullYear() + '-' + month + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

            body.date = str; 
        }

    })

    // get values from input fields to add items 

    // if there are no empty fields 
    if (validData) {
        var req = new XMLHttpRequest();
        req.open("POST", "http://flip3.engr.oregonstate.edu:9666/add", true);
        req.addEventListener("load", function (data) {

            var newItem = JSON.parse(this.responseText)
            body.id = newItem.insertId
     

            //add new things to the list 
            list.push(body)

            //display table to reflect changes 
            buildTable()

            //clear input form 
            clearForm()

        });
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(body));


    } else {
        alert('You got empty fields or you did not put in the correct data type!')
    }
}



//Cite: https://stackoverflow.com/questions/2722159/javascript-how-to-filter-object-array-based-on-attributes
//Cite:https://stackoverflow.com/questions/27131984/how-can-i-only-keep-items-of-an-array-that-match-a-certain-condition

//Item gets removed from server and the table rebuilds to reflect  the removal 

function removeItem(item) {

    //just show items not do not have the id of what was removed
  
  
    var remove = false;

    list = list.filter(function (reject) {
               return reject.id != item
          })


    //build table should exclude any removed items
    buildTable()

    var req = new XMLHttpRequest();
    req.open("DELETE", "http://flip3.engr.oregonstate.edu:9666/remove", true);
    req.addEventListener("load", function (data) {

        remove = true;

    });
    //send id of what to get deleted 
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({ id: item }));

}

// Remove values from input fields
function clearForm() {


    var content = ['name', 'reps', 'weight', 'unit'];
    content.forEach(function (item) {

        document.getElementById(item).value = ''

    })
  
}

getData() //fetch data
