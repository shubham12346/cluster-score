
import redis
import json

# Connect to local Redis (adjust if hosted)
r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

def save_progress(row, data):
    print(f"[Redis] Saving progress for row {row}: {data}")
    r.hset("progress", f"row_{row}", json.dumps(data))

def get_all_progress():
    all_data = r.hgetall("progress")
    print(f"[Redis] Fetched all progress: {all_data}")
    return {k: json.loads(v) for k, v in all_data.items()}

def clear_progress():
    print("[Redis] Clearing all progress")
    r.delete("progress")