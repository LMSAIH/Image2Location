from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, File, UploadFile
from models.location import  Location, Locations
from models.infoLocation import LocationInfo
from database.db import supabase, supabase_admin, supabase_bucket, supabase_url
from middleware.auth import get_current_user
import uuid
from dotenv import load_dotenv
import os
from picarta import Picarta
import json
from openai import AsyncOpenAI

router = APIRouter()


picarta_key = os.getenv("PICARTA_API_KEY")
openai_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=openai_key)
localizer = Picarta(picarta_key)


@router.post('/addImage', response_model=Location )
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
            
            return Location(latitude=location["latitude"], longitude=location["longitude"], country=location["country"],
                            province=location["province"], city=location["city"], imageUrl=location["image_url"],
                            user = location["user"])
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
                            
    
@router.get('/locations', response_model=Locations)
async def getLocations(request: Request, user = Depends(get_current_user)):

    try:
        
        user_locations = supabase.table("Locations").select().eq("user",user.id).execute()
        locations = []
        
        for location in user_locations.data:
            locations.append(Location(latitude=location["latitude"], longitude=location["longitude"], country=location["country"],
                                      province=location["province"], city = location['city'], imageUrl=location["image_url"],
                                      user=location['user']))
        
        return Locations(locations=locations)
    
    except Exception as e:
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
        
@router.get('/locationInfo', response_model=LocationInfo)
async def getLocationInfo(
    request: Request,
    city: str,
    province: str,
    country: str,
    user = Depends(get_current_user),
):
    
    try:
        
        prompt = f"""Provide comprehensive tourist information about {city}, {province} in {country}. Return only a JSON object and nothing more nor at the beggining or end in this exact format:
        {{
            "Message": "A welcoming introduction highlighting the unique character and main appeal of the location",
            "Best_Seasons": [
                "Spring (March-May): Detail specific events, weather conditions, and unique seasonal attractions",
                "Summer (June-August): Detail specific events, weather conditions, and unique seasonal attractions",
                "Fall (September-November): Detail specific events, weather conditions, and unique seasonal attractions",
                "Winter (December-February): Detail specific events, weather conditions, and unique seasonal attractions"
            ],
            "Best_attractions": [
                "Famous Landmark: Include historical significance, visitor tips, and best time to visit",
                "Cultural Site: Include cultural importance, unique features, and visitor experience",
                "Natural Wonder: Include natural beauty, activities available, and photography opportunities",
                "Local Experience: Include authentic local activities, cultural immersion opportunities, and insider tips"
            ],
            "Good_Hotels": [
                "Luxury Option: Include location benefits, standout amenities, and price range",
                "Mid-Range Option: Include location benefits, value propositions, and price range",
                "Boutique Option: Include unique features, local charm, and price range"
            ]
        }}
        Ensure all responses are factual and currently valid. Focus on unique local experiences and practical visitor information."""

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a travel expert. Provide accurate and detailed travel information in JSON format only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Extract the response text and parse it as JSON
        response_text = response.choices[0].message.content
        print(response_text)
        location_info = json.loads(response_text)
        
        return LocationInfo(**location_info)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
