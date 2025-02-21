from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, File, UploadFile
from models.location import  Location, Locations
from models.infoLocation import LocationInfo
from database.db import supabase, supabase_admin, supabase_bucket, supabase_url
from middleware.auth import get_current_user
import uuid
from dotenv import load_dotenv
import os
from picarta import Picarta
from openai import AsyncOpenAI
from sse_starlette.sse import EventSourceResponse

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
            result = supabase.table('Locations').select().eq("image_url",imageUrl).execute()
            locationId=result.data[0]
            
            return Location(latitude=location["latitude"], longitude=location["longitude"], country=location["country"],
                            province=location["province"], city=location["city"], imageUrl=location["image_url"],
                            user = location["user"], id = str(locationId["id"]))
            
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
                                      user=location['user'], id=str(location['id'])))
        
        return Locations(locations=locations)
    
    except Exception as e:
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
        
@router.get('/locationInfo')
async def getLocationInfo(
    request: Request,
    city: str,
    province: str,
    country: str,
    user = Depends(get_current_user),
):
    async def event_generator():
        try:
            prompt = f"""Provide comprehensive tourist information about {city}, {province} in {country} You must adhere to this format:

Start with a welcoming introduction about the location.

**Best Seasons to Visit**
^- Spring (March-May): Detail specific events, weather conditions, and seasonal attractions 
^- Summer (June-August): Detail specific events, weather conditions, and seasonal attractions 
^- Fall (September-November): Detail specific events, weather conditions, and seasonal attractions 
^- Winter (December-February): Detail specific events, weather conditions, and seasonal attractions 

**Must-See Attractions**
^- Famous Landmark: Include historical significance and visitor tips 
^- Cultural Site: Include cultural importance and unique features 
^- Natural Wonder: Include natural beauty and activities available 
^- Local Experience: Include authentic activities and insider tips 

**Recommended Hotels**
^- Luxury Option: Include location benefits and standout amenities 
^- Mid-Range Option: Include location benefits and value propositions 
^- Boutique Option: Include unique features and local charm  """

            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a travel expert. Provide accurate and detailed travel information, Adhere strictly to the format provided,special symbols and line breaks matter."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0,
                max_tokens=1000,
                stream=True
            )

            collected_messages = []
            async for chunk in response:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    collected_messages.append(content)
                    yield {
                        "event": "message",
                        "data": content
                    }
                    

            complete_response = "".join(collected_messages)
            
            yield {
                "event": "complete",
                "data": complete_response
            }

        except Exception as e:
            yield {
                "event": "error",
                "data": str(e)
            }

    return EventSourceResponse(event_generator())

@router.get('/location/{id}', response_model=Location)
async def getLocationById(id: str, user = Depends(get_current_user)):
    try:
        result = supabase.table("Locations").select().eq("id", id).eq("user", user.id).execute()
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
        
        loc = result.data[0]
        return Location(
            latitude=loc["latitude"],
            longitude=loc["longitude"],
            country=loc["country"],
            province=loc["province"],
            city=loc["city"],
            imageUrl=loc["image_url"],
            user=loc["user"],
            id=str(loc["id"])
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
@router.delete('/location/{id}', response_model=Location)
async def deleteLocation(id:str, user= Depends(get_current_user)):
    try:
        result = supabase.table("Locations").delete().eq("id",id).eq("user", user.id).execute()
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
        loc = result.data[0]
        
        image_url = loc.get("image_url")
        if image_url:
            filename = image_url.split("/")[-1]
            supabase_admin.storage.from_(supabase_bucket).remove([filename])
        
        return Location(
            latitude=loc["latitude"],
            longitude=loc["longitude"],
            country=loc["country"],
            province=loc["province"],
            city=loc["city"],
            imageUrl=loc["image_url"],
            user=loc["user"],
            id=str(loc["id"])
        )
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))