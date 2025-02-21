from pydantic import BaseModel
from typing import List

class LocationInfo(BaseModel):
    Message: str
    Best_Seasons: List[str]
    Best_attractions: List[str]
    Good_Hotels: List[str]
    
    