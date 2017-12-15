// fs is a core Node package for reading and writing files
var fs = require("fs");
// Require the NPM Package inquirer
var inquirer = require("inquirer");
//require the musql package
var mysql = require("mysql");

// global variables just because...IDK better ways
var buyIt;
var thisQuant;

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
		buyIt = selection.buyThis;
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
		thisQuant = selection.thisMany;
		checkInventory();
	})
}

// check to see if inventory available...
function checkInventory(){
	console.log("Confirming availability...\n");
	connection.query("SELECT * FROM products WHERE item_id="+buyIt, function(err, res) {
		if (err) throw err;
		// 	if not...insufficient quantity messages
		if (res[0].stock_quantity<=thisQuant){
			console.log("Your order could not be fulfilled because we don't have enough of '"+res[0].product_name+"' available.");
		}
		// 	if yes...fulfil the customer order
		else {
			//decrements remaining quantity
			connection.query("UPDATE products SET stock_quantity="+(res[0].stock_quantity-thisQuant)+" WHERE item_id="+buyIt);
			//display the customer total order cost
			console.log("Your order has been fulfilled. You owe $"+(res[0].price*thisQuant)+" to Bamazon's receivable department. They will contact you shortly.");
			connection.query("SELECT * FROM products WHERE item_id="+buyIt, function(err, res){
				if (err) throw err;
				console.log("The store now has: "+res[0].stock_quantity+" of "+res[0].product_name+" remaining in inventory.");		
			});
		}
		//close out the database connection
		connection.end();
	});
}