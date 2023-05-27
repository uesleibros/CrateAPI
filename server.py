from base import config
import argparse

parser: type = argparse.ArgumentParser()
parser.add_argument("-client", action="store_true", help="Run the Crate API with client accessible from all network interfaces")
args: type = parser.parse_args()

config.Setup(client=args.client)