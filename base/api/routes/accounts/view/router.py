from base.config import PrettyJSONResponse
from typing import Dict, Any
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from base.api.format.payload import Payload
from base.api.wix.request import Crate

router: type = APIRouter()

@router.get("/contas/ver/{perfil}", tags=["Contas"], summary="Obter informações de conta.", response_class=PrettyJSONResponse)
async def ViewAccount(perfil: str) -> Dict[str, Any]:
	"""
	Obtém informações de uma conta.

	- **perfil**: ID ou nome da conta.
	"""
	crate: type = Crate(section="accounts", jsw="profiles", database="getProfile")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[perfil])

@router.get("/contas/ver/{perfil}/projetos", tags=["Contas"], summary="Obter projetos de conta.", response_class=PrettyJSONResponse)
async def ViewAccount(perfil: str, page: int = Query(1), per_page: int = Query(12)) -> Dict[str, Any]:
	"""
	Obtém informações de uma conta.

	- **perfil**: ID ou nome da conta.
	- **page**: Número da página.
	- **per_page**: Número de projetos a ser pegos por página.
	"""
	crate: type = Crate(section="projects", database="getProfileProjects")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[perfil, per_page, page])