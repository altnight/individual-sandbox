import io
from datetime import datetime

import requests
from PIL import Image

AREA = "000"


def main():
    yyyymmddhh = datetime.now().strftime("%Y%m%d%H")
    mm = datetime.now().strftime("%M")
    if mm[1] in ["0", "1", "2", "3", "4"]:
        mm = f"{mm[0]}0"
    else:
        mm = f"{mm[0]}5"

    res1 = requests.get(f"http://tokyo-ame.jwa.or.jp/map/msk{AREA}.png")
    res2 = requests.get(f"http://tokyo-ame.jwa.or.jp/map/map{AREA}.jpg")
    res3 = requests.get(f"http://tokyo-ame.jwa.or.jp/mesh/{AREA}/{yyyymmddhh}{mm}.gif")
    c1 = io.BytesIO(res1.content)
    c2 = io.BytesIO(res2.content)
    c3 = io.BytesIO(res3.content)
    with Image.open(c1) as im1, Image.open(c2) as im2, Image.open(c3) as im3:

        converted1 = im1.convert("RGBA")
        converted2 = im2.convert("RGBA")
        converted3 = im3.convert("RGBA")

        merged = Image.alpha_composite(converted2, converted3)
        merged2 = Image.alpha_composite(merged, converted1)
        merged2.save(f"{AREA}_{yyyymmddhh}{mm}.png")


if __name__ == "__main__":
    main()
