import { accidents, DATASET_YEARS } from "@/data/accidents";
import { HIGH_RISK_THRESHOLD, HOTSPOT_MIN_COUNT } from "@/lib/accident-analytics";

/** Rule-based, local-only answers. Values come from the live dataset/config. */
interface Intent {
  id: string;
  keywords: string[];
  answer: () => string;
}

const first = DATASET_YEARS[0];
const last = DATASET_YEARS[DATASET_YEARS.length - 1];

export const intents: Intent[] = [
  {
    id: "about",
    keywords: ["roadsense", "what is", "what does", "purpose", "about", "project", "app"],
    answer: () =>
      "RoadSense is an academic road accident hotspot analysis tool. It lets you filter Mumbai accident records, view them on a map, and study accident patterns by year, location, type and severity. It describes past records only — it does not predict accidents.",
  },
  {
    id: "hotspot",
    keywords: ["hotspot", "concentration", "cluster", "identified", "identify", "shaded"],
    answer: () =>
      `Hotspots are found by grouping accident records that lie close together on the map. Areas with ${HOTSPOT_MIN_COUNT} or more nearby records are shaded as "High accident concentration". This reflects historical records, not a forecast.`,
  },
  {
    id: "threshold",
    keywords: ["high-risk", "high risk", "threshold", "risk location", "dangerous"],
    answer: () =>
      `A location is counted as high-risk when it has ${HIGH_RISK_THRESHOLD} or more accident records in the current selection. This threshold is defined for this project and is not an official classification.`,
  },
  {
    id: "severity",
    keywords: ["severity", "fatal", "serious", "minor", "categor", "colour", "color"],
    answer: () =>
      "Each record has one of three severity levels: Fatal, Serious or Minor. On the map, marker colours follow these levels as shown in the map key.",
  },
  {
    id: "dataset",
    keywords: ["dataset", "data", "records", "source", "official", "government", "years", "mumbai"],
    answer: () =>
      `The dataset contains ${accidents.length} Mumbai-only accident records from ${first}–${last}. It is a study/demo dataset prepared for this project — not live data and not verified official government data.`,
  },
  {
    id: "export",
    keywords: ["csv", "export", "download"],
    answer: () =>
      "On the Analysis page, click Export CSV. It downloads the records matching your current filters, with columns: Accident ID, Date, Year, Location, Road, Latitude, Longitude, Accident Type and Severity.",
  },
  {
    id: "filters",
    keywords: ["filter", "reset", "select", "year filter", "road filter"],
    answer: () =>
      "Use the filters at the top of each page to narrow records by Year, Location, Road, Accident Type and Severity. The same selection applies to the Dashboard, Accident Map and Analysis. Reset filters returns to all records.",
  },
  {
    id: "pedestrian",
    keywords: ["pedestrian", "walk", "cross", "footpath"],
    answer: () =>
      "Pedestrian tips: cross at marked crossings or signals, avoid using your phone while crossing, stay visible at night, and take extra care on busy highways and junctions.",
  },
  {
    id: "safety",
    keywords: ["safety", "safe", "tip", "precaution", "drive", "driver", "motorist", "helmet", "seatbelt", "speed"],
    answer: () =>
      "Motorist tips: keep to speed limits, wear a helmet or seatbelt, keep a safe following distance, avoid phone use and drink-driving, and slow down in crowded or poorly lit areas. These are general guidelines and cannot guarantee safety.",
  },
];

export const suggestedQuestions = [
  "What does RoadSense do?",
  "How are hotspots identified?",
  "What is a high-risk location?",
  "What does the dataset include?",
  "How does CSV export work?",
  "Road safety tips for pedestrians",
];

export const fallbackAnswer =
  "Sorry, I can only answer a few predefined questions about RoadSense — its dataset, hotspots, high-risk locations, severity, filters, CSV export and general road safety. Try one of the suggested topics.";

export function answerQuestion(question: string): string {
  const q = question.toLowerCase();
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of intents) {
    const score = intent.keywords.filter((k) => q.includes(k)).length;
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return best ? best.intent.answer() : fallbackAnswer;
}
