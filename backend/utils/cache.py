import sqlite3
import json
import hashlib
import os

CACHE_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "nutria_cache.db")

def init_db():
    """Initialize the SQLite caching database."""
    try:
        conn = sqlite3.connect(CACHE_DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analysis_cache (
                hash_key TEXT PRIMARY KEY,
                result_json TEXT
            )
        ''')
        conn.commit()
    except Exception as e:
        print(f"Error initializing cache DB: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

def generate_cache_key(ocr_text: str, user_profile: dict) -> str:
    """Generate a unique MD5 hash for the given input."""
    # Ensure consistent ordering for dict
    profile_str = json.dumps(user_profile, sort_keys=True)
    raw_str = f"{ocr_text}|{profile_str}"
    return hashlib.md5(raw_str.encode('utf-8')).hexdigest()

def get_cached_analysis(hash_key: str):
    """Retrieve cached analysis result if it exists."""
    try:
        conn = sqlite3.connect(CACHE_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT result_json FROM analysis_cache WHERE hash_key = ?", (hash_key,))
        row = cursor.fetchone()
        if row:
            return json.loads(row[0])
    except Exception as e:
        print(f"Error getting cached analysis: {e}")
    finally:
        if 'conn' in locals():
            conn.close()
    return None

def set_cached_analysis(hash_key: str, result_data: dict):
    """Save the analysis result to the cache."""
    try:
        conn = sqlite3.connect(CACHE_DB_PATH)
        cursor = conn.cursor()
        result_json = json.dumps(result_data)
        cursor.execute(
            "INSERT OR REPLACE INTO analysis_cache (hash_key, result_json) VALUES (?, ?)",
            (hash_key, result_json)
        )
        conn.commit()
    except Exception as e:
        print(f"Error setting cached analysis: {e}")
    finally:
        if 'conn' in locals():
            conn.close()
