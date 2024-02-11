import express from 'express';
import cors from 'cors';
const app = express();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.json('Hello')
})

app.post('/create', async (req, res) => {
    const {name, email} = req.body

    if(!name || !email) {
        return res.status(400).json({message :'Não foi possível cadastrar o usuário, preencha todos os campos.'})
    }

    const existUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    
    if(existUser) {
        res.status(400).json({message: 'Email já cadastrado!'})
        return
    }

    await prisma.user.create({
        data: {
            email,
            name
        }
    })
    return res.status(201).json({message: "Cadastro realizado com sucesso !"})
});

app.get('/users', async (req, res) => {

    const users = await prisma.user.findMany()

    return res.json(users)
})

app.get('/users/:id', async (req, res) => {
    const userId : string = req.params.id

    const user = await prisma.user.findUnique({
        where: {
            id:Number (userId)
        }
    })
    

    if(user) {
        return res.json(user)
    } else {
        return res.status(404).json({message: 'Usuário não encontrado'})
    }
})

app.delete('/users/:id', async (req, res) => {
    const userId : string = req.params.id
    
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        }
    })

    if(!user) {
        return res.status(404).json({message: 'Usuário não encontrado'})
    } else {
        await prisma.user.delete({
            where:{
                id:Number(userId)
            }
        })
        return res.status(204).send()
    }
    

    
})



app.listen(3000, () => {
    console.log('Rodando na porta 3000...')
})