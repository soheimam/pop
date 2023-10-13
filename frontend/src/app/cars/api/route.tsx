import { NextResponse } from "next/server";

const fs = require("fs");

type CreateCarResponse = {
  id: number;
  make: string;
  year: number;
  color: string;
};

async function getBase64FromImageUrl(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  return base64Image;
}

export async function GET(request: Request, response: Response) {
  // let carPath = "./car2.png";

  console.log(request);
  let carPath = await getBase64FromImageUrl(
    "https://www.topgear.com/sites/default/files/2021/11/PCGB21_1364_fine.jpg?w=1784&h=1004"
  );

  const apiKey = process.env.NEXT_PUBLIC_CARS_API_KEY!;
  console.log(apiKey);
  let body = new FormData();
  // Or body.append('upload', base64Image);
  body.append("regions", "us-ca"); // Change to your country
  // body.append("mmc", "true");
  body.append("upload", carPath);
  // body.append("upload", fs.createReadStream(carPath));

  const req = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
    },
    body: body,
  });
  const json = await req.json();

  return NextResponse.json({ data: json });
}

export async function POST(request: Request, response: Response) {
  console.log(request);
  // let carPath = "./car2.png";
  const res = await request.json();
  console.log(res);
  const base64Body = res?.base64;
  const metafuseAPIKey = process.env.METAFUSE_API_KEY!;
  const metafuseAPI = "https://gateway.metafuse.me/v1/item";

  // payload = {
  //     "allowDuplicatesOverride": False,
  //     "visibility": "PUBLIC"
  // }
  // headers = {
  //     "accept": "application/json",
  //     "content-type": "application/json"
  // }

  // response = requests.post(url, json=payload, headers=headers)

  // print(response.text)

  const req = await fetch(metafuseAPI, {
    method: "POST",
    headers: {
      ContentType: "application/json",
      Authorization: metafuseAPIKey,
    },
    body: JSON.stringify({
      visibility: "PUBLIC",
      image: base64Body,
      traits: [{ trait_type: "make", value: "Toyota" }],
      tokenId: 1,
      projectId: "be82af4a-9515-4c14-979f-27685ede3bbd",
    }),
  });
  const json = await req.json();
  console.log(json);
  return NextResponse.json({ data: json });
}
