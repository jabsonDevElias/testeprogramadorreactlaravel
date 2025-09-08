# Projeto

## Acesso ao Frontend e Backend

- **Frontend:** Acesse em [http://localhost:5173](http://localhost:5173)
- **Backend:** A API está disponível em [http://localhost:8000](http://localhost:8000)

## Como Criar a Imagem e Rodar com Docker

### Construindo a Imagem

Dentro do diretório do backend, execute:

```sh
cd pastadoprojeto
docker-compose up --build -d
```

Agora o projeto estará rodando nos links indicados acima! 🚀

### Tecnologias

Frontend: Vite + React + Bootstrap

Backend: Laravel 11

Autenticação: JWT (JSON Web Token)

Containerização: Docker

### obs:

Se for rodar o projeto sem o docker lembrar de trocar o DB_HOST=postgres para DB_HOST=127.0.0.1, para a base local funcionar.


