# Luan Albuquerque Fotografia

Site institucional (landing page) da marca **Luan Albuquerque Fotografia**.

## Site online

Após a publicação, o link público ficará disponível neste repositório (GitHub Pages / Vercel).

## Como editar textos e contatos

Abra o arquivo [`js/config.js`](js/config.js). Lá você altera:

- Nome e slogan
- Texto “Sobre”
- WhatsApp e Instagram
- Serviços e portfólio

Não é preciso mexer no HTML/CSS para conteúdo.

## Como trocar fotos

No `config.js`, em `portfolio` e `about`, preencha o campo `image` com o caminho da foto, por exemplo:

```js
image: "assets/photos/casamento-01.jpg"
```

Coloque as imagens na pasta `assets/photos/` (crie a pasta se ainda não existir).

## Publicar na nuvem

Este projeto é estático (só HTML, CSS e JS). Qualquer hospedagem estática funciona:

1. **GitHub Pages** — Settings → Pages → Deploy from branch `main` / pasta `/` (raiz)
2. **Vercel** — Importar o repositório; build command vazio; output: `.`
3. **Netlify** — Arrastar a pasta do projeto ou conectar o Git

Não precisa instalar Node nem rodar servidor no seu PC para o visitante acessar o site.

## Estrutura

```
index.html
css/styles.css
js/config.js      ← edite aqui
js/main.js
assets/brand/     ← logos
assets/icons/     ← ícones dos serviços
```
