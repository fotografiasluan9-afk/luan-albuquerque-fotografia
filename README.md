# Luan Albuquerque Fotografia

Site institucional (landing page) + **Área do fotógrafo** (fotos e avaliações via Supabase).

## Site

- Público: `npm run dev` → http://localhost:4173
- Admin: http://localhost:4173/admin.html (rodapé → **Área do fotógrafo**)
- **Netlify:** https://luan-albuquerque-fotografia.netlify.app
- GitHub Pages: https://fotografiasluan9-afk.github.io/luan-albuquerque-fotografia/
- Supabase: https://supabase.com/dashboard/project/ulzmsipviqidwbpenqyt

## Login do fotógrafo

- URL: `/admin.html`
- E-mail: `luan@fotografia.com`
- Senha: a definida no Auth do Supabase (não fica no código)

## Avaliações (visitantes)

Na seção **Avaliações** do site público, qualquer pessoa pode:

1. Informar **nome ou Instagram**
2. Dar nota de **1 a 5 estrelas**
3. Escrever um **comentário** (até 500 caracteres)
4. Publicar **sem criar conta** — aparece na hora no site

No admin, bloco **Avaliações dos clientes**:

- Lista todas as avaliações
- Destaque em avaliações com **1–2 estrelas**
- Botão **Apagar** para remover comentários indesejados

Schema: [`supabase/schema-reviews.sql`](supabase/schema-reviews.sql)

## Supabase (já provisionado)

Projeto `luan-albuquerque-fotografia` (ref `ulzmsipviqidwbpenqyt`).  
[`js/supabase-config.js`](js/supabase-config.js) já tem a URL e a anon key.  
- Fotos: [`supabase/schema.sql`](supabase/schema.sql)
- Avaliações: [`supabase/schema-reviews.sql`](supabase/schema-reviews.sql)

## Como o fotógrafo usa o painel

1. Rodapé do site → **Área do fotógrafo**
2. Login com e-mail e senha
3. Gerenciar **fotos** (slots com formato 1:1 / 16:9 / 9:16)
4. Gerenciar **avaliações** (apagar as negativas)

### Painéis de foto e formatos

| Painel | Formato |
|--------|--------|
| Hero — imagem de fundo | Horizontal 16:9 |
| Sobre — retrato do fotógrafo | 1:1 |
| Portfólio 1 — Casamento | TikTok 9:16 |
| Portfólio 2 — Gestante | 1:1 |
| Portfólio 3 — Família | Horizontal 16:9 |
| Portfólio 4 — Ensaio externo | TikTok 9:16 |
| Portfólio 5 — Eventos | Horizontal 16:9 |
| Portfólio 6 — Pré-wedding | 1:1 |

## Textos e contatos

Continue editando [`js/config.js`](js/config.js) para slogan, WhatsApp, Instagram e texto Sobre.

## Estrutura

```
index.html
admin.html
js/config.js
js/supabase-config.js
js/supabase-client.js
js/main.js
js/admin.js
css/styles.css
css/admin.css
supabase/schema.sql
supabase/schema-reviews.sql
```

## Publicar

Site estático (GitHub Pages / Netlify / Vercel). Só a anon key no front — nunca a service role.
