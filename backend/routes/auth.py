from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from models.auth import UserCreate, UserLogin, Token, UserResponse
from database.db import supabase, supabase_admin
import re

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    try:
        
        users = supabase_admin.auth.admin.list_users()

        if any(u.email == user.email for u in users):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
            
        if not is_strong_password(user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is not strong enough. It must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character"
            )
        
        response = supabase.auth.sign_up({
            "email": user.email, 
            "password": user.password
        })

        return UserResponse(id=response.user.id, email=response.user.email)
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
    
@router.post("/login", response_model=Token)
async def login(response: Response, user: UserLogin):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email, 
            "password": user.password
        })

        access_token = auth_response.session.access_token

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,  
            samesite="strict",
            max_age=10000,
            path="/",
            domain=None
        )
       
        return Token(
            access_token=access_token, 
            token_type="bearer"
        )
        
    except Exception as e:
        detail = getattr(e, "detail", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=detail
        )
        
        
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)
        return UserResponse(id = user.id, email = user.email)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def require_auth(request: Request):
    """
    Dependency function to check if user is authenticated
    Returns the user token if authenticated, raises 401 if not
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in first.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    try:
        
        user_res = supabase.auth.get_user(token)
        
        if not user_res or not user_res.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return token
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=getattr(e, "detail", str(e)),
        )
        
   

def is_strong_password(password: str) -> bool:
    """
    Check if the password is strong.
    Requirements:
      - At least 8 characters long
      - Contains at least 1 uppercase letter
      - Contains at least 1 number
      - Contains at least 1 special character
    """
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True