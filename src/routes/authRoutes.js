import express from "express";
import bcrypt from  "bcryptjs";
import jwt from 'jsonwebtoken';
import prisma from "../prismaClient.js";


const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        
        const user = await prisma.User.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        const defaultTodo = 'Hello :) Add your first Todo';
        await prisma.Todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Send token back to the client
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);  // Internal Server Error
    }
});  

router.post('/login',async (req,res)=>{

    const { username, password } = req.body;

    try{
        const user = await prisma.User.findUnique({
            where: {
                username: username
            }
        })

        if (!user) { return res.status(404).send({message: "User not found"})}

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid){ return res.status(401).send({message :"Invalid Password"})}

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn:'24h'});
        console.log("hi")
        res.json({ token })
    } catch (err){
        console.log(err.message);
        res.sendStatus(503)
    }
})

export default router;