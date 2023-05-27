from base.config import PrettyJSONResponse
from typing import Optional, Dict, Any
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from base.api.format.payload import Payload
from base.api.wix.request import Crate

router: type = APIRouter()

@router.get("/projetos/buscar/{nome}", tags=["Projetos"], summary="Faz a busca de projetos por nome.", response_class=PrettyJSONResponse)
async def SearchProjects(nome: str, page: Optional[int] = Query(1), per_page: Optional[int] = Query(18)) -> Dict[str, Any]:
	"""
	Faz a busca de projetos por nome.

	- **nome**: Nome do projeto.
	- **page**: Número da página.
	- **per_page**: Número de projetos a ser pegos por página.
	"""
	crate: type = Crate(section="projects", database="searchProjects")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[[nome], None, per_page, per_page * (page - 1)])