from pydantic import BaseModel
from typing import List

class Fruit(BaseModel):
    name: str
    price: float

class Fruits(BaseModel):
    fruits: List[Fruit]  # Changed to lowercase to match usage
