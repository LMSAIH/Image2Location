from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE")
supabase_bucket = os.getenv("SUPABASE_BUCKET")
supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")

if not all([supabase_url, supabase_key, supabase_service_role_key, supabase_bucket]):
    raise ValueError("Please set the supabase environment variables")

supabase = create_client(supabase_url, supabase_key)
supabase_admin = create_client(supabase_url, supabase_service_role_key)