# Kanban - Next.js

Este é um projeto de Kanban desenvolvido em [Next.js](https://nextjs.org), utilizando React, TypeScript e drag-and-drop para organização de tarefas.

## Funcionalidades

- Visualização de tarefas em colunas por status (Backlog, Análise, Em Tratamento, Aguarda Cliente, Aguarda Proposta, Fechado)
- Cards de tarefas fixos no código
- Arraste e solte (drag and drop) entre colunas
- Filtros por cliente e técnico
- Interface responsiva

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura dos dados

Os cards são definidos diretamente no arquivo `src/app/page.tsx`, no array `staticProblemas`. Cada card possui os seguintes campos:

- `id`: string
- `NºPat`: número do patrimônio
- `NCont`: número de contato
- `Nome`: nome do cliente
- `ProblemaDescricao`: descrição do problema
- `Status`: status da tarefa
- `Tecnico`: nome do técnico responsável
- `Data`: data/hora do registro
- `posicao`: posição na coluna

## Customização

Para adicionar ou editar cards, altere o array `staticProblemas` em `src/app/page.tsx`.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (drag and drop)

## Licença

Este projeto é apenas para fins de estudo e demonstração.