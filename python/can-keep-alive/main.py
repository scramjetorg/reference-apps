import asyncio
import inspect

async def run(context, input, *args):
    if args[0] == 'SEND_KEEPALIVE':
        context.set_stop_handler(
            lambda timeout = 0, can_keep_alive = False: context.keep_alive(args[1])
        )

    await asyncio.sleep(10**9)
