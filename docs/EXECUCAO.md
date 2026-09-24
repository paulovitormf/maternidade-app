<div align="center">

# 🍼 Maternidade

### Guia prático para executar o projeto localmente

Suba o banco de dados, a API e a aplicação web seguindo este passo a passo.

[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Stack%20completa-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-1-execução-completa-via-docker-compose) [![HMR](https://img.shields.io/badge/Front--end-HMR-F24E1E?style=for-the-badge&logo=vite&logoColor=white)](#-2-abordagem-mista-com-devtools-e-hmr) [![DevTools](https://img.shields.io/badge/Spring%20Boot-DevTools-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](#-2-abordagem-mista-com-devtools-e-hmr)

</div>

## 📚 Sumário

- [✅ Pré-requisitos](#-pré-requisitos)
- [⚡ Escolha da abordagem](#-escolha-da-abordagem)
- [🐳 1. Execução completa via Docker Compose](#-1-execução-completa-via-docker-compose)
- [⚡ 2. Abordagem mista com DevTools e HMR](#-2-abordagem-mista-com-devtools-e-hmr)
- [🗄️ 3. Subir o banco de dados](#️-3-subir-o-banco-de-dados)
- [⚙️ 4. Executar o back-end no host](#️-4-executar-o-back-end-no-host)
- [💻 5. Executar o front-end no host](#-5-executar-o-front-end-no-host)
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
| Front-end | [Node.js](https://nodejs.org/) e npm | 24.x |

> 💡 O Docker Desktop precisa estar aberto e em execução antes de criar o banco.

## ⚡ Escolha da abordagem

| Abordagem | Indicada para | O que roda no Docker | O que roda na máquina host |
| --- | --- | --- | --- |
| 🐳 **Docker Compose** | Produção, entregas, apresentações e testes de integração | MySQL 8, API e front-end | Nada além do Docker |
| ⚡ **DevTools + HMR** | Desenvolvimento do dia a dia | MySQL 8 | API e front-end |

## 🐳 1. Execução completa via Docker Compose

Esta opção executa toda a stack em containers isolados e é ideal para apresentar o projeto à banca ou ao professor, fazer entregas e validar a integração sem instalar as dependências da aplicação na máquina.

### Pré-requisito

- Docker ou Docker Desktop instalado e em execução.

Na raiz do projeto, execute:

```bash
cp .env.example .env
docker compose up --build
```

O projeto usa o `.env` quando ele existe. Se o `.env` ainda não existir, a API e o Vite usam os valores de `.env.example` como fallback; para o Docker Compose, crie o `.env` a partir do exemplo antes de iniciar a stack. O arquivo define o banco `maternidade_db`, o usuário e as portas usadas pelo Compose. O comando cria as imagens quando necessário, inicia o MySQL 8, aguarda o banco ficar saudável e sobe a API e o front-end.

### Endereços de acesso

| Serviço | Endereço |
| --- | --- |
| Front-end | <http://localhost:5173> |
| Back-end (API) | <http://localhost:8080> |
| MySQL | `localhost:3306` |

O front-end também pode usar a porta `3000` caso o `vite.config.ts` e o mapeamento do Compose sejam configurados para ela. A configuração atual do projeto usa `5173`.

Para executar em segundo plano:

```bash
docker compose up --build -d
```

## ⚡ 2. Abordagem mista com DevTools e HMR

Nesta opção, somente o banco de dados roda isolado no Docker. A API Spring Boot e o front-end React/Vite rodam nativamente na máquina, o que torna o ciclo de alteração e teste mais rápido.

### Vantagens

- **HMR no front-end:** alterações em React/Vite aparecem instantaneamente no navegador, sem reload completo.
- **Spring Boot DevTools:** alterações no código Java provocam recompilação e reinicialização automática da API, normalmente em poucos segundos.
- Menor consumo de memória e execução mais ágil para o desenvolvimento diário.

Antes de começar, instale Docker, Java 17 ou superior, Maven 3.9 ou superior e Node.js 24.x.

## 🗄️ 3. Subir o banco de dados

Há duas formas de executar o MySQL: pelo container do projeto ou instalado diretamente na máquina.

### Opção A: MySQL no Docker

Na raiz do projeto, crie o arquivo de ambiente caso ainda não exista e inicie somente o serviço `mysql-db`:

```bash
cp .env.example .env
docker compose up mysql-db
```

Confirme se o container está ativo em outro terminal:

```bash
docker ps
```

Se o container já existir e estiver parado, use:

```bash
docker start mysql-maternidade
```

O banco ficará disponível em `localhost:3306`, com os valores padrão do `.env.example`:

| Configuração | Valor padrão |
| --- | --- |
| Banco | `maternidade_db` |
| Usuário | `root` |
| Senha | `1234` |

### Opção B: MySQL instalado na máquina

Instale o [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) e o cliente `mysql`. No Linux, o serviço pode ser iniciado com:

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

Crie o banco e o usuário usados pelo back-end local:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS maternidade_db;
CREATE USER IF NOT EXISTS 'maternidade_user'@'localhost' IDENTIFIED BY 'maternidade_password';
GRANT ALL PRIVILEGES ON maternidade_db.* TO 'maternidade_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

O back-end já usa esses valores como padrão quando executado fora do Docker. Se o MySQL estiver em outra porta ou com credenciais diferentes, exporte `DB_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` e `MYSQL_PASSWORD` antes de iniciar a API.

## ⚙️ 4. Executar o back-end no host

Em um novo terminal, entre na pasta do back-end:

```bash
cd backend
```

Execute a API com o Maven Wrapper, quando ele estiver disponível no checkout:

```bash
./mvnw spring-boot:run
```

Como o Maven Wrapper ainda não está versionado neste projeto, use:

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

## 💻 5. Executar o front-end no host

Em outro terminal, entre na pasta da aplicação web:

```bash
cd frontend
```

Instale as dependências do projeto:

```bash
npm ci
```

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

🌐 Abra no navegador o endereço exibido pelo Vite, normalmente <http://localhost:5173>.

## 🔎 Validar a execução

Antes de começar a usar a aplicação, confira:

- [ ] O container `mysql-maternidade` aparece no comando `docker ps` ou o serviço MySQL local está ativo.
- [ ] A API iniciou sem erros no terminal do back-end.
- [ ] O endereço <http://localhost:8080> está acessível.
- [ ] O front-end abriu no endereço informado pelo Vite.
- [ ] As requisições do front-end para a API não apresentam erro de conexão.

### 📍 Endereços padrão

| Serviço | Endereço |
| --- | --- |
| API Spring Boot | <http://localhost:8080> |
| Aplicação web | <http://localhost:5173> |
| MySQL | `localhost:3306` |

## 🧯 Solução de problemas

### ❌ `Connection to localhost:3306 refused`

O MySQL não está em execução. Inicie o container:

```bash
docker start mysql-maternidade
```

Se o container ainda não existir, repita o comando de criação da [primeira etapa](#-1-execução-completa-via-docker-compose).

Se estiver usando uma instalação local, verifique o serviço:

```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

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
npm ci
npm run dev
```

### ❌ `mvn` não é reconhecido

Instale o [Maven](https://maven.apache.org/download.cgi), configure a variável `PATH` e abra um novo terminal. Se o repositório tiver Maven Wrapper, use o comando específico do seu sistema operacional mostrado na etapa 2.

## ⏹️ Encerrar os serviços

Para parar a API e o front-end, pressione `Ctrl + C` nos respectivos terminais.

Para parar o banco em Docker sem remover os dados:

```bash
docker stop mysql-maternidade
```

Para remover o container e os dados armazenados nele:

```bash
docker compose down -v
```

> ⚠️ O último comando remove o container. Use-o apenas se quiser recriar o banco do zero.
