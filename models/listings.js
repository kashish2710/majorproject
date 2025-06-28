const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97F2WfGZaV7qDBAZGKFGL_R4w_UAR-EiZ2A&s",
        set:(v)=>v===""? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97F2WfGZaV7qDBAZGKFGL_R4w_UAR-EiZ2A&s":v
    },
    price:{
        type:Number,
        required:true
    },
    location:String,
    country:String
});

//collection
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;