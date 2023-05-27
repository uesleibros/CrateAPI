from typing import Optional, Dict, Any, Union, List
import aiohttp

class Crate:
	@classmethod
	def __init__(self: type, section: str, database: str, jsw: Optional[str] = '') -> None:
		self.__HEADERS: Dict[str, str] = {
			"Accept": "application/json, text/plain, */*",
			"CommonConfig": "%7B%22brand%22%3A%22wix%22%2C%22bsi%22%3A%225d99ac66-bec3-4e67-a5f6-04d48f3d9260%7C1%22%2C%22BSI%22%3A%225d99ac66-bec3-4e67-a5f6-04d48f3d9260%7C1%22%7D",
			"Content-Type": "application/json",
			"Referer": "https://pptgamespt.wixsite.com/crate/_partials/wix-thunderbolt/dist/clientWorker.2b57f96a.bundle.min.js",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
			"X-Wix-Site-Revision": "16366",
			"X-XSRF-Token": "1684590813|92kPuIg7IncT"
		}

		self.__PATH: str = "https://pptgamespt.wixsite.com/crate/_api/wix-code-public-dispatcher-ng/siteview/_webMethods/backend"
		self.__SECTION: str = section
		self.__DATABASE: str = database
		self.__payload: Dict[str, str] = {}
		self.__jsw: str = jsw

		if len(jsw) == 0:
			self.__jsw = self.__SECTION

		self.__ROUTE: str = f"{self.__PATH}/{self.__SECTION}/{self.__jsw}.jsw/{self.__DATABASE}.ajax"

	@classmethod
	def __ChedderHeaders(self: type, payload: Dict[str, str]) -> None:
		self.__HEADERS["Authorization"] = payload["instance"]
		self.__HEADERS["X-Wix-APP-Instance"] = payload["instance"]

	@classmethod
	def Payload(self: type, payload: Dict[str, str]) -> None:
		self.__payload = payload
		self.__ChedderHeaders(self.__payload)

	@classmethod
	async def Request(self: type, data: Optional[Union[Dict[str, str], List[Union[str, int]]]] = {}) -> str:
		async with aiohttp.ClientSession() as session:
			async with session.post(url=self.__ROUTE, params=self.__payload, json=data, headers=self.__HEADERS) as resp:
				return await resp.json()