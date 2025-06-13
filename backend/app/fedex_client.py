import os
from datetime import datetime, timedelta
from typing import Any, Dict

import requests


class FedExClient:
    """Simple wrapper around the FedEx API."""

    def __init__(self) -> None:
        self.base_url = os.getenv("FEDEX_API_BASE", "https://apis.fedex.com")
        self.client_id = os.getenv("FEDEX_CLIENT_ID")
        self.client_secret = os.getenv("FEDEX_CLIENT_SECRET")
        self._token: str | None = None
        self._token_expiry = datetime.utcnow()

    def _obtain_token(self) -> None:
        if not self.client_id or not self.client_secret:
            raise RuntimeError("FedEx credentials are not configured")
        url = f"{self.base_url}/oauth/token"
        resp = requests.post(
            url,
            data={
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        self._token = data["access_token"]
        self._token_expiry = datetime.utcnow() + timedelta(seconds=data["expires_in"] - 60)

    def _get_token(self) -> str:
        if not self._token or datetime.utcnow() >= self._token_expiry:
            self._obtain_token()
        assert self._token
        return self._token

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        token = self._get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        resp = requests.post(f"{self.base_url}{path}", json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()

    def track_by_number(self, tracking_number: str) -> Dict[str, Any]:
        payload = {
            "trackingInfo": [
                {
                    "trackingNumberInfo": {
                        "trackingNumber": tracking_number,
                    }
                }
            ]
        }
        return self._post("/track/v1/trackingnumbers", payload)

    def track_by_reference(self, reference: str, country: str) -> Dict[str, Any]:
        payload = {
            "includeDetailedScans": True,
            "masterTrackingNumberInfo": {
                "shipperAccountNumber": reference,
                "destinationCountryCode": country,
            },
        }
        return self._post("/track/v1/referencedetails", payload)

    def track_by_tcn(self, tcn: str, ship_date: str) -> Dict[str, Any]:
        payload = {
            "trackingInfo": [
                {
                    "trackingNumberInfo": {
                        "trackingNumberUniqueId": tcn,
                        "shipDateBegin": ship_date,
                        "shipDateEnd": ship_date,
                    }
                }
            ]
        }
        return self._post("/track/v1/trackingnumbers", payload)

    def track_by_barcode(self, barcode: str) -> Dict[str, Any]:
        # For simplicity barcode is treated as tracking number
        return self.track_by_number(barcode)

    def get_proof_of_delivery(self, tracking_number: str) -> bytes:
        """Retrieve proof of delivery document as PDF."""
        token = self._get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        payload = {
            "trackingNumberInfo": {
                "trackingNumber": tracking_number,
            },
            "includeHTMLDetail": False,
            "documentType": "PDF",
        }
        url = f"{self.base_url}/track/v1/associatedshipments/documents"
        resp = requests.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        return resp.content
