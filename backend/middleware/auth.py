from fastapi import Request, HTTPException, status, Depends
import jwt
from database.db import supabase
from models.auth import UserResponse
def get_current_user(request: Request) -> UserResponse:
  
    try:
        
        token = request.cookies.get("access_token")     
    
        if not token:
            raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Not authenticated: missing access token cookie"
            )
        
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
            
        user = supabase.auth.get_user(jwt=token)
        
        userId = user.user.id
 
        userEmail = user.user.email
        
        return UserResponse(id=userId, email=userEmail)
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
