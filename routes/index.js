const express=  require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/" , function(req,res){
   let error = req.flash("error");
    res.render("index" , {error , loggedin : false});
});


router.get("/shop" , isLoggedIn ,async function(req,res){
  let products =   await productModel.find();
  let success = req.flash("success");
    res.render("shop" , {products , success});
});


router.get("/cart" , isLoggedIn ,async function(req,res){
  let user = await userModel.findOne({email:req.user.email}).populate("cart");

    let bill = 0;

  if (user.cart.length > 0) {
    bill = user.cart.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const discount = Number(product.discount) || 0;
      return total + (price - discount);
    }, 0);

    // Add ₹20 shipping charge only once
    bill += 20;
  }


    res.render("cart" ,{user , bill});
     
}); 

router.get("/addtocart/:productid" , isLoggedIn ,async function(req,res){
 
 let  user =  await userModel.findOne({ email:req.user.email });

  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success" , "Added to cart");
  res.redirect("/shop");
});

// Assuming you're using session or some other cart management
router.get("/removefromcart/:productId", (req, res) => {
    const productId = req.params.productId;
    const userCart = req.session.cart; // Assuming the cart is stored in session

    // Check if user has a cart
    if (userCart) {
        // Filter out the product from the cart
        userCart.items = userCart.items.filter(item => item._id !== productId);

        // Save the updated cart
        req.session.cart = userCart;
    }

    // Redirect the user to the cart or shop page after removal
    res.redirect('/cart'); // Or '/shop' depending on where you want them to go
  });
router.get("/logout" , isLoggedIn , function(req,res){
    res.render("shop");
});


module.exports = router;