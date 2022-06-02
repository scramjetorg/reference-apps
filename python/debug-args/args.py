from scramjet.streams import Stream
import json

def run(context, input, arg1, arg2):
    output = {"first_arg": arg1, "second_arg": arg2}
    return Stream.read_from(json.dumps(output, separators=(',', ':')))
