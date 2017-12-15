// fs is a core Node package for reading and writing files
var fs = require("fs");
// Require the NPM Package inquirer
var inquirer = require("inquirer");

//require the musql package
var mysql = require("mysql");

// pull up and display inventory(id, name, price)
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "root",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	readProducts();

});



//this asks the database for all products and logs the results
function readProducts() {
	console.log("Selecting all products...\n");
	connection.query("SELECT * FROM products", function(err, res) {
	    if (err) throw err;
	    // Log all results of the SELECT statement
	    console.log(" <item_id>    <product_name>        <price>")
	    for (i=0;i<res.length;i++){
			console.log("   "+res[i].item_id+"          "+res[i].product_name+"        $"+res[i].price);
	    }
	    askUser();
	});
}

// prompt first message...which product id do you want to buy
function askUser(){
	inquirer.prompt([
		{
	    type: "input",
	    name: "buyThis",
	    message: "What item_id would you like to purchase??",
	  	}
	]).then(function(selection){
		console.log("You selected: "+selection.buyThis);
		//close out the database connection
		howMany();
	})
}

// prompt second message...how many units do you want to buy
function howMany(){
	inquirer.prompt([
		{
	    type: "input",
	    name: "thisMany",
	    message: "How many would you like to purchase??",
	  	}
	]).then(function(selection){
		console.log("You ordered: "+selection.thisMany);
		//close out the database connection
		connection.end();
	})
}

// check to see if inventory available...


// 	if not...insufficient quantity messages

// 	if yes...fulfil the customer order
// 		decrement remaining quantity
// 		display the customer total order cost
