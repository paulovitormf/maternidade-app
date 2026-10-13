<div align="center">

# 🏗️ Arquitetura e organização

### Uma experiência acolhedora em camadas bem definidas

[![Front-end](https://img.shields.io/badge/Front--end-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#-front-end)
[![Back-end](https://img.shields.io/badge/Back--end-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](#-back-end)
[![Banco](https://img.shields.io/badge/Banco-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#-banco-de-dados)

</div>

## 📚 Sumário

- [🌷 Visão geral](#-visão-geral)
- [⚙️ Back-end](#-back-end)
- [🎨 Front-end](#-front-end)
- [🗄️ Banco de dados](#-banco-de-dados)
- [🔐 Fluxo de autenticação](#-fluxo-de-autenticação)
- [✨ Princípios de evolução](#-princípios-de-evolução)

## 🌷 Visão geral

O Maternidade é organizado como uma aplicação web em três partes:

```text
Navegador
   │
   ▼
React + Vite ── HTTP/JSON ──▶ API Spring Boot ── JPA/JDBC ──▶ MySQL
```

O front-end concentra a experiência de uso e o estado da sessão. A API concentra autenticação, regras de negócio e acesso aos dados. O MySQL persiste usuários, gestações, crianças e demais entidades do domínio.

## ⚙️ Back-end

O código da API está em `backend/src/main/java/br/com/maternidade`:

| Pacote | Responsabilidade |
| --- | --- |
| `controller` | Expõe endpoints REST e traduz requisições HTTP |
| `services` | Implementa regras de negócio e coordena persistência |
| `repository` | Acessa dados por Spring Data JPA |
| `model` | Representa entidades persistidas |
| `dto` | Define objetos de entrada e saída da API |
| `config` | Segurança, filtro e geração de tokens JWT |

A autenticação é stateless: o login retorna um token JWT, e as rotas protegidas usam o token enviado no cabeçalho `Authorization`.

## 🎨 Front-end

O código da aplicação está em `frontend/src`:

| Diretório/arquivo | Responsabilidade |
| --- | --- |
| `App.tsx` | roteamento, layout e proteção das rotas |
| `pages/` | telas de login, cadastro, dashboard e perfil |
| `components/` | componentes de interface reutilizáveis |
| `services/` | comunicação com a API e dados de sessão |
| `index.css` | estilos globais e tokens visuais |

As rotas de cadastro de bebê, gestação, marcos e perfil exigem sessão válida. Usuários não autenticados são encaminhados para `/login`.

## 🗄️ Banco de dados

O schema inicial fica em [database/maternidade.sql](../database/maternidade.sql) e é montado pelo Compose no primeiro start do MySQL. O back-end usa `spring.jpa.hibernate.ddl-auto=validate`, portanto não altera automaticamente a estrutura do banco.

O schema contempla entidades de diferentes frentes do produto. A existência de uma tabela não significa que já exista uma tela ou endpoint correspondente; a implementação disponível deve ser consultada nos controllers e services.

## 🔐 Fluxo de autenticação

1. O usuário envia e-mail e senha para `POST /api/usuarios/login`.
2. A API autentica o usuário e retorna um JWT junto dos dados públicos.
3. O front-end armazena o token e o utiliza nas requisições protegidas.
4. O filtro JWT valida o token antes de permitir o acesso.
5. Ao sair, o front-end remove os dados locais da sessão.

## ✨ Princípios de evolução

- Manter contratos de API explícitos e documentados.
- Não acoplar a interface diretamente ao banco.
- Reutilizar serviços e componentes antes de duplicar lógica.
- Preservar segurança, responsividade e acessibilidade nas novas telas.
- Atualizar documentação junto com mudanças de comportamento.
