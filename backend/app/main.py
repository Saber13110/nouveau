from fastapi import FastAPI, Depends
from .database import Base, engine
from .routers import auth, tracking
from .auth import get_current_user

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Inject dependency for /api/auth/me to use token validation
app.include_router(auth.router, prefix='/api/auth')
app.include_router(tracking.router, prefix='/api/tracking', dependencies=[Depends(get_current_user)])

@app.get('/api/health')
def health_check():
    return {'status': 'ok'}
