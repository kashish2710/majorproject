
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listings.js");
const methodOverride = require('method-override');
const path=require('path');
const ejsMate=require('ejs-mate')
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");



//mongoose -connection
async function main(){
await mongoose.connect(MONGO_URL);
}
main()
.then((res)=>{
    console.log("connection to DB successful!");
})
.catch((err)=>{
    console.log("failed to DB!");
});

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"/public")));


//route -define
app.get('/',(req,res)=>{
res.send("root is working");
})


// index route
app.get('/listings', async (req, res) => {
  let alllistings = await Listing.find({});
  res.render('listings/index.ejs', { alllistings });
});


//create-route
app.get('/listings/create',(req,res)=>{
  res.render('listings/create.ejs');
})


// show route
app.get('/listings/:id',wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', { listing });
}));


//new -route
// app.post('/listings',async(req,res)=>{
//   let {title,description,image,price,location}=req.body;
//   let newlisting=new Listing({
//     title:title,
//     description:description,
//     image:image,
//     price:price,
//     location:location
//   });
//   await newlisting.save();

//   res.redirect('/listings')
// });
app.post('/listings',wrapAsync( async (req, res,next) => {
 
 console.log(req.body);
  const newlisting = new Listing(req.body.listing); // <- changed here
  await newlisting.save();
  res.redirect('/listings');

}));


//edit-route
app.get('/listings/:id/edit',wrapAsync(async (req,res)=>{
  let { id }=req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs',{listing})

}))


//update-route
app.put('/listings/:id',wrapAsync(async(req,res)=>{
  let { id }=req.params;
  // if(!req.body.listing){
  //   throw new ExpressError(400,"enter valid data only");
  // }
 await Listing.findByIdAndUpdate(id,{...req.body});
 res.redirect(`/listings/${id}`);
}));



//delete-route
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  let { id }=req.params;
  let deleted =await Listing.findByIdAndDelete(id,);
  console.log(deleted);
  res.redirect('/listings');

}));
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
 let {statusCode,message}=err;
 res.status(statusCode).send(message);
});


//port 
app.listen(8080,()=>{
    console.log("Port is listening!")
});