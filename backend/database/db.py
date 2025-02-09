from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE")

if not all([supabase_url, supabase_key, supabase_service_role_key]):
    raise ValueError("Please set the SUPABASE_URL and SUPABASE_KEY environment variables")

if not supabase_service_role_key:
    raise ValueError("Missing the admin role key")

supabase = create_client(supabase_url, supabase_key)
supabase_admin = create_client(supabase_url, supabase_service_role_key)