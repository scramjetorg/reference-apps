def run(context, input):
   result =  input.map(lambda s: f'consumer got: {s}').each(print)
   result.requires = 'topic-test'
   result.content_type = 'text/plain'
   return result
