import sys
from scramjet.streams import Stream


async def run(context, input, *args):
    """
    Sequence that starts any other Sequence, by giving its id as an argument.

    Parameters:
        input (any): dummy input, it takes no params
        *args (tuple): Sequences ids that will be started

    Returns:
        stream: output stream with ids of started Instances
    """
    stream = Stream()
    context.logger.info("Working...")
    try:
        # for each element in args tuple
        for seq_id in args:
            # get Sequence object
            seq = await context.hub.get_sequence(seq_id)
            context.logger.info(f"Sequence client called: {seq.id}")

            inst = await seq.start()
            context.logger.info(f"Sequence {seq_id} started: {inst.id}")
            stream.write(inst.id)
    
    except Exception as e:
        # if error occurs it will be logged under /instance/:id/stderr endpoint (CLI: si inst stderr <instID>)
        print(e, file=sys.stderr)
    finally:
        stream.end()
        return stream