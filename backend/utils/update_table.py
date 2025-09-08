import psycopg2

conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="admin",  # Replace with your actual password
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# # Insert a sample row
cur.execute("""
    INSERT INTO users (userId, name, email, role, auth, password)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING userId;
""", ('ID-01', "Rahul Sinha", "riya_sinha@gmail.com", "", "admin", "password@01"))
cur.execute("""
    INSERT INTO users (userId, name, email, role, auth, password)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING userId;
""", ('ID-02', "Mohit Verma", "mohit_verma14@gmail.com", "", "manager", "password@02"))
cur.execute("""
    INSERT INTO users (userId, name, email, role, auth, password)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING userId;
""", ('ID-03', "Sohan Verma", "sohan_verma23@gmail.com", "", "user", "password@03"))
user_id = cur.fetchone()[0]
print(f"Inserted user with userId: {user_id}")

# Read all rows from the table
cur.execute("SELECT * FROM users;")
rows = cur.fetchall()
for row in rows:
    print(row)

conn.commit()
cur.close()
conn.close()