#!/usr/bin/env python
import io
from typing import Iterator
from datetime import datetime
from contextlib import contextmanager

import requests
from PIL import Image
from dateutil import rrule, relativedelta


@contextmanager
def _get_image(url: str):
    res = requests.get(url)
    c = io.BytesIO(res.content)
    try:
        im = Image.open(c)
        yield im.convert("RGBA")
    finally:
        im.close()


def _get_datetime_sequence() -> Iterator[datetime]:
    n_hours_ago = datetime.now() + relativedelta.relativedelta(hours=-2)
    mm = n_hours_ago.strftime("%M")
    if mm[1] in ["0", "1", "2", "3", "4"]:
        mm = f"{mm[0]}0"
    else:
        mm = f"{mm[0]}5"
    fixed_2_hours_ago = datetime(
        n_hours_ago.year, n_hours_ago.month, n_hours_ago.day, n_hours_ago.hour, int(mm)
    )

    return rrule.rrule(
        freq=rrule.MINUTELY, dtstart=fixed_2_hours_ago, until=datetime.now(), interval=5
    )


def gif():
    AREA = "000"

    with _get_image(
        f"http://tokyo-ame.jwa.or.jp/map/msk{AREA}.png"
    ) as im_msk, _get_image(f"http://tokyo-ame.jwa.or.jp/map/map{AREA}.jpg") as im_map:

        ims = []
        for date in _get_datetime_sequence():
            with _get_image(
                f"http://tokyo-ame.jwa.or.jp/mesh/{AREA}/{date.strftime('%Y%m%d%H%M')}.gif"
            ) as w:
                merged = Image.alpha_composite(im_map, w)
                merged2 = Image.alpha_composite(merged, im_msk)
                ims.append(merged2)

        for i in range(15):
            ims.insert(0, ims[-1])
        for i in range(15):
            ims.append(ims[-1])

        ims[0].save(
            "out.gif",
            save_all=True,
            optimize=True,
            append_images=[im for im in ims[1:]],
            duration=0.1 * 1000,
        )


if __name__ == "__main__":
    gif()
