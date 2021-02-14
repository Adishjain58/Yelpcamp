const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

router.get("/:id/userCamps",(req,res)=>{
    let userId=req.params.id;
    let camps=Campground.find({}).then(campgrounds=>{
       let camps= campgrounds.filter(camp=>{
          if(camp.author.id.equals(userId)){
              return camp;
          }
        });
        console.log(camps);
        res.json(camps)
    })
});

module.exports = router;