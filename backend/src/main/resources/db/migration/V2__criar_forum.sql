CREATE TABLE IF NOT EXISTS forum_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20) NOT NULL,
    idade_min_meses SMALLINT UNSIGNED NULL,
    idade_max_meses SMALLINT UNSIGNED NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_forum_categoria_tipo_nome UNIQUE (tipo, nome)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS forum_topico (
    id_topico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_usuario INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    fixado BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_forum_topico_categoria FOREIGN KEY (id_categoria) REFERENCES forum_categoria(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT fk_forum_topico_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS forum_resposta (
    id_resposta BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_topico BIGINT NOT NULL,
    id_usuario INT NOT NULL,
    conteudo TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_forum_resposta_topico FOREIGN KEY (id_topico) REFERENCES forum_topico(id_topico) ON DELETE CASCADE,
    CONSTRAINT fk_forum_resposta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS forum_topico_curtida (
    id_topico BIGINT NOT NULL,
    id_usuario INT NOT NULL,
    data_curtida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_topico, id_usuario),
    CONSTRAINT fk_forum_curtida_topico FOREIGN KEY (id_topico) REFERENCES forum_topico(id_topico) ON DELETE CASCADE,
    CONSTRAINT fk_forum_curtida_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO forum_categoria (nome, descricao, tipo) VALUES
('Gestação', 'Dúvidas e descobertas de cada fase', 'INTERESSE'),
('Bebês e recém-nascidos', 'Os primeiros cuidados e desafios', 'INTERESSE'),
('Amamentação', 'Trocas de experiências e apoio', 'INTERESSE'),
('Pós-parto e bem-estar', 'Cuidar de si também importa', 'INTERESSE');
