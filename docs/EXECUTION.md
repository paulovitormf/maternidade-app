<div align="center">

# 🍼 Guia de execução

### Coloque o Maternidade para funcionar com leveza

[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Stack%20completa-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-3-opção-a--stack-completa-com-docker-compose)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#-1-pré-requisitos)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#-1-pré-requisitos)

</div>

## 📚 Sumário

- [✅ Pré-requisitos](#-1-pré-requisitos)
- [⚙️ Configuração do ambiente](#-2-configuração-do-ambiente)
- [🐳 Opção A — Docker Compose](#-3-opção-a--stack-completa-com-docker-compose)
- [⚡ Opção B — execução híbrida](#-4-opção-b--banco-no-docker-e-aplicações-no-host)
- [🔎 Validação rápida](#-5-validação-rápida)
- [🧯 Solução de problemas](#-6-solução-de-problemas)
- [⏹️ Encerramento](#-7-encerramento)

Este guia apresenta as formas suportadas de executar o Maternidade localmente. Os comandos partem da raiz do repositório.

## ✅ 1. Pré-requisitos

| Uso | Ferramenta | Versão |
| --- | --- | --- |
| Stack completa ou banco | Docker Desktop / Docker Engine | versão atual com Compose |
| API local | JDK | 21 ou superior |
| API local | Maven | 3.9 ou superior |
| Front-end local | Node.js | 24.x |
| Front-end local | npm | 10 ou superior |

## ⚙️ 2. Configuração do ambiente

Crie o arquivo `.env` a partir do modelo versionado:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

O `.env` é ignorado pelo Git. Troque os valores de exemplo, principalmente `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD` e `JWT_SECRET`, antes de usar o ambiente fora de uma máquina de desenvolvimento.

| Variável | Uso | Padrão |
| --- | --- | --- |
| `MYSQL_PORT` | Porta do MySQL no host | `3306` |
| `MYSQL_DATABASE` | Nome do banco | `maternidade` |
| `MYSQL_USER` / `MYSQL_PASSWORD` | Credenciais da aplicação | definidas no `.env.example` |
| `BACKEND_PORT` | Porta publicada da API | `8080` |
| `FRONTEND_PORT` | Porta publicada do Vite | `5173` |
| `VITE_API_URL` | URL base consumida pelo front-end | `http://localhost:8080/api` |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas pela API | `http://localhost:5173,http://127.0.0.1:5173` |
| `JWT_SECRET` | Chave usada para assinar tokens | definida no `.env.example` |
| `JWT_EXPIRATION_MS` | Validade do token em milissegundos | `86400000` |

## 🐳 3. Opção A — stack completa com Docker Compose

```bash
docker compose up --build
```

Serviços disponíveis:

| Serviço | Endereço |
| --- | --- |
| Front-end | <http://localhost:5173> |
| API | <http://localhost:8080> |
| MySQL | `localhost:3306` |

Para iniciar em segundo plano:

```bash
docker compose up --build -d
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

O banco usa o volume `mysqldata`. O script SQL é executado pelo MySQL apenas na criação inicial do volume. Para recriar o banco em desenvolvimento:

```bash
docker compose down -v
docker compose up --build
```

> `docker compose down -v` remove os dados persistidos do volume. Use somente quando isso for intencional.

Ao iniciar a API, o Flyway aplica as migrações versionadas antes da validação do Hibernate. Em bancos existentes sem histórico do Flyway, a versão inicial é registrada como baseline e as migrações adicionam somente as alterações ausentes, preservando os registros. A estrutura inicial do fórum é criada pela migração `V2__adicionar_forum_discussao.sql`.

## ⚡ 4. Opção B — banco no Docker e aplicações no host

Esta opção é indicada para desenvolvimento diário, pois preserva o HMR do Vite e o reinício automático do Spring Boot DevTools.

### 4.1 Banco

Na raiz:

```bash
docker compose up mysql-db
```

O banco ficará disponível em `localhost:3306`.

### 4.2 API

Em outro terminal:

```bash
cd backend
mvn spring-boot:run
```

O projeto não versiona o Maven Wrapper. Caso ele seja adicionado futuramente, os comandos equivalentes serão `./mvnw spring-boot:run` no Linux/macOS e `.\mvnw spring-boot:run` no PowerShell.

### 4.3 Front-end

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

Abra <http://localhost:5173>.

## 🔎 5. Validação rápida

1. Confirme que o container `mysql-maternidade` está saudável com `docker compose ps`.
2. Confirme que a API iniciou sem erro de conexão com o banco.
3. Abra o front-end e faça um cadastro de usuário.
4. Faça login e valide as áreas protegidas de gestação, bebê, jornada e perfil.

## 🧯 6. Solução de problemas

### Porta já utilizada

Altere a variável correspondente no `.env` e reinicie o Compose. Se a API for executada fora do Docker, ajuste também a configuração do servidor e `VITE_API_URL`.

### Erro de conexão com o MySQL

Verifique o estado dos serviços:

```bash
docker compose ps
docker compose logs mysql-db
```

Em execução híbrida, a API deve usar `DB_HOST=localhost` e `MYSQL_PORT=3306`.

### Alterações no SQL não aparecem

O script inicial não é reaplicado em um volume existente. Alterações versionadas em `backend/src/main/resources/db/migration` são aplicadas pela API na inicialização; para alterações feitas somente em `database/maternidade.sql`, em desenvolvimento, recrie o volume com `docker compose down -v` e suba a stack novamente.

### Dependências do front-end inconsistentes

Remova `frontend/node_modules` e reinstale usando o lockfile:

```bash
cd frontend
npm ci
```

## ⏹️ 7. Encerramento

Use `Ctrl+C` para interromper processos executados no host. Para parar os containers sem remover dados:

```bash
docker compose stop
```

Para remover containers e o volume do banco:

```bash
docker compose down -v
```
