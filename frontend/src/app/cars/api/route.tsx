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
