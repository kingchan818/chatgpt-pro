from interpreter import interpreter
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel


app = FastAPI(root_path="/api")

interpreter.offline = True
interpreter.auto_run = True

class ReplitRequestBody(BaseModel):
    messages: list = None
    message: str
    model: str = 'gpt-4o-mini'
    api_key: str


@app.post("/replit")
def chat_endpoint(reqBody: ReplitRequestBody):
    interpreter.llm.model = reqBody.model
    interpreter.llm.api_key = reqBody.api_key
    interpreter.messages = [] if reqBody.messages is None else reqBody.messages

    def event_stream():
        for result in interpreter.chat(reqBody.message, stream=True, display=False):
            yield f"data: {result}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")