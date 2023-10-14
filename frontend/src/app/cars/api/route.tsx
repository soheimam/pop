import { NextResponse } from "next/server";

const fs = require("fs");

type CreateCarResponse = {
  id: number;
  make: string;
  year: number;
  color: string;
};

interface InputData {
  processing_time: number;
  results: Result[];
  filename: string;
  version: number;
  camera_id: null | string;
  timestamp: string;
}

interface Result {
  box: Box;
  plate: string;
  region: ScoredItem;
  score: number;
  candidates: ScoredItem[];
  dscore: number;
  vehicle: Vehicle;
  model_make: ModelMake[];
  color: Color[];
  orientation: Orientation[];
}

interface Box {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

interface ScoredItem {
  score: number;
  [key: string]: any;
}

interface Vehicle extends ScoredItem {
  type: string;
  box: Box;
}

interface ModelMake extends ScoredItem {
  make: string;
  model: string;
}

interface Color extends ScoredItem {
  color: string;
}

interface Orientation extends ScoredItem {
  orientation: string;
}

interface ProcessedData {
  processing_time: number;
  filename: string;
  version: number;
  camera_id: null | string;
  timestamp: string;
  highestScores: {
    [key: string]: any;
  };
  topLevels: {
    [key: string]: any;
  };
}

function processJson(data: InputData): ProcessedData | {} {
  if (!data) return {};
  if (!data.results || data.results.length === 0) {
    throw new Error("No results available in the provided data");
  }

  const result = data.results[0];
  let processedData: ProcessedData = {
    processing_time: data.processing_time,
    filename: data.filename,
    version: data.version,
    camera_id: data.camera_id,
    timestamp: data.timestamp,
    highestScores: {},
    topLevels: {},
  };

  // Extracting the highest score and respective label/name from each field
  processedData.highestScores.region = getHighestScore(result.region, "code");
  processedData.highestScores.vehicle = getHighestScore(result.vehicle, "type");
  processedData.highestScores.model_make = getHighestScore(
    result.model_make,
    "make"
  );
  processedData.highestScores.color = getHighestScore(result.color, "color");
  processedData.highestScores.orientation = getHighestScore(
    result.orientation,
    "orientation"
  );

  // Joining top-level data
  processedData.topLevels.box = result.box;
  processedData.topLevels.plate = result.plate;
  processedData.topLevels.score = result.score;
  processedData.topLevels.dscore = result.dscore;

  return processedData;
}

function getHighestScore(
  field: ScoredItem | ScoredItem[],
  label: string | null = null
): any {
  if (Array.isArray(field)) {
    let highestScoreItem = field.reduce((prev: ScoredItem, curr: ScoredItem) =>
      prev.score > curr.score ? prev : curr
    );
    return label ? highestScoreItem[label] : highestScoreItem;
  }
  return label ? field[label] : field.score;
}

async function getBase64FromImageUrl(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  return base64Image;
}

export async function PUT(request: Request, response: Response) {
  const res = await request.json();
  const base64Body = res?.base64;

  const apiKey = process.env.NEXT_PUBLIC_CARS_API_KEY!;
  let body = new FormData();
  body.append("upload", base64Body);
  body.append("regions", "us-ca"); // Change to your country
  body.append("mmc", "true");

  const req = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
    },
    body: body,
  });
  console.log(req);
  const json = await req.json();
  const processedJson = processJson(json);
  console.log(processedJson);
  return NextResponse.json({ data: processedJson });
}

export async function POST(request: Request, response: Response) {
  const res = await request.json();
  const base64Body = res?.base64;
  const traits = res?.traits;
  const metafuseAPIKey = process.env.METAFUSE_API_KEY!;
  const metafuseAPI = "https://gateway.metafuse.me/v1/item";

  const req = await fetch(metafuseAPI, {
    method: "POST",
    headers: {
      ContentType: "application/json",
      Authorization: metafuseAPIKey,
    },
    body: JSON.stringify({
      visibility: "PUBLIC",
      image: base64Body,
      traits: traits,
      tokenId: 1,
      projectId: "be82af4a-9515-4c14-979f-27685ede3bbd",
    }),
  });
  const json = await req.json();
  console.log(json);
  return NextResponse.json({ data: json });
}
