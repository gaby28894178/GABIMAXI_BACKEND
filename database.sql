-- Script para crear la tabla en tu base de datos en la nube (Railway, Aiven, etc.)

CREATE TABLE IF NOT EXISTS sec_users (
    login VARCHAR(100) NOT NULL PRIMARY KEY,
    pswd VARCHAR(255) NOT NULL, -- Importante: 255 caracteres para soportar bcrypt
    name VARCHAR(255),
    email VARCHAR(255),
    active CHAR(1) DEFAULT 'Y',
    institucion_id INT,
    tipo_usuario_id INT,
    profesional_id INT,
    paciente_id INT,
    f_insert DATETIME DEFAULT CURRENT_TIMESTAMP,
    f_update DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    twofa_enabled TINYINT(1) DEFAULT 0
);

-- Insertar un usuario de prueba (Opcional)
-- Password: password123 (hasheado con bcrypt)
INSERT INTO sec_users (login, pswd, name, email, active) 
VALUES ('test_cloud', '$2a$10$x.z5q.Z5q.Z5q.Z5q.Z5qe.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q', 'Usuario Test Cloud', 'test@cloud.com', 'Y');
