import sys
from scramjet.streams import Stream


async def run(context, input, *args):
    """
    A Sequence that uses some basic HostClient's methods.

    Parameters:
        input (any): dummy input, it takes no params

    Returns:
        stream: output stream with data
    """
    stream = Stream()

    try:
        # get version
        version = await context.hub.get_version()
        print(version)
        context.logger.info(f"Host version called from Sequence: {version}")

        # get load check
        load_check = await context.hub.get_load_check()
        print(load_check)
        context.logger.info(f"Load check called from Sequence: {load_check}")

        # get config
        hub_config = await context.hub.get_config()
        print(hub_config)
        context.logger.info(f"Host config called from Sequence: {hub_config}")

        # get status
        status = await context.hub.get_status()
        print(status)
        context.logger.info(f"Host status called from Sequence: {status}")

        # List sequences and write its length to output
        seq_list = await context.hub.list_sequences()
        stream.write(str(len(seq_list)))
        context.logger.info(f"Sequence list called from Sequence: {seq_list}")

        # List instances and write its length to output
        inst_list = await context.hub.list_instances()
        stream.write(str(len(inst_list)))
        context.logger.info(f"Instance list called from Sequence: {inst_list}")
        
    except Exception as e:
        # if error occurs it will be logged under /instance/:id/stderr endpoint (CLI: si inst stderr <instID>)
        print(e, file=sys.stderr)
    finally:
        stream.end()
        return stream