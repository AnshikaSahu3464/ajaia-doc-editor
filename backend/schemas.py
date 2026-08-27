from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str = "Untitled Document"
    content: str = ""
    owner_id: int


class DocumentUpdate(BaseModel):
    title: str
    content: str


class ShareCreate(BaseModel):
    user_id: int
    permission: str = "editor"