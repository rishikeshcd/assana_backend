import mongoose from "mongoose";
 
const ContactMainSchema = new mongoose.Schema({
    heading:{
        type:String,
        default:"Heading text"
    },
    text1:{
        type:String,
        default:"text 1"
    },
    text2:{
        type:String,
        default:'text2'
    },
    buttonText:{
        type:String,
        defult:'d'
    },
    backgroundImage:{
        type:String,
        defult:''
    }

},{
    timestamps:true,
});

ContactMainSchema.statics.getSingleton = async function(){
    let doc = await this.findOne();
    if(!doc){
        doc = await this.create({});
    }
    return doc;
};

const ContactMain = mongoose.model('ContactMain',ContactMainSchema);

export default ContactMain;