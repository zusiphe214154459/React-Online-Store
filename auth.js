const router = require("express").Router();
const User =require("../modules/User");
const CryptoJs = require("crypto-js");

//REGISTER
router.post("/register", async (req,res) =>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });
    try{
        const savedUser = await newUser.save();
        res.status(201 ).json(savedUser);
        
       }catch(err){
        res.status(500).json(err);
       }
         
});

//LOGIN

router.post("/login", async (req, res)=>{
    try{
      const user = await User.findOne({username: req.body.username});
      !user && res.status(401).json("Wrong Credentials!");

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const password = hashedPassword.toString(CryptoJS.enc.Utf8);

      password !==req.body.password && 
      res.status(401).json("Wrong credentials!");

      res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;