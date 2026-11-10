SET NAMES utf8mb4;

/* usuario: pai, mae ou responsavel */
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    telefone VARCHAR(20),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    qnt_gestacao INT NOT NULL DEFAULT 0,
    CONSTRAINT ck_usuario_qnt_gestacao CHECK (qnt_gestacao >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auditoria_acesso (
    id_auditoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    evento VARCHAR(80) NOT NULL,
    ip_origem VARCHAR(45),
    data_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    INDEX idx_auditoria_usuario_data (id_usuario, data_evento)
) ENGINE=InnoDB;

/* crianca */
CREATE TABLE crianca (
    id_crianca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    data_nascimento DATE NOT NULL,
    hora_nascimento TIME NOT NULL,
    sexo VARCHAR(1),
    peso_nascimento DECIMAL(5,2),
    altura_nascimento DECIMAL(5,2),
    observacoes TEXT
) ENGINE=InnoDB;

/*criança e usuario --> relação*/
CREATE TABLE usuario_crianca (
    id_vinculo BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_crianca INT NOT NULL,
    tipo_relacao VARCHAR(20) NOT NULL,
    tipo_acesso VARCHAR(20) NOT NULL DEFAULT 'PRINCIPAL',
    concedido_por INT NULL,
    pode_editar BOOLEAN NOT NULL DEFAULT TRUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_revogacao DATETIME NULL,

    CONSTRAINT uq_usuario_crianca UNIQUE (id_usuario, id_crianca),
    CONSTRAINT uq_uc_crianca_vinculo_acesso_ativo
        UNIQUE (id_crianca, id_vinculo, tipo_acesso, ativo),
    CONSTRAINT fk_uc_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_uc_crianca FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    CONSTRAINT fk_uc_concedido_por FOREIGN KEY (concedido_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT ck_uc_tipo_acesso CHECK (tipo_acesso IN ('PRINCIPAL', 'RESPONSAVEL')),
    CONSTRAINT ck_uc_principal_edita
        CHECK (tipo_acesso <> 'PRINCIPAL' OR pode_editar = TRUE),
    CONSTRAINT ck_uc_tipo_relacao
        CHECK (tipo_relacao IN ('MAE', 'PAI', 'RESPONSAVEL')),

    INDEX idx_uc_crianca_ativo (id_crianca, ativo)
) ENGINE=InnoDB;

CREATE TABLE crianca_principal (
    id_crianca INT NOT NULL,
    id_vinculo BIGINT NOT NULL,
    tipo_acesso VARCHAR(20) NOT NULL DEFAULT 'PRINCIPAL',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (id_crianca),
    UNIQUE KEY uq_crianca_principal_vinculo (id_vinculo),

    CONSTRAINT ck_cp_tipo_acesso CHECK (tipo_acesso = 'PRINCIPAL'),
    CONSTRAINT ck_cp_ativo CHECK (ativo = TRUE),
    CONSTRAINT fk_cp_vinculo
        FOREIGN KEY (id_crianca, id_vinculo, tipo_acesso, ativo)
        REFERENCES usuario_crianca (id_crianca, id_vinculo, tipo_acesso, ativo)
        ON DELETE CASCADE
) ENGINE=InnoDB;

DELIMITER //
CREATE TRIGGER trg_uc_principal_ai
AFTER INSERT ON usuario_crianca
FOR EACH ROW
BEGIN
    IF NEW.tipo_acesso = 'PRINCIPAL' AND NEW.ativo = TRUE THEN
        INSERT INTO crianca_principal (id_crianca, id_vinculo)
        VALUES (NEW.id_crianca, NEW.id_vinculo);
    END IF;
END//

CREATE TRIGGER trg_uc_principal_bu
BEFORE UPDATE ON usuario_crianca
FOR EACH ROW
BEGIN
    IF OLD.tipo_acesso = 'PRINCIPAL'
        AND OLD.ativo = TRUE
        AND (
            OLD.id_crianca <> NEW.id_crianca
            OR OLD.id_vinculo <> NEW.id_vinculo
            OR OLD.tipo_acesso <> NEW.tipo_acesso
            OR OLD.ativo <> NEW.ativo
        ) THEN
        DELETE FROM crianca_principal
        WHERE id_crianca = OLD.id_crianca
          AND id_vinculo = OLD.id_vinculo;
    END IF;
END//

CREATE TRIGGER trg_uc_principal_au
AFTER UPDATE ON usuario_crianca
FOR EACH ROW
BEGIN
    IF NEW.tipo_acesso = 'PRINCIPAL'
        AND NEW.ativo = TRUE
        AND (
            OLD.id_crianca <> NEW.id_crianca
            OR OLD.id_vinculo <> NEW.id_vinculo
            OR OLD.tipo_acesso <> NEW.tipo_acesso
            OR OLD.ativo <> NEW.ativo
        ) THEN
        INSERT INTO crianca_principal (id_crianca, id_vinculo)
        VALUES (NEW.id_crianca, NEW.id_vinculo);
    END IF;
END//
DELIMITER ;

/*crescimento*/ 
CREATE TABLE crescimento (
    id_crescimento INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    data_registro DATE NOT NULL,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    observacao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE
) ENGINE=InnoDB;

/*alimentação*/
CREATE TABLE alimentacao (
    id_alimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    data_registro DATE NOT NULL,
    horario TIME NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    quantidade DECIMAL(6,2),
    unidade_medida VARCHAR(15),
    observacao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE,
    CONSTRAINT ck_alimentacao_tipo CHECK (tipo IN ('AMAMENTACAO', 'FORMULA', 'ALIMENTACAO_SOLIDA', 'OUTRO')),
    CONSTRAINT ck_alimentacao_unidade CHECK (unidade_medida IS NULL OR unidade_medida IN ('ML', 'G', 'MINUTOS', 'PORCAO', 'UNIDADE'))
);

/*sono*/
CREATE TABLE sono (
    id_sono INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    data_registro DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    observacao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE
);

/*desenvolvimento*/
CREATE TABLE desenvolvimento (
    id_desenvolvimento INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    data_registro DATE NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE,
    CONSTRAINT ck_desenvolvimento_categoria
        CHECK (categoria IN ('MOTOR', 'LINGUAGEM', 'COGNITIVO', 'SOCIAL', 'OUTRO'))
);

/*loja parceira */ 
CREATE TABLE loja_parceira (
    id_loja INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    site VARCHAR(255),
    logo VARCHAR(255),
    cupom_desconto VARCHAR(50),     
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* produtos */
CREATE TABLE categoria_produto (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nome VARCHAR(150) NOT NULL,
    marca VARCHAR(100),
    descricao TEXT,
    imagem VARCHAR(255),

    FOREIGN KEY (id_categoria)
        REFERENCES categoria_produto(id_categoria)
        ON DELETE SET NULL
);

CREATE TABLE produto_loja (
    id_produto INT NOT NULL,
    id_loja INT NOT NULL,
    preco DECIMAL(10,2),
    link_produto VARCHAR(500),

    PRIMARY KEY (id_produto, id_loja),

    FOREIGN KEY (id_produto)
        REFERENCES produto(id_produto)
        ON DELETE CASCADE,

    FOREIGN KEY (id_loja)
        REFERENCES loja_parceira(id_loja)
        ON DELETE CASCADE
);

CREATE TABLE produto_favorito (
    id_usuario INT NOT NULL,
    id_produto INT NOT NULL,
    data_favorito DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_produto),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_produto)
        REFERENCES produto(id_produto)
        ON DELETE CASCADE
);

/*chats*/
CREATE TABLE chat (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    id_criador INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_criador)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

/*usuário dos chats*/
CREATE TABLE chat_usuario (
    id_chat INT NOT NULL,
    id_usuario INT NOT NULL,
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_chat, id_usuario),

    FOREIGN KEY (id_chat)
        REFERENCES chat(id_chat)
        ON DELETE CASCADE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

/*mensagens*/
CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_chat INT NOT NULL,
    id_usuario INT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_chat)
        REFERENCES chat(id_chat)
        ON DELETE CASCADE,

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL -- CORRIGIDO: Alterado para SET NULL para atender a regra descrita no comentário
);

/*biblioteca*/
CREATE TABLE categoria_livro (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE livro (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT, -- AJUSTADO: Vinculado à tabela categoria_livro em vez de usar ENUM
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150),
    descricao TEXT,
    imagem VARCHAR(255),
    link VARCHAR(500),
    idade_minima_meses INT NULL, -- CORRIGIDO: Vírgula final removida

    FOREIGN KEY (id_categoria)
        REFERENCES categoria_livro(id_categoria)
        ON DELETE SET NULL
);

CREATE TABLE livro_favorito (
    id_usuario INT NOT NULL,
    id_livro INT NOT NULL,
    data_favorito DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_livro),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_livro)
        REFERENCES livro(id_livro)
        ON DELETE CASCADE
);

/*especialidade*/
CREATE TABLE especialidade (
    id_especialidade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT
);

CREATE TABLE especialista (
    id_especialista INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    registro_profissional VARCHAR(50),
    telefone VARCHAR(20),
    email VARCHAR(150),
    cidade VARCHAR(100),
    estado CHAR(2),
    atendimento_online BOOLEAN DEFAULT FALSE,
    foto VARCHAR(255),
    descricao TEXT
);

CREATE TABLE especialista_especialidade (
    id_especialista INT NOT NULL,
    id_especialidade INT NOT NULL,

    PRIMARY KEY (id_especialista, id_especialidade),

    FOREIGN KEY (id_especialista)
        REFERENCES especialista(id_especialista)
        ON DELETE CASCADE,

    FOREIGN KEY (id_especialidade)
        REFERENCES especialidade(id_especialidade)
        ON DELETE CASCADE
);

/*agenda*/
CREATE TABLE compromisso (
    id_compromisso INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_crianca INT,
    id_especialista INT,

    titulo VARCHAR(150) NOT NULL,

    tipo VARCHAR(20) NOT NULL,

    data_compromisso DATE NOT NULL,
    horario TIME,
    local VARCHAR(255),
    descricao TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE SET NULL,

    FOREIGN KEY (id_especialista)
        REFERENCES especialista(id_especialista)
        ON DELETE SET NULL,
    CONSTRAINT ck_compromisso_tipo CHECK (tipo IN ('CONSULTA', 'VACINA', 'EXAME', 'OUTRO')),
    CONSTRAINT ck_compromisso_status CHECK (status IN ('PENDENTE', 'CONCLUIDO', 'CANCELADO'))
);

/*vacinas*/
CREATE TABLE vacina (
    id_vacina INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    idade_recomendada VARCHAR(100)
);

CREATE TABLE vacinacao (
    id_vacinacao INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    id_vacina INT NOT NULL,
    id_compromisso INT,

    dose VARCHAR(50),
    data_prevista DATE,
    data_aplicacao DATE,
    observacao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE,

    FOREIGN KEY (id_vacina)
        REFERENCES vacina(id_vacina)
        ON DELETE CASCADE,

    FOREIGN KEY (id_compromisso)
        REFERENCES compromisso(id_compromisso)
        ON DELETE SET NULL
);

/*medicamentos*/
CREATE TABLE medicamento (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT
);

CREATE TABLE medicacao (
    id_medicacao INT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    id_medicamento INT NOT NULL,

    dose VARCHAR(100) NOT NULL,
    frequencia VARCHAR(100),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    observacao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE,

    FOREIGN KEY (id_medicamento)
        REFERENCES medicamento(id_medicamento)
        ON DELETE CASCADE
);

CREATE TABLE horario_medicacao (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_medicacao INT NOT NULL,
    horario TIME NOT NULL,

    FOREIGN KEY (id_medicacao)
        REFERENCES medicacao(id_medicacao)
        ON DELETE CASCADE
);

/*ciclo menstrual*/
CREATE TABLE ciclo_menstrual (
    id_ciclo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    observacao TEXT,

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE registro_menstrual (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_ciclo INT NOT NULL,
    data_registro DATE NOT NULL,
    fluxo VARCHAR(50),
    sintomas TEXT,

    FOREIGN KEY (id_ciclo)
        REFERENCES ciclo_menstrual(id_ciclo)
        ON DELETE CASCADE
);

/*conteúdos//artigos*/
CREATE TABLE categoria_conteudo (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE conteudo (
    id_conteudo INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    titulo VARCHAR(200) NOT NULL,
    resumo TEXT,
    texto LONGTEXT NOT NULL,
    fonte VARCHAR(255),
    link_fonte VARCHAR(500),
    data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_categoria)
        REFERENCES categoria_conteudo(id_categoria)
        ON DELETE SET NULL
);

CREATE TABLE conteudo_favorito (
    id_usuario INT NOT NULL,
    id_conteudo INT NOT NULL,
    data_favorito DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_usuario, id_conteudo),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_conteudo)
        REFERENCES conteudo(id_conteudo)
        ON DELETE CASCADE
);

/*primeiros socorros*/
CREATE TABLE primeiros_socorros (
    id_primeiros_socorros INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100),
    fonte VARCHAR(255),
    link_fonte VARCHAR(500)
);

/*contato emergencia*/
CREATE TABLE emergencia (
    id_emergencia INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    descricao TEXT
);

CREATE TABLE gestacao (
    id_gestacao INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_usuario INT NOT NULL,
    ultima_mestruacao DATE NOT NULL,
    idade_gestacional INT,
    data_parto DATE,
    tipo_gestacao VARCHAR(30),
    tipo_gestacao_detalhe VARCHAR(30),
    pre_natal BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_gestacao_idade CHECK (idade_gestacional IS NULL OR idade_gestacional BETWEEN 0 AND 42),
    CONSTRAINT ck_gestacao_parto CHECK (data_parto IS NULL OR data_parto >= ultima_mestruacao),
    INDEX idx_gestacao_usuario (id_usuario),
    INDEX idx_gestacao_parto (data_parto)
) ENGINE=InnoDB;

/* trilha visual de jornada do desenvolvimento */
CREATE TABLE jornada_desenvolvimento (
    id_jornada INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    idade_min_meses INT NOT NULL,
    idade_max_meses INT,
    categoria VARCHAR(20) NOT NULL,
    fonte VARCHAR(255),
    link_fonte VARCHAR(500),
    INDEX idx_jornada_faixa_etaria (idade_min_meses, idade_max_meses),
    CONSTRAINT ck_jornada_categoria CHECK (categoria IN ('MOTOR', 'LINGUAGEM', 'COGNITIVO', 'SOCIAL', 'AUTONOMIA', 'OUTRO'))
) ENGINE=InnoDB;

CREATE TABLE jornada_crianca (
    id_crianca INT NOT NULL,
    id_jornada INT NOT NULL,
    data_conquista DATE,
    observacao TEXT,
    PRIMARY KEY (id_crianca, id_jornada),
    FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    FOREIGN KEY (id_jornada) REFERENCES jornada_desenvolvimento(id_jornada) ON DELETE CASCADE
) ENGINE=InnoDB;

/* revisão profissional de conteúdos */
ALTER TABLE conteudo
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'RASCUNHO',
    ADD COLUMN idade_min_meses INT,
    ADD COLUMN idade_max_meses INT,
    ADD CONSTRAINT ck_conteudo_status CHECK (status IN ('RASCUNHO', 'PUBLICADO', 'ARQUIVADO'));

CREATE TABLE conteudo_revisao (
    id_revisao INT AUTO_INCREMENT PRIMARY KEY,
    id_conteudo INT NOT NULL,
    nome_revisor VARCHAR(150) NOT NULL,
    especialidade VARCHAR(150) NOT NULL,
    registro_profissional VARCHAR(80),
    data_revisao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parecer TEXT,
    aprovado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_conteudo) REFERENCES conteudo(id_conteudo) ON DELETE CASCADE,
    INDEX idx_conteudo_revisao_status (id_conteudo, aprovado)
) ENGINE=InnoDB;


/* crescimento com perímetro cefálico e referência OMS */
ALTER TABLE crescimento
    ADD COLUMN perimetro_cefalico DECIMAL(5,2),
    ADD COLUMN fonte_curva VARCHAR(50) DEFAULT 'OMS',
    ADD INDEX idx_crescimento_crianca_data (id_crianca, data_registro);

/* compartilhamento seguro entre responsáveis */
CREATE TABLE convite_responsavel (
    id_convite BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NOT NULL,
    id_usuario_solicitante INT NOT NULL,
    id_usuario_convidado INT NOT NULL,
    email_convidado VARCHAR(150) NOT NULL,
    tipo_relacao VARCHAR(20) NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    data_resposta DATETIME NULL,

    CONSTRAINT fk_convite_crianca
        FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE,

    CONSTRAINT fk_convite_solicitante
        FOREIGN KEY (id_usuario_solicitante)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_convite_convidado
        FOREIGN KEY (id_usuario_convidado)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT ck_convite_relacao
        CHECK (tipo_relacao IN ('MAE', 'PAI', 'RESPONSAVEL')),

    CONSTRAINT ck_convite_status
        CHECK (
            status IN ('PENDENTE','ACEITO','RECUSADO','EXPIRADO','CANCELADO')
        ),

    INDEX idx_convite_email_status (email_convidado, status),
    INDEX idx_convite_convidado_status (id_usuario_convidado, status),
    INDEX idx_convite_crianca_status (id_crianca, status)
) ENGINE=InnoDB;

/*tabelas para a notificação e configuração do compartilhamento de criancas*/
CREATE TABLE historico_permissao (
    id_historico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NULL,
    id_vinculo BIGINT NULL,
    id_usuario_afetado INT NULL,
    id_usuario_ator INT NULL,
    tipo_evento VARCHAR(40) NOT NULL,
    tipo_relacao_anterior VARCHAR(20) NULL,
    tipo_relacao_novo VARCHAR(20) NULL,
    tipo_acesso_anterior VARCHAR(20) NULL,
    tipo_acesso_novo VARCHAR(20) NULL,
    pode_editar_anterior BOOLEAN NULL,
    pode_editar_novo BOOLEAN NULL,
    ativo_anterior BOOLEAN NULL,
    ativo_novo BOOLEAN NULL,
    detalhes VARCHAR(255) NULL,
    data_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hp_crianca FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE SET NULL,
    CONSTRAINT fk_hp_vinculo FOREIGN KEY (id_vinculo) REFERENCES usuario_crianca(id_vinculo) ON DELETE SET NULL,
    CONSTRAINT fk_hp_afetado FOREIGN KEY (id_usuario_afetado) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_hp_ator FOREIGN KEY (id_usuario_ator) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT ck_hp_evento
        CHECK (tipo_evento IN ('ACESSO_CONCEDIDO', 'EDICAO_LIBERADA', 'EDICAO_BLOQUEADA', 'ACESSO_REVOGADO', 'ACESSO_REATIVADO')),

    INDEX idx_hp_crianca_data (id_crianca, data_evento),
    INDEX idx_hp_ator_data (id_usuario_ator, data_evento),
    INDEX idx_hp_afetado_data (id_usuario_afetado, data_evento)
) ENGINE=InnoDB;


CREATE TABLE historico_alteracao (
    id_historico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_crianca INT NULL,
    id_usuario_ator INT NULL,
    entidade VARCHAR(50) NOT NULL,
    id_registro BIGINT NULL,
    tipo_evento VARCHAR(40) NOT NULL,
    dados_anteriores JSON NULL,
    dados_novos JSON NULL,
    data_evento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ha_crianca FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE SET NULL,
    CONSTRAINT fk_ha_usuario FOREIGN KEY (id_usuario_ator) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    CONSTRAINT ck_ha_evento
        CHECK (tipo_evento IN ('CRIADO', 'ALTERADO', 'EXCLUIDO')),

    INDEX idx_ha_crianca_data (id_crianca, data_evento),
    INDEX idx_ha_usuario_data (id_usuario_ator, data_evento),
    INDEX idx_ha_entidade_registro (entidade, id_registro)
) ENGINE=InnoDB;


CREATE TABLE notificacao (
    id_notificacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_crianca INT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    data_agendada DATETIME NOT NULL,
    data_leitura DATETIME NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT fk_notificacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_notificacao_crianca FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    CONSTRAINT ck_notificacao_tipo
        CHECK (tipo IN ('VACINA', 'MEDICACAO', 'CONSULTA', 'DESENVOLVIMENTO', 'SISTEMA', 'COMPARTILHAMENTO', 'ATIVIDADE_CRIANCA')),

    CONSTRAINT ck_notificacao_status
        CHECK (status IN ('PENDENTE', 'ENVIADA', 'LIDA', 'CANCELADA')),

    INDEX idx_notificacao_usuario_status (id_usuario, status, data_agendada),
    INDEX idx_notificacao_crianca_data (id_crianca, data_agendada)
) ENGINE=InnoDB;


/* diário de humor e grupos de apoio */
CREATE TABLE registro_humor (
    id_humor BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nivel TINYINT NOT NULL,
    anotacao TEXT,
    data_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_humor_nivel CHECK (nivel BETWEEN 1 AND 5),
    INDEX idx_humor_usuario_data (id_usuario, data_registro)
) ENGINE=InnoDB;

CREATE TABLE grupo_apoio (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    faixa_etaria VARCHAR(80),
    diagnostico VARCHAR(150),
    mediado_por_profissional BOOLEAN NOT NULL DEFAULT FALSE,
    id_moderador INT,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_moderador) REFERENCES usuario(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE grupo_apoio_usuario (
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,
    data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_grupo, id_usuario),
    FOREIGN KEY (id_grupo) REFERENCES grupo_apoio(id_grupo) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

/* fórum de discussão */
CREATE TABLE forum_categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20) NOT NULL,
    idade_min_meses SMALLINT UNSIGNED,
    idade_max_meses SMALLINT UNSIGNED,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_forum_categoria_tipo_nome UNIQUE (tipo, nome),
    CONSTRAINT ck_forum_categoria_tipo
        CHECK (tipo IN ('INTERESSE', 'FAIXA_ETARIA')),
    CONSTRAINT ck_forum_categoria_idade
        CHECK (
            (tipo = 'INTERESSE' AND idade_min_meses IS NULL AND idade_max_meses IS NULL)
            OR
            (tipo = 'FAIXA_ETARIA'
                AND idade_min_meses IS NOT NULL
                AND idade_max_meses IS NOT NULL
                AND idade_min_meses <= idade_max_meses)
        )
) ENGINE=InnoDB;

CREATE TABLE forum_topico (
    id_topico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_usuario INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    fixado BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_forum_topico_categoria
        FOREIGN KEY (id_categoria) REFERENCES forum_categoria(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT fk_forum_topico_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_forum_topico_status
        CHECK (status IN ('ABERTO', 'FECHADO', 'ARQUIVADO')),

    INDEX idx_forum_topico_categoria_lista
        (id_categoria, status, fixado, data_atualizacao),
    INDEX idx_forum_topico_usuario_data (id_usuario, data_criacao)
) ENGINE=InnoDB;

CREATE TABLE forum_resposta (
    id_resposta BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_topico BIGINT NOT NULL,
    id_usuario INT NOT NULL,
    conteudo TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_forum_resposta_topico
        FOREIGN KEY (id_topico) REFERENCES forum_topico(id_topico) ON DELETE CASCADE,
    CONSTRAINT fk_forum_resposta_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_forum_resposta_status
        CHECK (status IN ('ATIVA', 'OCULTA', 'EXCLUIDA')),

    INDEX idx_forum_resposta_topico_lista (id_topico, status, data_criacao),
    INDEX idx_forum_resposta_usuario_data (id_usuario, data_criacao)
) ENGINE=InnoDB;

/* produtos: alergênicos, avaliações e código de barras */
ALTER TABLE produto
    ADD COLUMN codigo_barras VARCHAR(50) UNIQUE,
    ADD COLUMN alerta_alergenicos TEXT,
    ADD COLUMN ingredientes TEXT;

CREATE TABLE produto_avaliacao (
    id_avaliacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    nota TINYINT NOT NULL,
    comentario TEXT,
    data_avaliacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY uk_produto_usuario_avaliacao (id_produto, id_usuario),
    CONSTRAINT ck_produto_nota CHECK (nota BETWEEN 1 AND 5)
) ENGINE=InnoDB;

/* protocolos do verificador de sintomas */
CREATE TABLE protocolo_sintoma (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    sintoma VARCHAR(150) NOT NULL,
    pergunta TEXT NOT NULL,
    orientacao TEXT NOT NULL,
    sinal_alerta BOOLEAN NOT NULL DEFAULT FALSE,
    fonte VARCHAR(255) NOT NULL,
    link_fonte VARCHAR(500),
    versao VARCHAR(30) NOT NULL,
    data_revisao DATE NOT NULL
) ENGINE=InnoDB;

/* terapia online e disponibilidade */
CREATE TABLE plano_saude (
    id_plano INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE especialista_plano (
    id_especialista INT NOT NULL,
    id_plano INT NOT NULL,
    PRIMARY KEY (id_especialista, id_plano),
    FOREIGN KEY (id_especialista) REFERENCES especialista(id_especialista) ON DELETE CASCADE,
    FOREIGN KEY (id_plano) REFERENCES plano_saude(id_plano) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE disponibilidade_especialista (
    id_disponibilidade BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_especialista INT NOT NULL,
    dia_semana TINYINT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    modalidade VARCHAR(15) NOT NULL,
    FOREIGN KEY (id_especialista) REFERENCES especialista(id_especialista) ON DELETE CASCADE,
    CONSTRAINT ck_disponibilidade_dia CHECK (dia_semana BETWEEN 0 AND 6),
    CONSTRAINT ck_disponibilidade_modalidade CHECK (modalidade IN ('PRESENCIAL', 'ONLINE'))
) ENGINE=InnoDB;
