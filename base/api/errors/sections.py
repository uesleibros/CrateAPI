from typing import Optional, Dict, List, Union
import yaml

def ValidSection(section: str, recents: Optional[bool] = False) -> List[Union[bool, List[str]]]:
	data: Dict[str, str] = yaml.safe_load(open("base/api/format/sections.yml", "r").read())
	offset: int = -1

	if recents:
		offset = 3
	return (section in data["sections"][0:offset], data["sections"])