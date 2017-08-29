var mysql = require('mysql');
var inquirer = require('inquirer');
var express = require('express');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon_db',
});

connection.connect(function(error){
	if (!!error){
		console.log('Error');
	} else {
		console.log("connection successful!");
	};
	displayProducts();
	
});

var displayProducts = function(){
	connection.query("SELECT * FROM products", function(err,res){
		for(var i=0; i < res.length; i++)
			{
				console.log(res[i].id+" || "+res[i].product_name+" || "+res[i].price+" || "+res[i].stock_quantity+" || "+res[i].department_id);
	}
	promptCustomer(res);
});
}

var promptCustomer = function(res){
	inquirer.prompt([{
		type:"input",
		name:"productId",
		message:"What is the product ID of what you want to buy?"
	}]).then(function(answer){
			var productChosen = answer.productId;
			inquirer.prompt([{
			type:"input",
			name:"productQuantity",
			message:"How much of this item do you want to buy?"
			// validate: function(value){
			// 	if(isNan(value)==false){
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// }
			}]).then(function(answer){
				if((res[productChosen].stock_quantity-(answer.productQuantity))>0){
					connection.query("UPDATE products SET stock_quantity='"+((res[productChosen].stock_quantity-(answer.productQuantity))+"' WHERE id='"+productChosen+"'"));
					connection.query("INSERT INTO sales(product_id,quantity_purchased,created_at) VALUES ('"+productChosen+"','"+answer.productQuantity+"','CURRENT_TIMESTAMP()+')");

						console.log("Order Successful!");
						console.log("Your total cost is $"+(res[productChosen].price)*(answer.productQuantity));
						displayProducts();
					}
					else {
						console.log("Not a valid selection.");
						promptCustomer();
					}
		})})}