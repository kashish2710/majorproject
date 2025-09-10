 const Listing=require("../models/listings")
const wrapAsync=require("../utils/wrapAsync.js");

 module.exports.index=async (req, res) => {
  let alllistings = await Listing.find({});
  res.render('listings/index.ejs', { alllistings });
};
module.exports.createform=async(req,res)=>{

  res.render('listings/create.ejs');
};
module.exports.showlistings= wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested does not exist");
   return res.redirect("/listings");
  }
  res.render('listings/show.ejs', { listing });
});
module.exports.newlisting= wrapAsync(async (req, res,next) => {
let url=req.file.path;
let filename=req.file.filename;
    const newlisting = new Listing(req.body.listing); 
     newlisting.owner=req.user._id;
    newlisting.image={url,filename};
  await newlisting.save();
  req.flash("success","New listing created!");
 
  res.redirect('/listings');

});
module.exports.editlisting=async (req,res)=>{
  let { id }=req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","listing you requested for does not exist");
    res.redirect("/listings");
  }
let original=listing.image.url;
original.replace("/upload","/upload/w_100");
  res.render('listings/edit.ejs',{listing,original})

};
module.exports.updatelisting=wrapAsync(async(req,res)=>{
  let { id }=req.params;
 
 let listing=await Listing.findByIdAndUpdate(id,{...req.body});
 if(typeof req.file!=="undefined"){
 let url=req.file.path;
let filename=req.file.filename;
 listing.image={url,filename};
  await listing.save();}
 req.flash("success","Listing updated!");
 res.redirect(`/listings/${id}`);
});
module.exports.deletelisting=wrapAsync(async(req,res)=>{
  let { id }=req.params;
  let deleted =await Listing.findByIdAndDelete(id,);
  console.log(deleted);
  req.flash("error","Listing deleted!");
  res.redirect('/listings');

});