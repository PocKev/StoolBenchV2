from pydantic import BaseModel, Field


class StoolPayload(BaseModel):
    wetness: float = Field(ge=0, le=1)
    experience: float = Field(ge=0, le=1)
