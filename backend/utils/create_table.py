import psycopg2

conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="admin",  # Replace with your actual password
    host="localhost",
    port="5432"
)
cur = conn.cursor()
# cur.execute("""
#     CREATE TABLE IF NOT EXISTS users (
#         userId VARCHAR(10) PRIMARY KEY,
#         name VARCHAR(100),
#         email VARCHAR(100) UNIQUE,
#         role VARCHAR(50),
#         auth VARCHAR(100),
#         password VARCHAR(100) NOT NULL
#     );
# """)
cur.execute("""
    CREATE TABLE IF NOT EXISTS roles (
        Roleid VARCHAR(20) PRIMARY KEY,
        RoleName VARCHAR(50) UNIQUE NOT NULL
);
""")
conn.commit()
cur.close()
conn.close()
print("Table created successfully.")