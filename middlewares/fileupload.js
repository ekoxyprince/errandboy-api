const multer = require('multer')

const fileStore = multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,"./public/uploads/")
    },
    filename:(req,file,cb)=>{
        return cb(null,Date.now()+"--"+file.originalname)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpg'||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'){
        return cb(null,true)
    }else{
        cb(null,false)
    }
}

module.exports = multer({storage:fileStore,fileFilter})