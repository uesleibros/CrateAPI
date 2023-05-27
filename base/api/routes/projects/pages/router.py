from base.config import PrettyJSONResponse
from typing import Optional, Union, List, Dict, Any
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from base.api.errors.sections import ValidSection
from base.api.format.payload import Payload
from base.api.wix.request import Crate

router: type = APIRouter()

@router.get("/projetos/{section}", tags=["Projetos"], summary="Listar projetos lançados recentemente por seções.", response_class=PrettyJSONResponse)
async def SectionsProjects(section: str, page: Optional[int] = Query(1), per_page: Optional[int] = Query(18)) -> Dict[str, Any]:
	isValidSection: List[Union[bool, str]] = ValidSection(section)
	if not isValidSection[0]:
		return JSONResponse(
			status_code=404,
			content={"error": f"Seção não disponível, tente outra.", "available": isValidSection[1]}
		)

	crate: type = Crate(section="projects", database="getSecProjs")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[section, per_page, per_page * (page - 1)])