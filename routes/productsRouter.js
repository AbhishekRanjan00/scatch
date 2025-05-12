const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create",upload.single("image") ,async function(req,res){

    try{
    let {image, name , price , discount , bgcolor , textcolor , panelcolor} = req.body;

  let products = await productModel.create({
    image: buffer,
    name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,
  }); 
     req.flash("success" , "product created successfully");
     res.redirect("/owners/admin");
}
catch(err){
    return res.send(err.message);
  }
});


module.exports = router;