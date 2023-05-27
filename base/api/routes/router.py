from typing import Dict, Any
from base.config import PrettyJSONResponse
from fastapi.responses import JSONResponse
from fastapi import APIRouter

router: type = APIRouter()

@router.get("/", response_class=PrettyJSONResponse)
async def Root() -> Dict[str, Any]:
	return {
		"name": "CrateAPI",
		"authors": open("authors", "r").read().split(","),
		"version": float(open("version", "r").read()),
		"website": "https://pptgamespt.wixsite.com/crate",
		"others": [
			"HELLO I AM FROM BRAZIL PLS MICROSOFT SEE ME!!!",
			"Can be google too."
		]
	}