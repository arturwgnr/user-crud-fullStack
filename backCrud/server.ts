import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log('Eu te amo mano. Estarei pra sempre com voce, aconteca o que acontecer. Tamo junto.')
})

app.get("/ping", (req, res) => {
  res.send("pong")
});

//rotas
// rota POST -> cria usuário
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// rota GET -> lista usuários
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


//get user
app.get("/users/:id", async (req, res) => {
  const {id} = req.params;

  const user = await prisma.user.findUnique({
    where: {id: Number(id)},
  })

   if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
})

// rota PUT -> atualizar usuário
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.json(user);
  } catch {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// rota DELETE -> remover usuário
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Usuário deletado com sucesso" });
  } catch {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});