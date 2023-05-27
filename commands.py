from typing import Tuple, Dict
from functools import wraps
import os
import shutil
import argparse

def ClearLogs():
    for root, dirs, files in os.walk("base"):
        for dir_name in dirs:
            if dir_name == "__pycache__":
                folder_path: str = os.path.join(root, dir_name)
                shutil.rmtree(folder_path)
                print(f"A pasta {folder_path} foi excluída.")

def argument(name: str, about: str):
    def decorator_func(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            parser: module = argparse.ArgumentParser()
            parser.add_argument(f"-{name}", dest=name, action="store_true", help=about)
            argspec: type = parser.parse_known_args()

            if getattr(argspec[0], name):
                kwargs[name] = True
                return func(*args, **kwargs)

        return wrapper
    return decorator_func


@argument(name="clear", about="Exemplo")
def ClearArg(clear=False):
    ClearLogs()

ClearArg()