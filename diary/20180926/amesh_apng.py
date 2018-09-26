import io
import os
from typing import Iterator
from datetime import datetime
from contextlib import contextmanager

import requests
from PIL import Image
from apng import APNG
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


def get_images():
    with _get_image(
        f"http://tokyo-ame.jwa.or.jp/map/msk000.png"
    ) as im_msk, _get_image(f"http://tokyo-ame.jwa.or.jp/map/map000.jpg") as im_map:


        ims = []
        for date in _get_datetime_sequence():
            with _get_image(
                f"http://tokyo-ame.jwa.or.jp/mesh/000/{date.strftime('%Y%m%d%H%M')}.gif"
            ) as w:

                _merged = Image.alpha_composite(im_map, w)
                merged = Image.alpha_composite(_merged, im_msk)
                merged.save(date.strftime('%Y%m%d%H%M') + '.png')

def make_apng():
    png_files = [x for x in os.listdir('.') if x.endswith('.png')]

    APNG.from_files(png_files, delay=100).save("result.png")

if __name__ == "__main__":
    get_images()
    make_apng()
