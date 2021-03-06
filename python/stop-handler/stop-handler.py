import asyncio

async def stop_handler():
    print("Cleaning up...", end=' ')
    await asyncio.sleep(1)
    print("Cleanup done.")

async def run(context, input):
    context.set_stop_handler(
        lambda timeout = 0, can_keep_alive = False: stop_handler()
    )
    await asyncio.sleep(10**9)
