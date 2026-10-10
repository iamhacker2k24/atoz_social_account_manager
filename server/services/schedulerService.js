const corn  = require("node-corn");




const  initSchrduler =()=>{
    corn.schedule ("* * * *",async ()=>{
    try {
        
        const now = new Date();
        const postsTopublish = await post.find({status :"scheduledFor",{$lte :now}}),

    } catch (error) {
        
    }    
    })
}

module.exports = initSchrduler;