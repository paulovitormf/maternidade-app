ALTER TABLE registro
    DROP CHECK ck_registro_tipo,
    MODIFY tipo VARCHAR(40) NOT NULL,
    ADD COLUMN local_evento VARCHAR(180) NULL,
    ADD COLUMN profissional VARCHAR(180) NULL,
    ADD COLUMN responsavel_nome VARCHAR(250) NULL,
    ADD COLUMN fase_jornada VARCHAR(80) NULL,
    ADD CONSTRAINT ck_registro_tipo CHECK (
        tipo IN (
            'VACINA','PESO','ALTURA','PERIMETRO_CEFALICO',
            'INTRODUCAO_ALIMENTAR','FOTO','INTERACAO',
            'PRIMEIRA_PALAVRA','MARCO_DESENVOLVIMENTO',
            'CONSULTA','EXAME','OUTRO'
        )
    );
