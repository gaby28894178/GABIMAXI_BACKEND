/*
-- Script para crear la tabla en PostgreSQL (para Vercel Postgres / Neon / Railway)

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
    f_insert TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    f_update TIMESTAMP,
    twofa_enabled BOOLEAN DEFAULT FALSE
);

-- Función y Trigger para actualizar f_update automáticamente (equivalente a ON UPDATE CURRENT_TIMESTAMP de MySQL)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.f_update = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sec_users_modtime ON sec_users;

CREATE TRIGGER update_sec_users_modtime
BEFORE UPDATE ON sec_users
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- Insertar un usuario de prueba (Opcional)
-- Password: password123 (hasheado con bcrypt)
INSERT INTO sec_users (login, pswd, name, email, active) 
VALUES ('test_cloud', '$2a$10$x.z5q.Z5q.Z5q.Z5q.Z5qe.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q', 'Usuario Test Cloud', 'test@cloud.com', 'Y')
ON CONFLICT (login) DO NOTHING;
*/
