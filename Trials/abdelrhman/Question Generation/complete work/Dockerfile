FROM tiangolo/uvicorn-gunicorn:python3.9-slim
RUN apt-get update && apt-get install -y git
RUN  apt-get update \
  && apt-get install -y wget


COPY ./app /app
WORKDIR /app
ENV MAX_WORKERS="1"
ENV WEB_CONCURRENCY="1"
RUN pip install --no-cache-dir -r ./requirements.txt
RUN python -m spacy download en

RUN wget https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz
RUN tar -xvf  s2v_reddit_2015_md.tar.gz
RUN rm s2v_reddit_2015_md.tar.gz

RUN wget --no-check-certificate "https://onedrive.live.com/download?cid=7720A96B0BE47CA7&resid=7720A96B0BE47CA7%21893&authkey=APc2ZIle1BA9508"
RUN tar -xvf  'download?cid=7720A96B0BE47CA7&resid=7720A96B0BE47CA7!893&authkey=APc2ZIle1BA9508'
RUN rm 'download?cid=7720A96B0BE47CA7&resid=7720A96B0BE47CA7!893&authkey=APc2ZIle1BA9508'

