from pydantic import BaseModel 
from typing import List 

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
    id: str

class Locations(BaseModel):
    locations: List[Location]
    