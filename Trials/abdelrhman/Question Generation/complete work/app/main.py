from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from Questiongen import main

app = FastAPI()
qg = main.QGen()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class QuestionRequest(BaseModel):
    context: str
    n_ques:int
    n_mcq: int

class QuestionResponse(BaseModel):
    questions: list


@app.get('/')
def index():
    return {'message':'hello world',"Author":"Abdelrhman Abdelaziz"}

@app.post("/mcq", response_model=QuestionResponse)
def getquestion(request: QuestionRequest):
    context = request.context
    n_mcq = request.n_mcq
    n_ques = request.n_ques
    if n_ques <= 0 or n_mcq <=0 :
        return QuestionResponse(questions=[])
    ques = qg.predict_mcq(context,n_ques,n_mcq)
    return QuestionResponse(questions=ques)

