<div align="center">

# 🍼 Maternidade

### Informação, acompanhamento e cuidado para a jornada da maternidade

Aplicação web acadêmica desenvolvida em grupo na disciplina de **Engenharia de Software II**.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#-tecnologias)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](#-tecnologias)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#-tecnologias)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#-tecnologias)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-como-executar)

<br />

[🚀 Guia de execução](docs/EXECUTION.md) ·
[🏗️ Arquitetura](docs/ARCHITECTURE.md) ·
[🔌 API](docs/API.md) ·
[🤝 Contribuição](docs/CONTRIBUTING.md)

</div>

## ✨ Sobre o projeto

O **Maternidade** é uma aplicação web responsiva para apoiar mães, pais e responsáveis no acompanhamento da gestação e dos primeiros momentos da vida do bebê. A experiência combina uma interface acolhedora com recursos para centralizar informações pessoais, registros de gestação, dados da criança e a jornada do desenvolvimento.

O projeto nasceu como uma iniciativa acadêmica e aplica conceitos de desenvolvimento full-stack, arquitetura em camadas, autenticação e integração entre uma aplicação React, uma API REST e um banco de dados relacional.

> O sistema está em desenvolvimento. A documentação descreve o comportamento e as integrações disponíveis no código atual; entidades previstas no banco, mas ainda sem tela ou endpoint, não são apresentadas como funcionalidades concluídas.

## 🎯 Funcionalidades disponíveis

- Cadastro e autenticação de usuários com token JWT.
- Dashboard inicial após o login.
- Cadastro, listagem e edição de gestações.
- Cadastro e listagem de crianças vinculadas ao usuário.
- Consulta da jornada do desenvolvimento infantil.
- Consulta do calendário de vacinação do bebê até os 5 anos.
- Perfil do usuário e encerramento de sessão.
- Interface responsiva para desktop e dispositivos móveis.

## 🎨 Identidade visual

A interface preserva uma estética leve, acolhedora e editorial, baseada em rosa quartzo, pêssego pastel e azul petróleo. A tipografia de destaque utiliza **Playfair Display**, enquanto os textos de interface usam **DM Sans**.

| Uso | Cor |
| --- | --- |
| Ação principal e marca | `#C8526B` |
| Hover da ação principal | `#B0435B` |
| Superfícies suaves | `#FADCE1` |
| Destaques informativos | `#3B7280` |
| Fundo da aplicação | `#FDF7F8` |

As cores estão centralizadas no [tailwind.config.js](frontend/tailwind.config.js), evitando que a documentação e as telas mantenham paletas divergentes.

## 🧰 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 18, TypeScript, Vite 5, Tailwind CSS, React Router e Axios |
| Back-end | Java 21, Spring Boot 3.2.3, Spring Web, Spring Data JPA e Spring Security |
| Autenticação | JWT com JJWT 0.12.6 |
| Banco de dados | MySQL 8.0 |
| Ambiente | Docker, Docker Compose, Maven e npm |

## 🏗️ Organização do repositório

```text
maternidade-app/
├── backend/                 # API REST Spring Boot
│   └── src/main/java/       # Controllers, services, repositories, DTOs e models
├── frontend/                # SPA React + Vite
│   └── src/                 # Páginas, componentes e serviços HTTP
├── database/                # Schema SQL e modelo visual do banco
├── docs/                    # Guias técnicos e diretrizes do projeto
├── docker-compose.yml       # Orquestração do MySQL, API e front-end
└── .env.example             # Variáveis de ambiente sem segredos reais
```

Para entender o fluxo entre as camadas, consulte [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Para os endpoints atualmente expostos, consulte [docs/API.md](docs/API.md).

## 🚀 Como executar

### Pré-requisitos

- Docker Desktop ou Docker Engine com Compose.
- Java 21 ou superior e Maven 3.9 ou superior para execução local da API.
- Node.js 24.x e npm 10 ou superior para execução local do front-end.

### Execução completa com Docker

Na raiz do projeto:

```bash
cp .env.example .env
docker compose up --build
```

Depois, acesse:

- Aplicação: <http://localhost:5173>
- API: <http://localhost:8080>
- MySQL: `localhost:3306`

No Windows PowerShell, o equivalente à cópia do ambiente é:

```powershell
Copy-Item .env.example .env
```

Para rodar em segundo plano, use `docker compose up --build -d`. O guia de execução explica também como rodar somente o banco em Docker e a API e o front-end no host, com recarregamento rápido.

> Na primeira inicialização, o Compose monta [database/maternidade.sql](database/maternidade.sql) no MySQL. O script é executado apenas quando o volume ainda não possui um banco.

O passo a passo completo, as variáveis de ambiente e a solução de problemas estão em [docs/EXECUTION.md](docs/EXECUTION.md).

## 🧪 Validação local

```bash
# Front-end: testes unitários e build
cd frontend
npm ci
npm test
npm run build

# Back-end: testes unitários
cd ../backend
mvn --batch-mode test
```

Os mesmos comandos são executados automaticamente pelo GitHub Actions em todo `push` e `pull_request`, por meio de [.github/workflows/tests.yml](.github/workflows/tests.yml). Os testes unitários não precisam de MySQL, Docker ou serviços externos.

## 📚 Documentação

| Documento | Conteúdo |
| --- | --- |
| [Guia de execução](docs/EXECUTION.md) | Instalação, Docker, execução local, variáveis e troubleshooting |
| [Arquitetura](docs/ARCHITECTURE.md) | Limites das camadas, fluxo de dados e organização do código |
| [API](docs/API.md) | Endpoints, autenticação, respostas e exemplos de requisição |
| [Contribuição](docs/CONTRIBUTING.md) | Branches, Conventional Commits, revisão e checklist de alterações |
| [Requisitos](docs/REQUIREMENTS.md) | Requisitos funcionais e contexto acadêmico |
| [Script do banco](database/maternidade.sql) | Schema relacional inicial |

## 👥 Equipe

- Ana Clara
- Ana Luiza
- Caroline
- Maria Eduarda
- Paulo Vitor
- Samira

## 📌 Status

🚧 Projeto acadêmico em desenvolvimento. O escopo pode evoluir durante a disciplina, sempre mantendo a documentação próxima do comportamento implementado.

<div align="center">

Feito com 💙 pelo grupo Maternidade

</div>
