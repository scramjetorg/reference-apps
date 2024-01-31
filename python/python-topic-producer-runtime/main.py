def run(context, input):
   result = input.map(lambda s: f'producer got: {s}' + "\n").each(print)
   result.provides = 'topic-test'
   result.content_type = 'text/plain'
   return result
