INSERT INTO tb_hello (id, texto) 
VALUES (1, 'Olá Mundo! Conexão de ponta a ponta com PostgreSQL funcionando!')
ON CONFLICT (id) DO NOTHING;