import express from 'express';
import prisma from '../prismaClient.js'


const router = express.Router();

router.get('/',async (req,res)=>{
    const todos = await prisma.Todo.findMany({
        where: {
            userId:req.userId
        }
    })
    res.json(todos);
});

router.post('/',async (req,res)=>{
    const { task } = req.body;

    const todo = await prisma.Todo.create({
        data: {
            task: task,
            userId: req.userId
        }
    })

    res.json(todo);
});

router.put('/:id', async (req,res)=>{
    const { completed } = req.body;
    const {id} = req.params;
    const {page} = req.query;

    const updatedTodo = await prisma.Todo.update({
        where:{
            id:parseInt(id),
            userId:req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo)

});

router.delete('/:id',async (req,res)=>{
    const {id} = req.params
    const UserId = req.userId

    await prisma.Todo.delete({
        where:{
            id:parseInt(id),
            userId: req.userId
        }
    })

    res.send({ message: "Todo Deleted "})
});

export default router;
