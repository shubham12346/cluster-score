import { BASE_URl } from "../constant";

// src/services/api.js
export const fetchMockColumnHeaders = async (payload) => {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //     return ["Keyword", "Category", "Volume", "Competition", "Description"];
  try {
    const res = await fetch(`${BASE_URl}/get-headers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("res", res);
    if (!res.ok) throw new Error("Failed to process sheet");
    return (await res.json()) || [];
  } catch (error) {
    console.log("err", error);
  }
};

export const processSheetAPI = async (payload) => {
  const res = await fetch(`${BASE_URl}/score-sheet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to process sheet");
  return await res.json();
};
