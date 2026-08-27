from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import User, Document, DocumentShare
from schemas import DocumentCreate, DocumentUpdate, ShareCreate

app = FastAPI(title="Ajaia Docs API")

@app.post("/seed-users")
def seed_users(db: Session = Depends(get_db)):
    existing_users = db.query(User).count()

    if existing_users > 0:
        return {"message": "Users already seeded"}

    users = [
        User(name="Anshika Sahu", email="anshika@example.com"),
        User(name="Rahul Sharma", email="rahul@example.com"),
        User(name="Priya Verma", email="priya@example.com"),
    ]

    db.add_all(users)
    db.commit()

    return {"message": "Demo users created"}
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Ajaia Docs API is running"}


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.post("/documents")
def create_document(
    data: DocumentCreate,
    db: Session = Depends(get_db)
):
    document = Document(
        title=data.title,
        content=data.content,
        owner_id=data.owner_id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


@app.get("/documents/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document


@app.put("/documents/{document_id}")
def update_document(
    document_id: int,
    data: DocumentUpdate,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    document.title = data.title
    document.content = data.content

    db.commit()
    db.refresh(document)

    return document


@app.post("/documents/{document_id}/share")
def share_document(
    document_id: int,
    data: ShareCreate,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    share = DocumentShare(
        document_id=document_id,
        user_id=data.user_id,
        permission=data.permission
    )

    db.add(share)
    db.commit()
    db.refresh(share)

    return share