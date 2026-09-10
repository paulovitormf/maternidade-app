<div align="center">

# 🍼 Maternidade

### Guia prático para executar o projeto localmente

Suba o banco de dados, a API e a aplicação web seguindo este passo a passo.

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#-pré-requisitos) [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-API-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](#️-2-executar-o-back-end) [![React](https://img.shields.io/badge/React-Front--end-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#-3-executar-o-front-end) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Banco-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#️-1-subir-o-banco-de-dados)

</div>

## 📚 Sumário

- [✅ Pré-requisitos](#-pré-requisitos)
- [⚡ Execução rápida](#-execução-rápida)
- [🗄️ 1. Subir o banco de dados](#️-1-subir-o-banco-de-dados)
- [⚙️ 2. Executar o back-end](#️-2-executar-o-back-end)
- [💻 3. Executar o front-end](#-3-executar-o-front-end)
- [🔎 Validar a execução](#-validar-a-execução)
- [🧯 Solução de problemas](#-solução-de-problemas)
- [⏹️ Encerrar os serviços](#️-encerrar-os-serviços)

## ✅ Pré-requisitos

Instale as ferramentas abaixo antes de começar:

| Componente | Ferramenta | Versão recomendada |
| --- | --- | --- |
| Banco de dados | [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Versão atual |
| Back-end | [Java JDK](https://www.oracle.com/java/technologies/downloads/) | 17 ou superior |
| Back-end | [Maven](https://maven.apache.org/download.cgi) | 3.9 ou superior |
| Front-end | [Node.js](https://nodejs.org/) e npm | 18 ou superior |

> 💡 O Docker Desktop precisa estar aberto e em execução antes de criar o banco.

## ⚡ Execução rápida

Abra **três terminais**, na raiz do projeto, e execute os serviços nesta ordem:

| Terminal | Pasta | Comando | Serviço |
| --- | --- | --- | --- |
| 1 | raiz do projeto | comando do [banco](#️-1-subir-o-banco-de-dados) | PostgreSQL |
| 2 | `backend` | `mvn spring-boot:run` | API Spring Boot |
| 3 | `frontend` | `npm run dev` | React + Vite |

> 🚦 Não avance para o próximo terminal antes de confirmar que o serviço anterior iniciou corretamente.

## 🗄️ 1. Subir o banco de dados

Crie um container PostgreSQL com as configurações usadas pela aplicação:

```bash
docker run --name postgres-maternidade \
  -e POSTGRES_DB=maternidade_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:latest
```

Confirme se o container está ativo:

```bash
docker ps
```

Se o container já existir e estiver parado, use:

```bash
docker start postgres-maternidade
```

### 🖱️ Criar pelo Docker Desktop

1. Abra o **Docker Desktop**.
2. Acesse **Images**, procure por `postgres` e clique em **Run**.
3. Em **Optional settings**, informe os valores abaixo:

   | Configuração | Valor |
   | --- | --- |
   | Container name | `postgres-maternidade` |
   | Host port | `5432` |
   | `POSTGRES_DB` | `maternidade_db` |
   | `POSTGRES_USER` | `postgres` |
   | `POSTGRES_PASSWORD` | `postgres` |

4. Clique em **Run**.

## ⚙️ 2. Executar o back-end

Em um novo terminal, entre na pasta do back-end:

```bash
cd backend
```

Execute a API com o Maven:

```bash
mvn spring-boot:run
```

Se o projeto possuir o Maven Wrapper, também é possível usar:

### Windows PowerShell

```powershell
.\mvnw spring-boot:run
```

### Linux e macOS

```bash
./mvnw spring-boot:run
```

✅ Quando a inicialização terminar, a API estará disponível em <http://localhost:8080>.

## 💻 3. Executar o front-end

Em outro terminal, entre na pasta da aplicação web:

```bash
cd frontend
```

Instale as dependências do projeto:

```bash
npm install
```

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

🌐 Abra no navegador o endereço exibido pelo Vite, normalmente <http://localhost:5173>.

## 🔎 Validar a execução

Antes de começar a usar a aplicação, confira:

- [ ] O container `postgres-maternidade` aparece no comando `docker ps`.
- [ ] A API iniciou sem erros no terminal do back-end.
- [ ] O endereço <http://localhost:8080> está acessível.
- [ ] O front-end abriu no endereço informado pelo Vite.
- [ ] As requisições do front-end para a API não apresentam erro de conexão.

### 📍 Endereços padrão

| Serviço | Endereço |
| --- | --- |
| API Spring Boot | <http://localhost:8080> |
| Aplicação web | <http://localhost:5173> |
| PostgreSQL | `localhost:5432` |

## 🧯 Solução de problemas

### ❌ `Connection to localhost:5432 refused`

O PostgreSQL não está em execução. Inicie o container:

```bash
docker start postgres-maternidade
```

Se o container ainda não existir, repita o comando de criação da [primeira etapa](#️-1-subir-o-banco-de-dados).

### ❌ `Port 8080 is already in use`

A porta da API está sendo usada por outro processo. Encerre o processo ou altere a porta no arquivo `application.properties`:

```properties
server.port=8081
```

Depois, atualize também o endereço utilizado pelo front-end.

### ❌ `ERR_CONNECTION_REFUSED` no front-end

Confirme se a API terminou de iniciar e se está disponível em <http://localhost:8080>. O banco também precisa estar ativo.

### ❌ `npm run dev` não funciona

Verifique se você está na pasta `frontend` e instale as dependências novamente:

```bash
cd frontend
npm install
npm run dev
```

### ❌ `mvn` não é reconhecido

Instale o [Maven](https://maven.apache.org/download.cgi), configure a variável `PATH` e abra um novo terminal. Se o repositório tiver Maven Wrapper, use o comando específico do seu sistema operacional mostrado na etapa 2.

## ⏹️ Encerrar os serviços

Para parar a API e o front-end, pressione `Ctrl + C` nos respectivos terminais.

Para parar o banco sem remover os dados:

```bash
docker stop postgres-maternidade
```

Para remover o container e os dados armazenados nele:

```bash
docker rm -f postgres-maternidade
```

> ⚠️ O último comando remove o container. Use-o apenas se quiser recriar o banco do zero.
