const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.getAllUsers = (req, res) => {
    userModel.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({error:err.message}));
};

exports.createUser =  (req, res) => {
    const {username, email,password} = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash){
        if(err){
            res.status(500).json({error:err.message});
        }
        else{
            const newUser = new userModel({
                username,
                email,
                password:hash
            });

            newUser
            .save()
            .then(() => res.status(201).json({success:"created"}))
            .catch(err => res.status(500).json({error:err.message}));
        }
    });
}

exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
  
      const user = await userModel.findById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      if (password) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        user.password = hash;
      }
      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  




exports.deleteUser = (req, res) => {
    const {id}= req.params;
    userModel.findByIdAndDelete(id)
    .then(user => {
        if(!user)throw new Error(`user with ID ${id} not found`);
        res.status(200).json({message:"User deleted"});
    })
    .catch(err => res.status(404).json({error:err.message}));
}