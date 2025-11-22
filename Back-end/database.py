from dotenv import load_dotenv
import os
import mysql.connector

def get_connection():
    """
    @brief Открывает соединение с базой даннхы по начальным данным из .env и возвращает его
    @returns mysql.connector.Connect()
    """
    load_dotenv()

    db_user = os.getenv("MYSQL_USER")
    db_host = os.getenv('MYSQL_HOST')
    db_password = os.getenv("MYSQL_PASSWORD")
    db_name = os.getenv('MYSQL_DB')

    return mysql.connector.connect(host=db_host, user=db_user, password=db_password, database=db_name)