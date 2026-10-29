<div align="center">

# 🔌 API REST

### Os dados da maternidade, conectados com segurança

[![REST](https://img.shields.io/badge/API-REST-3B7280?style=for-the-badge&logo=springboot&logoColor=white)](#-informações-gerais)
[![JWT](https://img.shields.io/badge/Auth-JWT-C8526B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](#-autenticação-e-usuários)

</div>

## 📚 Sumário

- [📍 Informações gerais](#-informações-gerais)
- [👤 Autenticação e usuários](#-autenticação-e-usuários)
- [🤰 Gestações](#-gestações)
- [👶 Crianças](#-crianças)
- [✨ Jornada do desenvolvimento](#-jornada-do-desenvolvimento)
- [🧯 Respostas e erros](#-respostas-e-erros)
- [🔄 Atualização deste documento](#-atualização-deste-documento)

## 📍 Informações gerais

- URL local: `http://localhost:8080`
- Prefixo dos endpoints: `/api`
- Formato: JSON
- Autenticação: Bearer token JWT nas rotas protegidas

Exemplo de cabeçalho:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 👤 Autenticação e usuários

| Método | Endpoint | Proteção | Uso |
| --- | --- | --- | --- |
| `POST` | `/api/usuarios` | pública | cadastra um usuário |
| `POST` | `/api/usuarios/login` | pública | autentica e retorna JWT |
| `GET` | `/api/usuarios/busca?q={nome}` | JWT | busca até 8 usuários pelo nome, sem incluir o usuário autenticado |

Exemplo de login:

```bash
curl -X POST http://localhost:8080/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pessoa@example.com","senha":"sua-senha"}'
```

Uma autenticação bem-sucedida retorna um objeto com o token e os dados públicos do usuário. Credenciais inválidas retornam `401 Unauthorized`.

## 🤰 Gestações

| Método | Endpoint | Proteção | Uso |
| --- | --- | --- | --- |
| `POST` | `/api/gestacoes` | JWT | cadastra uma gestação para o usuário autenticado |
| `GET` | `/api/gestacoes` | JWT | lista as gestações do usuário autenticado |
| `PUT` | `/api/gestacoes/{idGestacao}` | JWT | atualiza uma gestação pertencente ao usuário |

## 👶 Crianças

| Método | Endpoint | Proteção | Uso |
| --- | --- | --- | --- |
| `POST` | `/api/criancas` | JWT | cadastra uma criança vinculada ao usuário autenticado |
| `GET` | `/api/criancas` | JWT | lista as crianças do usuário autenticado com seu nível de acesso |
| `POST` | `/api/criancas/{idCrianca}/responsaveis` | JWT | adiciona um usuário cadastrado como responsável de uma criança do usuário principal |

O corpo de `POST /api/criancas/{idCrianca}/responsaveis` recebe `{"id_usuario": 123}`. Somente o responsável principal da criança pode conceder o vínculo; usuários já vinculados não podem ser adicionados novamente. O responsável recebe acesso secundário, somente para leitura, sem ações de gerenciamento no perfil. A listagem informa `tipoAcesso` (`PRINCIPAL` ou `RESPONSAVEL`) e `podeEditar`, para que a interface apresente apenas as ações permitidas ao usuário. Não há endpoint de exclusão de crianças.

## ✨ Jornada do desenvolvimento

| Método | Endpoint | Proteção | Uso |
| --- | --- | --- | --- |
| `GET` | `/api/jornadas-desenvolvimento` | JWT | lista as jornadas disponíveis |

## 🧯 Respostas e erros

Os endpoints de criação respondem normalmente com `201 Created`; consultas e atualizações bem-sucedidas usam `200 OK`. Falhas de autenticação retornam `401`, enquanto erros de validação ou processamento dos dados podem retornar `400`.

O formato textual das mensagens de erro ainda pode variar entre controllers. Clientes devem usar o status HTTP como fonte principal para tratar falhas e apresentar mensagens adequadas ao usuário.

## 🔄 Atualização deste documento

Ao criar ou alterar um controller, atualize esta tabela com método, caminho, proteção e finalidade. Exemplos de payload devem ser derivados dos DTOs em `backend/src/main/java/br/com/maternidade/dto`, para que a documentação não se afaste do contrato implementado.
