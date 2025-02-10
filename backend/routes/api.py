from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, File, UploadFile
from models.location import Image, Location 
from database.db import supabase, supabase_admin, supabase_bucket, supabase_url
from middleware.auth import get_current_user
import uuid
from dotenv import load_dotenv
import os
from picarta import Picarta

router = APIRouter()


picarta_key = os.getenv("PICARTA_API_KEY")
localizer = Picarta(picarta_key)


@router.post('/addImage', response_model=Image )
async def addImage(
    request: Request,
    user = Depends(get_current_user),
    image: UploadFile = File(...)
 
):

    try:
        
     if not image or image.filename == "":
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="missing image"
         )
         
     imageUrl = None
     
     image_filename = f"{uuid.uuid4()}{image.filename}"
     file_content = await image.read()
     response = supabase_admin.storage.from_(supabase_bucket).upload(image_filename, file_content)
    
     
     if response.path:
            imageUrl = f"{supabase_url}/storage/v1/object/public/{supabase_bucket}/{image_filename}"
            imagesObj = {
             "image_url": imageUrl,
             "user": user.id
            }
            
            supabase.table("Images").insert(imagesObj).execute()
            localizatorResponse = localizer.localize(img_path=imageUrl,top_k=1)
            
            location = {
                "latitude": localizatorResponse["ai_lat"],
                "longitude": localizatorResponse["ai_lon"],
                "country": localizatorResponse["ai_country"],
                "province": localizatorResponse["province"],
                "city": localizatorResponse["city"],
                "image_url": imageUrl,
                "user": user.id
            }
             
            supabase.table("Locations").insert(location).execute()
            
            return Image(imageUrl=imageUrl, user=user.id)
        
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
    
