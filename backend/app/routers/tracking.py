from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_db, get_current_user

router = APIRouter()

@router.post('/', response_model=schemas.TrackingRead)
def create_tracking(tracking: schemas.TrackingCreate, db: Session = Depends(get_db)):
    db_tracking = models.Tracking(**tracking.dict())
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    return db_tracking

@router.get('/{tracking_number}', response_model=schemas.TrackingRead)
def get_tracking(tracking_number: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    track = db.query(models.Tracking).filter(models.Tracking.tracking_number == tracking_number).first()
    if not track:
        raise HTTPException(status_code=404, detail='Tracking not found')
    return track
