<div align="center">

# 🌸 Guia de contribuição

### Como colaborar com cuidado, consistência e identidade

[![Branches](https://img.shields.io/badge/Branches-dev%20%7C%20main-C8526B?style=for-the-badge&logo=git&logoColor=white)](#-fluxo-de-branches)
[![Commits](https://img.shields.io/badge/Commits-Conventional-3B7280?style=for-the-badge&logo=git&logoColor=white)](#-commits)

</div>

## 📚 Sumário

- [🌱 Antes de começar](#-antes-de-começar)
- [🌿 Fluxo de branches](#-fluxo-de-branches)
- [📝 Commits](#-commits)
- [🎨 Padrões do projeto](#-padrões-do-projeto)
- [✅ Checklist](#-checklist-antes-de-abrir-uma-revisão)

Este guia define um fluxo simples para manter o trabalho organizado, preservar a estética do produto e manter o código e a documentação coerentes.

## 🌱 Antes de começar

1. Leia o [README](../README.md) e o [guia de execução](EXECUTION.md).
2. Confira as diretrizes complementares em [AGENTS.md](AGENTS.md).
3. Reproduza o ambiente local antes de alterar o projeto.
4. Nunca adicione credenciais, tokens ou arquivos `.env` ao repositório.

## 🌿 Fluxo de branches

O repositório usa um fluxo de integração baseado em duas branches principais:

| Branch | Finalidade | Regra |
| --- | --- | --- |
| `main` | versão estável do projeto | não recebe commits diretos |
| `dev` | integração e validação da equipe | recebe as branches de trabalho após revisão local |

Branches de trabalho devem ser criadas sempre a partir da `dev`:

```bash
git switch dev
git pull origin dev
git switch -c feature/nome-da-entrega
```

Prefixos recomendados:

| Prefixo | Uso |
| --- | --- |
| `feature/` | funcionalidade nova |
| `fix/` | correção de comportamento |
| `refactor/` | reorganização sem mudança intencional de comportamento |
| `docs/` | documentação |
| `test/` | testes |

Use nomes curtos, em minúsculas, separados por hífens e relacionados à entrega. Exemplos:

```text
feature/cadastro-crianca
fix/validacao-login
refactor/organiza-servico-gestacao
docs/atualiza-guia-execucao
```

### Fluxo de integração

1. Crie a branch de trabalho a partir da `dev`.
2. Desenvolva e valide a alteração localmente.
3. Atualize a branch com a `dev` antes da integração, quando necessário.
4. Integre a branch de trabalho na `dev` e execute as validações do projeto.
5. Use Pull Request para promover a `dev` para a `main` depois da revisão e da validação da equipe.

Não abra Pull Requests de branches de trabalho diretamente para `main`. A `dev` é o ponto de integração do desenvolvimento; a `main` deve receber somente alterações estáveis.

## 📝 Commits

Todos os commits devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(escopo): descrição curta no imperativo
```

### Tipos permitidos

| Tipo | Quando usar |
| --- | --- |
| `feat` | nova funcionalidade |
| `fix` | correção de comportamento |
| `docs` | documentação |
| `style` | formatação ou estilo sem mudança de lógica |
| `refactor` | reorganização sem mudança intencional de comportamento |
| `test` | criação ou alteração de testes |
| `chore` | dependências, build, Docker ou configuração |

O escopo é opcional, mas recomendado quando identifica a área alterada, como `frontend`, `backend`, `database` ou `docs`. A descrição deve ser curta, objetiva, escrita no imperativo e sem ponto final.

Exemplos:

```text
feat(frontend): adiciona cadastro de criança
fix(backend): corrige vínculo da gestação ao usuário
docs: atualiza guia de execução
chore(database): atualiza script inicial do schema
```

Evite commits genéricos, como `ajustes`, `mudanças` ou `final`, e não misture alterações de assuntos diferentes no mesmo commit. Quando uma alteração incompatível exigir atenção especial, registre a quebra no corpo do commit e na documentação correspondente.

## 🎨 Padrões do projeto

### Front-end

- Prefira componentes funcionais e tipos explícitos em TypeScript.
- Reutilize componentes e serviços existentes antes de criar duplicações.
- Preserve a identidade visual: rosa quartzo `#C8526B`, pêssego `#FADCE1`, azul petróleo `#3B7280` e fundo `#FDF7F8`.
- Mantenha a experiência responsiva e os estados de carregamento, erro e sessão.
- Atualize a documentação quando uma rota, variável de ambiente ou fluxo de usuário mudar.

### Back-end

- Mantenha a separação `controller`, `services`, `repository`, `model` e `dto`.
- Coloque regras de negócio nos services, não nos controllers.
- Evite expor entidades diretamente quando um DTO já fizer parte do contrato.
- Valide a associação entre o usuário autenticado e os recursos consultados ou alterados.
- Use configuração por ambiente; não inclua segredos no código.

### Banco e infraestrutura

- Documente alterações estruturais no [schema SQL](../database/maternidade.sql).
- Lembre-se de que o SQL é inicializado apenas na criação do volume MySQL.
- Se alterar portas ou variáveis, atualize `.env.example`, `docker-compose.yml` e este guia quando necessário.

## ✅ Checklist antes de abrir uma revisão

- [ ] A alteração tem escopo claro e não inclui arquivos ou segredos locais.
- [ ] A branch foi criada a partir da `dev` e possui nome padronizado.
- [ ] Os commits seguem Conventional Commits.
- [ ] O front-end passa em `npm run build`.
- [ ] O back-end passa em `mvn test`.
- [ ] O fluxo alterado foi validado manualmente.
- [ ] A documentação e os links continuam corretos.
- [ ] A interface mantém a responsividade e a paleta do produto.

Na descrição da revisão, informe o que foi alterado, como a mudança foi validada e, quando aplicável, inclua capturas de tela ou observações sobre configuração de ambiente.
