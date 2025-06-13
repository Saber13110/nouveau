from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_db, get_current_user
from ..fedex_client import FedExClient

router = APIRouter()

@router.post('/', response_model=schemas.TrackingRead)
def create_tracking(
    tracking: schemas.TrackingCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    db_tracking = models.Tracking(**tracking.dict(), user_id=user.id)
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    return db_tracking

@router.get('/{tracking_number}', response_model=schemas.TrackingRead)
def get_tracking(
    tracking_number: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    track = (
        db.query(models.Tracking)
        .filter(models.Tracking.tracking_number == tracking_number)
        .filter(models.Tracking.user_id == user.id)
        .first()
    )
    if not track:
        raise HTTPException(status_code=404, detail='Tracking not found')
    return track


fedex = FedExClient()


@router.get('/', response_model=list[schemas.TrackingRead])
def list_trackings(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Tracking)
        .filter(models.Tracking.user_id == user.id)
        .order_by(models.Tracking.created_at.desc())
        .all()
    )


@router.post('/number')
def track_number(payload: schemas.TrackingNumberRequest):
    """Track a shipment using a tracking number via FedEx API."""
    return fedex.track_by_number(payload.trackingNumber)


@router.post('/reference')
def track_reference(payload: schemas.ReferenceRequest):
    """Track using a reference number."""
    return fedex.track_by_reference(payload.reference, payload.country)


@router.post('/tcn')
def track_tcn(payload: schemas.TCNRequest):
    """Track using a Transportation Control Number (TCN)."""
    return fedex.track_by_tcn(payload.tcn, payload.shipDate)


@router.post('/barcode')
def track_barcode(payload: schemas.BarcodeRequest):
    """Track using a barcode scan."""
    return fedex.track_by_barcode(payload.barcode)


@router.get('/proof/{tracking_number}')
def proof_of_delivery(tracking_number: str):
    """Retrieve proof of delivery PDF for the given tracking number."""
    pdf_bytes = fedex.get_proof_of_delivery(tracking_number)
    return Response(content=pdf_bytes, media_type='application/pdf')
