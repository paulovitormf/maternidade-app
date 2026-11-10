<div align="center">

# 📋 Requisitos do Maternidade

### Um espaço de cuidado, acompanhamento e informação

[![Escopo](https://img.shields.io/badge/Escopo-em%20evolução-C8526B?style=for-the-badge&logo=heart&logoColor=white)](#-escopo-atual)
[![Projeto acadêmico](https://img.shields.io/badge/Projeto-acadêmico-3B7280?style=for-the-badge&logo=bookstack&logoColor=white)](#-contexto)

</div>

## 📚 Sumário

- [🌷 Contexto](#-contexto)
- [✨ Escopo atual](#-escopo-atual)
- [🔐 Requisitos funcionais](#-requisitos-funcionais)
- [🎨 Requisitos de experiência](#-requisitos-de-experiência)
- [🛡️ Requisitos técnicos](#️-requisitos-técnicos)
- [🌱 Evolução planejada](#-evolução-planejada)

## 🌷 Contexto

O Maternidade é uma aplicação web responsiva criada para apoiar mães, pais e responsáveis durante a gestação e os primeiros momentos da vida do bebê. O produto combina informação, organização e acolhimento em uma interface leve, com rosa quartzo, pêssego pastel e azul petróleo como elementos da sua identidade.

Este documento acompanha o comportamento implementado no código atual. Funcionalidades previstas no modelo de dados, mas ainda sem telas ou endpoints, são registradas como evolução e não como entrega concluída.

## ✨ Escopo atual

O sistema atualmente oferece:

- cadastro e autenticação de usuários;
- sessão autenticada com JWT;
- dashboard inicial;
- cadastro, listagem e edição de gestações;
- cadastro e listagem de crianças vinculadas ao usuário;
- consulta de jornada do desenvolvimento infantil;
- consulta dos calendários de vacinação materna e infantil em uma página unificada;
- consulta e edição do perfil;
- navegação responsiva para desktop e dispositivos móveis.

## 🔐 Requisitos funcionais

| Código | Requisito | Situação |
| --- | --- | --- |
| RF-01 | Permitir o cadastro de uma pessoa responsável. | ✅ Implementado |
| RF-02 | Autenticar o usuário por e-mail e senha. | ✅ Implementado |
| RF-03 | Restringir recursos pessoais a usuários autenticados. | ✅ Implementado |
| RF-04 | Cadastrar e consultar gestações do usuário. | ✅ Implementado |
| RF-05 | Atualizar dados de uma gestação existente. | ✅ Implementado |
| RF-06 | Cadastrar e consultar crianças vinculadas ao usuário. | ✅ Implementado |
| RF-07 | Exibir jornada do desenvolvimento infantil. | ✅ Implementado |
| RF-08 | Permitir consultar dados básicos do perfil. | ✅ Implementado |
| RF-09 | Exibir o calendário de vacinação de rotina do bebê até os 5 anos. | ✅ Implementado |
| RF-10 | Reunir os calendários de vacinação materna e infantil em uma página com seletor entre mãe e bebê, iniciando na vacinação materna. | ✅ Implementado |

## 🎨 Requisitos de experiência

- A interface deve comunicar acolhimento, clareza e confiança.
- A aplicação deve funcionar em telas pequenas e grandes.
- A paleta visual deve permanecer consistente:
  - rosa quartzo: `#C8526B`;
  - pêssego pastel: `#FADCE1`;
  - azul petróleo: `#3B7280`;
  - fundo suave: `#FDF7F8`.
- Estados de carregamento, erro, sessão expirada e sucesso devem ser compreensíveis.
- Formulários devem apresentar rótulos, foco visível e mensagens úteis.
- O conteúdo de saúde deve ser tratado como apoio informativo, sem substituir avaliação profissional.

## 🛡️ Requisitos técnicos

- O back-end deve utilizar Java 21 e Spring Boot 3.2.3.
- O front-end deve utilizar React 18, TypeScript, Vite e Node.js 24.x.
- A persistência deve utilizar MySQL 8.0 no ambiente orquestrado pelo projeto.
- A API deve manter arquitetura em camadas e contratos JSON documentados.
- Credenciais e segredos devem ser configurados por ambiente, nunca fixados no código.
- Rotas protegidas devem exigir autenticação JWT.
- Alterações no banco devem ser refletidas no [schema SQL](../database/maternidade.sql) e na documentação.

## 🌱 Evolução planejada

O schema SQL já possui estruturas para futuras áreas, como registros de crescimento, alimentação, sono, vacinação, conteúdos, biblioteca, agenda e rede de apoio. Essas áreas podem ser implementadas gradualmente, sempre acompanhadas de:

1. requisito funcional atualizado;
2. endpoint e contrato documentados;
3. tela responsiva alinhada à identidade visual;
4. validação manual e automatizada;
5. atualização do [guia de contribuição](CONTRIBUTING.md) quando o fluxo técnico for afetado.

> A existência de uma tabela no banco não representa, por si só, uma funcionalidade disponível para o usuário.
