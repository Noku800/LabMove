# LabMove — Laboratório de Ideias da Escola

Site do projeto LabMove: um clube de inovação para estudantes identificarem desafios da escola, proporem soluções, apoiarem ideias e acompanharem projetos.

## Funcionalidades
- Cadastro de ideias por título, descrição e categoria.
- Análise orientativa simulada por palavras-chave (não conectada a uma IA externa).
- Votação/apoio às ideias.
- Transformação de ideias em projetos e atualização de status.
- Painel de indicadores, filtros e ordenação.
- Matriz SWOT / FOFA.
- Tema claro/escuro e layout responsivo.
- Seções sobre tecnologias, sustentabilidade e equipe.

## Identificação
- **Integrantes:** Kauã Douglas, Jhon Bryan e Nicholas Lopes
- **Curso:** Técnico em Desenvolvimento de Sistemas
- **Escola:** E.E. Major Cosme de Faria
- **Orientador:** Prof. Robertson E. Silva
- **Ano:** 2026

## Tecnologias desta versão
HTML5, CSS3 e JavaScript puro. Os dados são armazenados no navegador por `localStorage`.

Node.js, APIs REST, PostgreSQL, integração real com IA e recursos PWA aparecem como arquitetura/possibilidades de evolução, mas não estão implementados como serviços nesta versão estática.

## Executar
Abra `index.html` no navegador. Opcionalmente, execute `python -m http.server 8000` na pasta e acesse `http://localhost:8000`.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub chamado `labmove`.
2. Envie os arquivos `index.html`, `styles.css`, `script.js`, `README.md` e `.gitignore` para a raiz do repositório.
3. Abra **Settings** → **Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
6. Após a publicação, o endereço será `https://SEU-USUARIO.github.io/labmove/` (substitua `SEU-USUARIO` pelo seu usuário do GitHub).

## Observação
Como esta versão usa `localStorage`, ideias e votos ficam salvos apenas no navegador/dispositivo em que foram cadastrados. Para compartilhar os dados entre os alunos, será necessário conectar um Back-End e um banco de dados.

**LabMove — Alunos criando soluções para a própria escola.**
