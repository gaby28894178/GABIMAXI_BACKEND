import { pool, isPostgres } from '../config/db.js';

export const installDatabase = async (req, res) => {
  try {
    if (!isPostgres) {
      return res.status(400).json({ 
        message: 'This installer is only for PostgreSQL environments (Vercel/Cloud).' 
      });
    }

    const sqlScript = `
      CREATE TABLE IF NOT EXISTS sec_users (
          login VARCHAR(100) NOT NULL PRIMARY KEY,
          pswd VARCHAR(255) NOT NULL,
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

      INSERT INTO sec_users (login, pswd, name, email, active) 
      VALUES ('test_cloud', '$2a$10$x.z5q.Z5q.Z5q.Z5q.Z5qe.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q', 'Usuario Test Cloud', 'test@cloud.com', 'Y')
      ON CONFLICT (login) DO NOTHING;
    `;

    // Split commands by semicolon to execute them one by one if needed, 
    // but pg library often supports multiple statements in one query.
    // Let's try executing the whole block.
    await pool.query(sqlScript);

    res.status(200).json({ 
      message: 'Database tables created successfully!', 
      tables: ['sec_users'],
      testUser: 'test_cloud'
    });

  } catch (error) {
    console.error('Database installation error:', error);
    res.status(500).json({ 
      message: 'Failed to create database tables', 
      error: error.message 
    });
  }
};
