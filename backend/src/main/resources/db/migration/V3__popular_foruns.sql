INSERT IGNORE INTO usuario (nome, email, senha)
SELECT 'Comunidade Maternidade', 'comunidade@maternidade.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email = 'comunidade@maternidade.local');

SET @forum_author_id = COALESCE(
    (SELECT id_usuario FROM usuario WHERE email = 'comunidade@maternidade.local'),
    (SELECT id_usuario FROM usuario ORDER BY id_usuario LIMIT 1)
);

INSERT INTO forum_topico (id_categoria, id_usuario, titulo, conteudo, fixado)
SELECT c.id_categoria, @forum_author_id,
       'Como vocês estão se preparando para a chegada do bebê?',
       'Estou entrando no terceiro trimestre e queria trocar ideias sobre o que realmente vale a pena deixar pronto para a chegada do bebê.',
       TRUE
FROM forum_categoria c
WHERE c.nome = 'Gestação'
  AND @forum_author_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM forum_topico t
      WHERE t.titulo = 'Como vocês estão se preparando para a chegada do bebê?'
  );

INSERT INTO forum_topico (id_categoria, id_usuario, titulo, conteudo, fixado)
SELECT c.id_categoria, @forum_author_id,
       'Rotina de sono nos primeiros meses',
       'Meu bebê tem 3 meses e estamos tentando criar uma rotina mais tranquila para as noites. Como vocês organizaram o sono nos primeiros meses?',
       FALSE
FROM forum_categoria c
WHERE c.nome = 'Bebês e recém-nascidos'
  AND @forum_author_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM forum_topico t
      WHERE t.titulo = 'Rotina de sono nos primeiros meses'
  );

INSERT INTO forum_resposta (id_topico, id_usuario, conteudo)
SELECT t.id_topico, @forum_author_id,
       'Separei uma mala pequena por semana e deixei sempre por perto documentos, itens de higiene e roupas confortáveis.'
FROM forum_topico t
WHERE t.titulo = 'Como vocês estão se preparando para a chegada do bebê?'
  AND @forum_author_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM forum_resposta r
      WHERE r.id_topico = t.id_topico
        AND r.conteudo = 'Separei uma mala pequena por semana e deixei sempre por perto documentos, itens de higiene e roupas confortáveis.'
  );

INSERT INTO forum_resposta (id_topico, id_usuario, conteudo)
SELECT t.id_topico, @forum_author_id,
       'Uma coisa que funcionou aqui foi criar horários leves e previsíveis, sem pressão, respeitando os sinais do bebê.'
FROM forum_topico t
WHERE t.titulo = 'Rotina de sono nos primeiros meses'
  AND @forum_author_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM forum_resposta r
      WHERE r.id_topico = t.id_topico
        AND r.conteudo = 'Uma coisa que funcionou aqui foi criar horários leves e previsíveis, sem pressão, respeitando os sinais do bebê.'
  );
