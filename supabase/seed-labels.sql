update public.photo_slots set label = case id
  when 'hero_main' then 'Hero — imagem de fundo'
  when 'about_portrait' then 'Sobre — retrato do fotógrafo'
  when 'portfolio_1' then 'Portfólio 1 — Casamento'
  when 'portfolio_2' then 'Portfólio 2 — Gestante'
  when 'portfolio_3' then 'Portfólio 3 — Família'
  when 'portfolio_4' then 'Portfólio 4 — Ensaio externo'
  when 'portfolio_5' then 'Portfólio 5 — Eventos'
  when 'portfolio_6' then 'Portfólio 6 — Pré-wedding'
  else label
end;
