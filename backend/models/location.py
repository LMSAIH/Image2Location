from pydantic import BaseModel 

class Image(BaseModel):
    imageUrl: str
    user: str
    
class Location(BaseModel):
    latitude: float
    longitude: float
    country: str
    city: str
    province: str
    imageUrl: str
    user: str
    