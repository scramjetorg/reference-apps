FROM alpine:latest
ENV SEQUENCER_VERSION=v2.8

RUN apk add --update npm curl jq

COPY . .

RUN npm i @scramjet/cli -g

RUN si seq pack . -o hello.tar.gz

COPY seq.sh /usr/local/bin/seq.sh

RUN chmod u+x /usr/local/bin/seq.sh

ENTRYPOINT [ "/usr/local/bin/seq.sh" ]
