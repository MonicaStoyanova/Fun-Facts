import { del, get, post, put } from "./api.js";

export async function getAll() {
  return get("/data/facts?sortBy=_createdOn%20desc");
}

export async function getById(id) {
  return get("/data/facts/" + id);
}

export async function deleteById(id) {
  return del("/data/facts/" + id);
}

export async function createFact(factData) {
  return post("/data/facts", factData);
}

export async function editFact(id, factData) {
  return put("/data/facts/" + id, factData);
}
