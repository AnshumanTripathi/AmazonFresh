var mq_client = require('../rpc/client');


exports.addToCart = function addToCart(req, res) {
	var p = req.param('product');
	if(req.param('product') === 'selectedProd'){
		p = req.session.selectedProduct;
	}
	var msg_Payload = {
	        'cust_id': req.session.user[0].cust_id,
	        'product': p,
	        'quantity': req.param('quantity')
	    };
	    mq_client.make_request('addToCart_queue', msg_Payload, function (err, results) {
	        if (err) {
	            console.log('Err: ' + err);
	            res.send({'statusCode': 401});
	            throw err;
	        } else {
	            if (results.statusCode === 200) {
	                console.log('Product added to shopping cart!');
	                req.session.shoppingCart = results.shoppingCart;
	                res.send(results);
	            } else {
	                console.log('Error Occured!');
	                res.send({'statusCode': 401});
	            }
	        }
	    });
};

exports.showShoppingCart = function showShoppingCart(req, res) {
	res.render('shoppingCart');
};

exports.getShoppingCart = function getShoppingCart(req, res) {
	var sum = 0.0;
	for(var i = 0; i < req.session.shoppingCart.items.length; i++){
		sum += (parseFloat(req.session.shoppingCart.items[i].product.price))*(parseFloat(req.session.shoppingCart.items[i].quantity));
	}
	res.send({"statusCode": 200, shoppingCart: req.session.shoppingCart, sum: sum});
};

exports.removeItemFromCart = function removeItemFromCart(req, res) {
	var msg_Payload = {
			'cust_id' : req.session.user[0].cust_id,
	        'product': req.session.shoppingCart.items[req.param('index')]
	    };
	    mq_client.make_request('removeItemFromCart_queue', msg_Payload, function (err, results) {
	        if (err) {
	            console.log('Err: ' + err);
	            res.send({'statusCode': 401});
	            throw err;
	        } else {
	            if (results.statusCode === 200) {
	                console.log('Product removed from shopping cart!');
	                req.session.shoppingCart = results.shoppingCart;
	                var sum = 0.0;
	            	for(var i = 0; i < req.session.shoppingCart.items.length; i++){
	            		sum += (parseFloat(req.session.shoppingCart.items[i].product.price))*(parseFloat(req.session.shoppingCart.items[i].quantity));
	            	}
	            	res.send({"statusCode": 200, shoppingCart: req.session.shoppingCart, sum: sum});
	            } else {
	                console.log('Error Occured!');
	                res.send({'statusCode': 401});
	            }
	        }
	    });
};

exports.checkout = function checkout(req, res) {
	res.render('checkout');
};