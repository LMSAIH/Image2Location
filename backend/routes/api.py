from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from models.fruits import Fruits, Fruit
from database.db import supabase, supabase_admin
from routes.auth import require_auth

router = APIRouter()

@router.get("/getFruits", response_model=Fruits)
async def get_fruits(token: str = Depends(require_auth)):  
    try:
        response = supabase.from_("fruits").select("*").execute()  
        if response.data is None:
            return Fruits(fruits=[])
        return Fruits(fruits=response.data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )