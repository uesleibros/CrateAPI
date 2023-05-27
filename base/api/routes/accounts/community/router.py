from base.config import PrettyJSONResponse
from typing import Dict, Any
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from base.api.format.payload import Payload
from base.api.wix.request import Crate

router: type = APIRouter()

@router.get("/contas/comunidade", tags=["Contas"], summary="Principais contas do Crate.", response_class=PrettyJSONResponse)
async def CommunityAccounts() -> Dict[str, Any]:
	crate: type = Crate(section="accounts", jsw="profiles", database="getProfilesList")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[])