from base.config import PrettyJSONResponse
from typing import Optional, Union, List
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from base.api.errors.sections import ValidSection
from base.api.format.payload import Payload
from base.api.wix.request import Crate

router: type = APIRouter()

@router.get("/projetos/recentes/{section}", tags=["Projetos"], summary="Listar projetos por meio de seções com paginação.", response_class=PrettyJSONResponse)
async def RecentsProjects(section: str, count: Optional[int] = Query(6)) -> dict:
	"""
	Listar projetos por meio de seções com paginação.

	- **section**: Nome da seção.
	- **count**: Números de projetos a ser pego.
	"""
	isValidSection: List[Union[bool, str]] = ValidSection(section, recents=True)
	if not isValidSection[0]:
		return JSONResponse(
			status_code=404,
			content={"error": f"Seção não disponível, tente outra.", "available": isValidSection[1][0:3]}
		)

	crate: type = Crate(section="projects", database="getSecProjs")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[section, count])