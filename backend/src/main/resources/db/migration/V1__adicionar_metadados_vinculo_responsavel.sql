SET @migration_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'usuario_crianca'
       AND column_name = 'tipo_acesso') = 0,
    'ALTER TABLE usuario_crianca ADD COLUMN tipo_acesso VARCHAR(20) NOT NULL DEFAULT ''PRINCIPAL''',
    'SELECT 1'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'usuario_crianca'
       AND column_name = 'concedido_por') = 0,
    'ALTER TABLE usuario_crianca ADD COLUMN concedido_por INT NULL',
    'SELECT 1'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'usuario_crianca'
       AND column_name = 'pode_editar') = 0,
    'ALTER TABLE usuario_crianca ADD COLUMN pode_editar BOOLEAN NOT NULL DEFAULT TRUE',
    'SELECT 1'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;

SET @migration_sql = IF(
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'usuario_crianca'
       AND column_name = 'ativo') = 0,
    'ALTER TABLE usuario_crianca ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE',
    'SELECT 1'
);
PREPARE migration_statement FROM @migration_sql;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;
