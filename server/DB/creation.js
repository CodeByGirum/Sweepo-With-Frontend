// // CREATE DATABASE
export const database = async (pool) => {
    const sql = 'CREATE DATABASE datacleaningDB';
    await pool.query(sql); 
    console.log("Users table created");
}

// USERS TABLE
export const userTable = async (pool) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        user_id CHAR(36) NOT NULL DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        refresh_token VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (user_id),
        UNIQUE KEY email_unique (email)
    );
    `;

    await pool.query(sql); 
    console.log("Users table created");
};


// FILES TABLE
export const filesTable = async (pool) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS files (
        file_id CHAR(36) NOT NULL DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        progress VARCHAR(255) DEFAULT (0),
        previous_response JSON DEFAULT NULL,
        file_schema JSON DEFAULT NULL,
        file_key VARCHAR(255) NOT NULL UNIQUE,
        file_type VARCHAR(50) NOT NULL,
        file_size BIGINT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (file_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
    `;

    await pool.query(sql);
    console.log("Files table created");
};


// ACTIONS TABLE
export const actionsTable = async (pool) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS actions (
            action_id CHAR(36) NOT NULL DEFAULT (UUID()),   
            file_id CHAR(36) NOT NULL,                        
            user_id CHAR(36) NOT NULL,
            title VARCHAR(255) NOT NULL,
            response MEDIUMTEXT NOT NULL,
            action_type VARCHAR(255) NOT NULL,
            chat VARCHAR(255) NOT NULL,               
            action_details JSON,                             
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
            PRIMARY KEY (action_id),
            FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
    `;

    await pool.query(sql);
    console.log("actions table created");
};


// ISSUES TABLE
export const issuesTable = async (pool) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS issues (
            issue_id CHAR(36) NOT NULL DEFAULT (UUID()),  
            file_id CHAR(36) NOT NULL,   
            user_id CHAR(36) NOT NULL,                     
            row_index INT NOT NULL,                      
            errors JSON NOT NULL,                         
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (issue_id),
            FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );`;

    await pool.query(sql);
    console.log("issues table created");
};


// SCHEMA TABLE
export const schemaTable = async (pool) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS FileSchemas (
        schema_id CHAR(36) NOT NULL DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        file_id CHAR(36) NOT NULL UNIQUE,
        awareness VARCHAR(255) NOT NULL,
        schema_definition JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (schema_id),
        FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )`;

    await pool.query(sql);
    console.log("schema table created");
};



