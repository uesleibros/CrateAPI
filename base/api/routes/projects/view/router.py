from base.config import PrettyJSONResponse
from typing import Optional, Union, List, Dict, Any
from fastapi import APIRouter, Query
from base.api.format.payload import Payload
from base.api.wix.request import Crate
import json

router: type = APIRouter()

@router.get("/projetos/ver/{id}", tags=["Projetos"], summary="Obter informações do projeto.", response_class=PrettyJSONResponse)
async def ViewProject(id: str) -> Dict[str, Any]:
	"""
	Obter informações do projeto.

	- **id**: ID do projeto.
	"""
	crate: type = Crate(section="projects", database="getProject")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[json.loads(open("base/api/format/api.json", "r").read()), id, True])

@router.get("/projetos/ver/{id}/avaliacoes", tags=["Projetos"], summary="Obter avaliações do projeto.", response_class=PrettyJSONResponse)
async def ViewProject(id: str) -> Dict[str, Any]:
	"""
	Obter informações do projeto.

	- **id**: ID do projeto.
	"""
	crate: type = Crate(section="projects", jsw="rating", database="projGetRatings")
	crate.Payload(Payload().dict())

	return await crate.Request(data=[json.loads(open("base/api/format/api.json", "r").read()), id])