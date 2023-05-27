from typing import Dict, Tuple, Text, Union
from fastapi import FastAPI
from starlette.responses import Response
import subprocess
import os, importlib
import json

app: type = FastAPI()

class PrettyJSONResponse(Response):
	media_type = "application/json"

	@classmethod
	def render(self: type, content: Union[Dict[str, str], Text], *args: Tuple[int, str], **kwargs: Dict[str, str]) -> bytes:
		return json.dumps(
			content,
			ensure_ascii=False,
			allow_nan=False,
			indent=3
		).encode("utf-8")

def ImportRoutes() -> None:
	path: str = os.getcwd() + "/base/api/routes"
	for root, dirs, files in os.walk(path):
		if len(files) == 0:
			continue

		if files[0] == "router.py":
			route: str = root.split("api/routes")[-1].replace("\\", ".").replace("/", ".")
			module: module = importlib.import_module(f"base.api.routes{route}.router")
			app.include_router(module.router)

ImportRoutes()

def Setup() -> None:
	print("Crate API is Running.")
	subprocess.call(["uvicorn", "base.config:app", "--host", "localhost", "--port", "8000"])