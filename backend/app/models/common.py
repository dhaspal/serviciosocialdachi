from pydantic import BaseModel, ConfigDict


class MongoModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
