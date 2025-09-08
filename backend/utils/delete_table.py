import psycopg2

conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="admin",  # Replace with your actual password
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# cur.execute("DROP TABLE IF EXISTS users;")
cur.execute('TRUNCATE TABLE users;')
print("Table 'users' deleted (if it existed).")

conn.commit()
cur.close()
conn.close()
