CREATE DATABASE IF NOT EXISTS maternidade
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE maternidade;

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

/* crianca */
CREATE TABLE crianca (
    id_crianca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    data_nascimento DATE NOT NULL,
    hora_nascimento TIME NOT NULL,
    sexo ENUM('F', 'M'),
    peso_nascimento DECIMAL(5,2),
    altura_nascimento DECIMAL(5,2),
    observacoes TEXT
) ENGINE=InnoDB;

/*criança e usuario --> relação*/
CREATE TABLE usuario_crianca (
    id_usuario INT NOT NULL,
    id_crianca INT NOT NULL,
    tipo_relacao ENUM('MAE', 'PAI', 'RESPONSAVEL') NOT NULL,

    PRIMARY KEY (id_usuario, id_crianca),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE
) ENGINE=InnoDB;

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
    tipo ENUM(
        'AMAMENTACAO',
        'FORMULA',
        'ALIMENTACAO_SOLIDA',
        'OUTRO'
    ) NOT NULL,
    quantidade DECIMAL(6,2),
    unidade_medida ENUM('ML', 'G', 'MINUTOS', 'PORCAO', 'UNIDADE'), 
    observacao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE
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
    categoria ENUM('MOTOR', 'LINGUAGEM', 'COGNITIVO', 'SOCIAL', 'OUTRO') NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE CASCADE
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

    tipo ENUM(
        'CONSULTA',
        'VACINA',
        'EXAME',
        'OUTRO'
    ) NOT NULL,

    data_compromisso DATE NOT NULL,
    horario TIME,
    local VARCHAR(255),
    descricao TEXT,

    status ENUM(
        'PENDENTE',
        'CONCLUIDO',
        'CANCELADO'
    ) DEFAULT 'PENDENTE',

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY (id_crianca)
        REFERENCES crianca(id_crianca)
        ON DELETE SET NULL,

    FOREIGN KEY (id_especialista)
        REFERENCES especialista(id_especialista)
        ON DELETE SET NULL
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
    tipo_gestacao TEXT,
    pre_natal BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT ck_gestacao_idade CHECK (idade_gestacional IS NULL OR idade_gestacional BETWEEN 0 AND 42),
    CONSTRAINT ck_gestacao_parto CHECK (data_parto IS NULL OR data_parto >= ultima_mestruacao),
    INDEX idx_gestacao_usuario (id_usuario),
    INDEX idx_gestacao_parto (data_parto)
) ENGINE=InnoDB;

/* trilha visual de marcos do desenvolvimento */
CREATE TABLE marco_desenvolvimento (
    id_marco INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    idade_min_meses INT NOT NULL,
    idade_max_meses INT,
    categoria ENUM('MOTOR', 'LINGUAGEM', 'COGNITIVO', 'SOCIAL', 'AUTONOMIA', 'OUTRO') NOT NULL,
    fonte VARCHAR(255),
    link_fonte VARCHAR(500),
    INDEX idx_marco_faixa_etaria (idade_min_meses, idade_max_meses)
) ENGINE=InnoDB;

CREATE TABLE marco_crianca (
    id_crianca INT NOT NULL,
    id_marco INT NOT NULL,
    data_conquista DATE,
    observacao TEXT,
    PRIMARY KEY (id_crianca, id_marco),
    FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    FOREIGN KEY (id_marco) REFERENCES marco_desenvolvimento(id_marco) ON DELETE CASCADE
) ENGINE=InnoDB;

/* revisão profissional de conteúdos */
ALTER TABLE conteudo
    ADD COLUMN status ENUM('RASCUNHO', 'PUBLICADO', 'ARQUIVADO') NOT NULL DEFAULT 'RASCUNHO',
    ADD COLUMN idade_min_meses INT,
    ADD COLUMN idade_max_meses INT;

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

/* notificações e alertas sincronizados */
CREATE TABLE notificacao (
    id_notificacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_crianca INT,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('VACINA', 'MEDICACAO', 'CONSULTA', 'DESENVOLVIMENTO', 'SISTEMA') NOT NULL,
    data_agendada DATETIME NOT NULL,
    data_leitura DATETIME,
    status ENUM('PENDENTE', 'ENVIADA', 'LIDA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    INDEX idx_notificacao_usuario_status (id_usuario, status, data_agendada)
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
    email_convidado VARCHAR(150) NOT NULL,
    tipo_relacao ENUM('MAE', 'PAI', 'RESPONSAVEL') NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    status ENUM('PENDENTE', 'ACEITO', 'RECUSADO', 'EXPIRADO') NOT NULL DEFAULT 'PENDENTE',
    data_expiracao DATETIME NOT NULL,
    data_resposta DATETIME,
    FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_solicitante) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_convite_email_status (email_convidado, status)
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
    modalidade ENUM('PRESENCIAL', 'ONLINE') NOT NULL,
    FOREIGN KEY (id_especialista) REFERENCES especialista(id_especialista) ON DELETE CASCADE,
    CONSTRAINT ck_disponibilidade_dia CHECK (dia_semana BETWEEN 0 AND 6)
) ENGINE=InnoDB;