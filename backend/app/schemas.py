from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    firstName: str
    lastName: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    isEmailVerified: bool
    createdAt: datetime

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class TrackingBase(BaseModel):
    tracking_number: str
    status: str
    status_details: str | None = None

class TrackingCreate(TrackingBase):
    pass

class TrackingRead(TrackingBase):
    id: int

    class Config:
        orm_mode = True


class TrackingNumberRequest(BaseModel):
    trackingNumber: str


class ReferenceRequest(BaseModel):
    reference: str
    country: str


class TCNRequest(BaseModel):
    tcn: str
    shipDate: str


class BarcodeRequest(BaseModel):
    barcode: str
