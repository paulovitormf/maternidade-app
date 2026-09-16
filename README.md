<div align="center">

# 🍼 Maternidade

### Informação, acompanhamento e cuidado nos primeiros momentos da vida do bebê

Projeto acadêmico desenvolvido em grupo na disciplina de **Engenharia de Software II**.

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#-tecnologias) [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-API-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](#-tecnologias) [![React](https://img.shields.io/badge/React-Front--end-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#-tecnologias) [![MySQL](https://img.shields.io/badge/MySQL-Banco-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#-tecnologias) [![Docker](https://img.shields.io/badge/Docker-Ambiente-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-tecnologias)
<br>
<h3><a href="docs/EXECUCAO.md">📖&nbsp;&nbsp;Abrir guia de execução&nbsp;&nbsp;→</a></h3>

</div>

## ✨ Sobre

O **Maternidade** é uma aplicação web pensada para apoiar mães e responsáveis durante os primeiros momentos da vida do bebê. A proposta reúne conteúdos e recursos para organizar informações importantes da rotina, tornando o acompanhamento mais simples e acessível.

O projeto está sendo desenvolvido como trabalho acadêmico e aplica conceitos de desenvolvimento full-stack, integração entre serviços e organização de software.

## 🎯 Objetivos do projeto

- Reunir orientações úteis para os primeiros cuidados com o bebê.
- Facilitar o acompanhamento de informações da rotina e da evolução do bebê.
- Oferecer uma experiência simples, acessível e adaptável a diferentes telas.
- Praticar a construção e a integração de uma aplicação web completa.

## 🧰 Tecnologias

| Camada | Tecnologias |
| --- | --- |
| 🎨 Front-end | React, TypeScript, Vite e Tailwind CSS |
| ⚙️ Back-end | Java 17, Spring Boot e Spring Data JPA |
| 🗄️ Banco de dados | MySQL 8 |
| 📦 Ambiente | Docker e Docker Compose |

## 🏗️ Arquitetura

O front-end consome a API do back-end, que centraliza as regras da aplicação e acessa o banco de dados para persistir as informações.

```text
Usuário → Front-end → API REST → Banco de dados
```

## 🚀 Como executar

O repositório oferece duas formas de execução, detalhadas no [guia de execução](docs/EXECUCAO.md):

| Abordagem | Indicada para | Resumo |
| --- | --- | --- |
| 🐳 **Docker Compose** | Apresentações, entregas e testes de integração | Toda a stack roda em containers isolados. |
| ⚡ **DevTools + HMR** | Desenvolvimento do dia a dia | MySQL no Docker; API e front-end no host, com atualizações rápidas. |

O passo a passo completo, incluindo pré-requisitos, comandos, endereços de acesso e solução de problemas, está no [guia de execução](docs/EXECUCAO.md).

Para uma visão rápida, o Docker Compose inicia MySQL 8, API e front-end juntos. No desenvolvimento diário, apenas o banco roda em Docker e os demais serviços são iniciados localmente.

## 📁 Estrutura do projeto

```text
├── backend/       # API Spring Boot
├── database/      # Modelo e scripts do banco de dados
├── docs/          # Documentação do projeto
├── docker-compose.yml
└── frontend/      # Aplicação React com Vite
```

## 📚 Documentação

- [📖 Guia de execução](docs/EXECUCAO.md)
- [🗃️ Script do banco de dados](database/maternidade.sql)
- [🐳 Configuração dos serviços](docker-compose.yml)

## 👥 Equipe

- Ana Clara
- Ana Luiza
- Caroline
- Maria Eduarda
- Paulo Vitor
- Samira

## 📝 Status do projeto

🚧 Projeto acadêmico em desenvolvimento. Funcionalidades e documentação podem ser ampliadas ao longo da disciplina.

<div align="center">

Feito com 💙 pelo grupo Maternidade

</div>
