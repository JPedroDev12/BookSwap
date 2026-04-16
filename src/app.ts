import express from "express";
//importar rotas dps

const app = express();
const port = 3000;

app.use(express.json())
app.use('/', ) //importar rotas

app.listen(port, () => {
    console.log("Servidor aberto porta 3000");
})