INSERT INTO tb_hello (id, texto) 
VALUES (1, 'Olá Mundo! Conexão de ponta a ponta com MySQL funcionando!')
ON DUPLICATE KEY UPDATE texto = VALUES(texto);