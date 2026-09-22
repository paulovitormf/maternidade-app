# Guia de Contribuição — Maternidade App 🌸

Ficamos muito felizes pelo seu interesse em contribuir para o **Maternidade App**! Este documento estabelece os padrões e boas práticas para garantir que o desenvolvimento permaneça organizado, escalável e alinhado entre toda a equipe.

---

## 📌 Sumário
1. [Fluxo de Trabalho com Branches (Gitflow)](#1-fluxo-de-trabalho-com-branches-gitflow)
2. [Padronização de Commits (Conventional Commits)](#2-padronização-de-commits-conventional-commits)
3. [Boas Práticas de Desenvolvimento](#3-boas-práticas-de-desenvolvimento)
   - [Back-end (Java / Spring Boot)](#back-end-java--spring-boot)
   - [Front-end (React / Tailwind CSS)](#front-end-react--tailwind-css)
4. [Processo de Pull Request e Code Review](#4-processo-de-pull-request-e-code-review)

---

## 1. Fluxo de Trabalho com Branches (Gitflow)

Para garantir a estabilidade da aplicação em produção e facilitar os testes locais, adotamos um fluxo de ramificação bem definido.

### Branches Principais:
* **`main`**: Código estável em produção. Nenhuma alteração é feita diretamente nesta branch.
* **`dev`**: Branch principal de integração e testes. Todas as novas funcionalidades e correções devem ser mescladas aqui primeiro para validação em equipe.

### Criação de Branches de Funcionalidades/Correções:
Sempre crie uma nova branch a partir da **`dev`**:

```bash
# 1. Garanta que sua branch dev local esteja atualizada
git checkout dev
git pull origin dev

# 2. Crie sua nova branch com um nome descritivo
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b fix/nome-da-correcao
```

### Padrão de Nomenclatura de Branches:
* `feature/` — Para desenvolvimento de novas funcionalidades (ex: `feature/cadastro-gestante`).
* `fix/` — Para correção de bugs (ex: `fix/erro-conexao-mysql`).
* `refactor/` — Para refatoração de código sem alteração de comportamento (ex: `refactor/dto-usuario`).
* `docs/` — Para alterações em documentações (ex: `docs/atualiza-readme`).

> ⚠️ **REGRA DE OURO PARA MERGES:**
> Nenhuma branch de funcionalidade deve ser aberta diretamente para a main. Todas as branches individuais DEVEM ser mescladas e testadas na branch dev primeiro. Após a validação completa na dev, é realizado o Pull Request da `dev` para a `main`.

---

## 2. Padronização de Commits (Conventional Commits)

Utilizamos o padrão **Conventional Commits** para manter o histórico claro, legível e auditável.

### Estrutura do Commit:
`<tipo>(escopo): <descrição curta no imperativo>`

### Tipos Permitidos:
* **`feat`**: Nova funcionalidade no sistema.
* **`fix`**: Correção de um bug.
* **`docs`**: Alterações na documentação (README.md, comentários, etc.).
* **`style`**: Ajustes de formatação, espaçamento ou sintaxe sem alterar a lógica (ex: ajustes no Tailwind).
* **`refactor`**: Reestruturação de código sem mudar a regra de negócio.
* **`test`**: Adição ou correção de testes automatizados.
* **`chore`**: Atualizações de builds, dependências (package.json, pom.xml) ou configurações de ambiente.

### Exemplos Válidos:
* `feat(frontend): adiciona validacao no formulario de cadastro`
* `fix(backend): resolve excecao de comunicacao jdbc com mysql`
* `style(ui): ajusta cores dos botoes no componente de teste`
* `chore(deps): atualiza versao do vite para 5.4.11`

---

## 3. Boas Práticas de Desenvolvimento

### Back-end (Java 21 / Spring Boot 3.x)
* **Paridade de Ambiente:** Utilize as variáveis de ambiente parametrizadas via .env / application.properties. Nunca suba senhas ou credenciais fixas no código (hardcoded).
* **Arquitetura em Camadas:** Respeite a separação entre Controller, Service, Repository e Model.
* **Cross-Platform:** Certifique-se de que caminhos de arquivos e dependências sejam compatíveis tanto com Linux (Ubuntu) quanto com Windows.

### Front-end (React / Vite / Tailwind CSS)
* **Ambiente Node:** O ambiente oficial está padronizado na versão Node.js v20 LTS.
* **Gerenciamento de Pacotes:** Não adicione dependências pesadas ou experimentais sem consultar a equipe para evitar erros de resolução (ERESOLVE).
* **Componentização:** Crie componentes funcionais limpos, utilizando Hooks e mantendo as classes utilitárias do Tailwind organizadas.

---

## 4. Processo de Merge e Code Review

1. **Suba suas alterações para a branch `dev`:**
   * Após desenvolver e testar sua funcionalidade localmente, faça o checkout para a `dev` e realize o merge diretamente:
   ```bash
   git checkout dev
   git pull origin dev
   git merge feature/sua-branch
   git push origin dev
   ```
2. **Validação e Testes em Equipe:**
   * A branch **`dev`** servirá como o ambiente central de integração.
   * Toda a equipe testará as novas funcionalidades e correções diretamente na `dev`.
   * Caso algum bug seja encontrado durante os testes na `dev`, crie uma branch `fix/` a partir da `dev`, corrija o problema e faça o merge direto na `dev` novamente.

3. **Pull Request para a `main` (Produção):**
   * Quando um conjunto de funcionalidades na `dev` estiver totalmente testado e estável, abra um **Pull Request (PR) da branch `dev` para a branch `main`**.
   * Preencha a descrição do PR informando:
     - Resumo das funcionalidades/correções incluídas no lote.
     - Confirmação de que os testes locais foram validados.
     - Capturas de tela das novas interfaces (se houver).

4. **Aprovação e Merge Final:**
   * O PR da `dev` para a `main` passará pelo *Code Review* final da equipe.
   * Após a aprovação, o merge na `main` será realizado, promovendo as alterações para a versão de produção.