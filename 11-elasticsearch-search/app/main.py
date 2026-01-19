from fastapi import FastAPI
from elasticsearch import Elasticsearch

app = FastAPI()
es = Elasticsearch(["http://elasticsearch:9200"])

@app.get("/")
def root():
    return {"message": "Elasticsearch Search API OK ✅"}

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/index/{doc}")
def index_doc(doc: str):
    es.index(index="test", document={"content": doc})
    return {"indexed": doc}