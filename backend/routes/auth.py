from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from typing import Optional
from models.auth import UserCreate, UserLogin, Token, UserResponse
from database.db import supabase, supabase_admin, supabase_jwt_secret
import re

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/signup", response_model=UserResponse)
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
            access_token=f"Bearer {access_token}", 
        )
        
    except Exception as e:
        detail = getattr(e, "detail", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=detail
        )
        
@router.get('/logout')
async def logout(response: Response):
    try:
        response.delete_cookie(key="access_token")
        return {"message": "success", "response": response}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
        
@router.get("/verify")
async def verify(request: Request):
    token = request.cookies.get("access_token")
 
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    try:
       response = supabase.auth.get_user(token)
       return response.user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    

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