CREATE TABLE IF NOT EXISTS forum_topico_curtida (
    id_topico BIGINT NOT NULL,
    id_usuario INT NOT NULL,
    data_curtida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_topico, id_usuario),
    CONSTRAINT fk_forum_curtida_topico FOREIGN KEY (id_topico)
        REFERENCES forum_topico(id_topico) ON DELETE CASCADE,
    CONSTRAINT fk_forum_curtida_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;
