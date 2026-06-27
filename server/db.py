import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = BASE_DIR / "database" / "flavor_creation.db"


def get_db_connection():
    """
    Creates a connection to the SQLite database.
    Row factory allows rows to behave like dictionaries.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn