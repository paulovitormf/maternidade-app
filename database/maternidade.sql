CREATE DATABASE maternidade
USE maternidade;

/*usuario*/
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    telefone VARCHAR(20),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

/*criança*/
CREATE TABLE crianca (
    id_crianca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo ENUM('F', 'M'),
    peso_nascimento DECIMAL(5,2),
    altura_nascimento DECIMAL(5,2),
    observacoes TEXT

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
        ON DELETE CASCADE /*Se deletar um usuário, apaga automaticamente os vínculos desse usuário na tabela associativa --> A criança continua viva na tabela crianca, só perdeu o vínculo com aquele usuário que foi excluído.*/
);

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
);

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
    quantidade DECIMAL(6,2), -- Ex: 120.00, 15.50
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
