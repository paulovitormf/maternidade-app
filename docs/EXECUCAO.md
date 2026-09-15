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
- [🗄️ 3. Subir apenas o banco de dados](#️-3-subir-apenas-o-banco-de-dados)
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
| Front-end | [Node.js](https://nodejs.org/) e npm | 18 ou superior |

> 💡 O Docker Desktop precisa estar aberto e em execução antes de criar o banco.

## ⚡ Escolha da abordagem

| Abordagem | Indicada para | O que roda no Docker | O que roda na máquina host |
| --- | --- | --- | --- |
| 🐳 **Docker Compose** | Produção, entregas, apresentações e testes de integração | PostgreSQL, API e front-end | Nada além do Docker |
| ⚡ **DevTools + HMR** | Desenvolvimento do dia a dia | PostgreSQL | API e front-end |

## 🐳 1. Execução completa via Docker Compose

Esta opção executa toda a stack em containers isolados e é ideal para apresentar o projeto à banca ou ao professor, fazer entregas e validar a integração sem instalar as dependências da aplicação na máquina.

### Pré-requisito

- Docker ou Docker Desktop instalado e em execução.

Na raiz do projeto, execute:

```bash
docker compose up --build
```

O comando cria as imagens quando necessário, inicia o PostgreSQL, aguarda o banco ficar saudável e sobe a API e o front-end.

### Endereços de acesso

| Serviço | Endereço |
| --- | --- |
| Front-end | <http://localhost:5173> |
| Back-end (API) | <http://localhost:8080> |
| PostgreSQL | `localhost:5432` |

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

Antes de começar, instale Docker, Java 17 ou superior, Maven 3.9 ou superior e Node.js 18 ou superior.

## 🗄️ 3. Subir apenas o banco de dados

Na raiz do projeto, inicie somente o serviço `postgres-db`:

```bash
docker compose up postgres-db
```

Confirme se o container está ativo em outro terminal:

```bash
docker ps
```

Se o container já existir e estiver parado, use:

```bash
docker start postgres-maternidade
```

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
