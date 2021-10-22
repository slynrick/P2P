# Spotted Backend

Para o backend da aplicação, estamos usando o servidor freechains e um servidor em python usando Flask que permite a comunicação com o servidor freechains via socket e com a aplicação via requisição HTTP.

## Freechains

A forma de funcionamento deste protocolo pode ser visualizada em sua página do [Github](https://github.com/Freechains/README).

Abaixo estão listados os comandos disponíveis no freechains cli:
```bash
freechains chains join  <chain> [<shared>]
freechains chains leave <chain>
freechains chains list
freechains chains listen

freechains chain <chain> genesis
freechains chain <chain> heads (all | linked | blocked)
freechains chain <chain> get (block | payload) <hash>
freechains chain <chain> post (file | inline | -) [<path_or_text>]
freechains chain <chain> (like | dislike) <hash>
freechains chain <chain> reps <hash_or_pub>
freechains chain <chain> remove <hash>
freechains chain <chain> traverse (all | linked) <hashes>...
freechains chain <chain> listen

freechains peer <addr:port> ping
freechains peer <addr:port> chains
freechains peer <addr:port> (send | recv) <chain>
freechains crypto (shared | pubpvt) <passphrase>

Options:
    --help              [none]            displays this help
    --version           [none]            displays software version
    --host=<addr:port>  [all]             sets host address and port to connect [default: localhost:$PORT_8330]
    --port=<port>       [all]             sets host port to connect [default: $PORT_8330]
    --sign=<pvt>        [post|(dis)like]  signs post with given private key
    --encrypt           [post]            encrypts post with public key (only in public identity chains)
    --decrypt=<pvt>     [get]             decrypts post with private key (only in public identity chains)
    --why=<text>        [(dis)like]       explains reason for the like
```

Todos estes comandos podem ser entendidos através da [página de GitHub](https://github.com/Freechains/README/blob/master/docs/cmds.md)

Apenas os comandos do tipo listen que existe em chain e chains não foram implementados pois perdem o sentido em uma API


As rotas implementadas, formas de uso e resultados esperados pode ser encontrado no item Rotas deste README.

## API Server em Flask

O servidor foi desenvolvido para trabalhar com a versão 0.8.6 do protocolo Freechains.
O servidor é levantado no localhost porta 5000, única porta que é exposta de dentro do container docker em que o freechains-host e o servidor flask está rodando.


### Rotas
| Rota | Parâmetros | Body | Descrição|
|---|---|---|---|
| /freechains/chains/join/`chain` | `chain`: Nome da cadeia URL encoded | {<br>`"shared"`: "XXXXX..."<br>} | Rota para engressar em uma nova cadeia|
| /freechains/chains/join/leave/`chain` | `chain`: Nome da cadeia URL encoded |  | Rota para sair em uma nova cadeia|
| /freechains/chains/list | | | Rota para listar as cadeias locais|
| /freechains/chain/genesis/`chain` | `chain`: Nome da cadeia URL encoded |  | Rota para identificar o hash do bloco genesis|
| /freechains/chain/get/`chain`/`hash`/`mod` | `chain`: Nome da cadeia URL encoded<br> `hash`:  Hash do bloco <br> `mod`: all ou linked ou blocked | {<br>`"decript"`: "XXXXX..."<br>} | Rota para pegar os dados de um bloco em uma cadeia|
| /freechains/chain/post/`chain` | `chain`: Nome da cadeia URL encoded | {<br>`"encrypt"`: "XXXXX...",<br>`"sign"`: "XXXXX...",<br>`"payload"`: "Olá!"<br>} | Rota para escrever na cadeia|
| /freechains/chain/like/`chain`/`hash` | `chain`: Nome da cadeia URL encoded<br>`hash`: Hash do bloco | {<br>`"sign"`: "XXXXX...",<br>`"why"`: "Legal!"<br>} | Rota para dar like em um bloco da cadeia|
| /freechains/chain/dislike/`chain`/`hash` | `chain`: Nome da cadeia URL encoded<br>`hash`: Hash do bloco | {<br>`"sign"`: "XXXXX...",<br>`"why"`: "Falta de educação!"<br>} | Rota para deslike em um bloco da rede|
| /freechains/chain/reps/`chain`/`hash_or_pub` | `chain`: Nome da cadeia URL encoded<br>`hash_or_pub`: Hash de um bloco ou chave publica de um usuário |  | Rota para identificar a repoutação em uma cadeia|
| /freechains/chain/remove/`chain`/`hash` | `chain`: Nome da cadeia URL encoded<br> `hash`:  Hash do bloco | | Rota para retirar um bloco da cadeia|
| /freechains/chain/traverse/`chain` | `chain`: Nome da cadeia URL encoded | {<br>`"hashes"`: ["XXXXX...", "YXXXX..."]<br>} | Rota para buscar a cadeia de blocos entre o primeiro e o segundo hash. O segundo hash é opcional|
| /freechains/peer/ping/`remote` | `remote`: Endereço remoto no formato addr:port |  | Rota para verificar conectividade com o peer remoto|
| /freechains/peer/chains/`remote` | `remote`: Endereço remoto no formato addr:port |  | Rota para listar as cadeias remotas|
| /freechains/peer/send/`remote`/`chain` | `remote`: Endereço remoto no formato addr:port<br>`chain`: Nome da cadeia URL encoded |  | Rota para enviar dados da cadeia para remoto|
| /freechains/peer/recv/`remote`/`chain` | `remote`: Endereço remoto no formato addr:port<br>`chain`: Nome da cadeia URL encoded |  | Rota para receber dados da cadeia para remoto|
| /freechains/crypto/`mod` | `mod`: shared ou pubpvt | {<br>`"passphrase"`: "Senha muito forte!"<br>} | Rota para buscar a cadeia de blocos entre o primeiro e o segundo hash. O segundo hash é opcional|
| /freechains/host/now/`time` | `time`: Tempo para o nó | | Rota para mudar o tempo do nó|
|/freechains/custom/get/payloads/`chain`/`start`/`end` | `chain`: Nome da cadeia URL encoded<br> `start`:  Hash do bloco inicial <br> `end`: Hash do bloco final | {<br>`"decript"`: "XXXXX..."<br>} | Rota para pegar os dados de payload de todos os blocos entre o inicial e final, com eles inclusos|

## Utilização

### Instalação e Execução do docker

Para instalar o docker
```sh
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Escrever em um arquivo de nome Dockerfile:

```docker
FROM ubuntu:18.04

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y \
    git \
    wget \
    unzip \
    default-jre \
    libsodium23 \
    python3 \
    python3-pip
RUN pip3 install flask

WORKDIR /freechains
RUN wget https://github.com/Freechains/README/releases/download/v0.8.6/install-v0.8.6.sh && sh install-v0.8.6.sh .
ENV PATH="/freechains:${PATH}"

COPY server.py /freechains/server.py
COPY start.sh /freechains/start.sh

EXPOSE 5000

CMD start.sh
```

No terminal execute o comando:
```sh
sudo docker build -t spotted-backend . #build image
sudo docker run -d -p 5000:5000 --name spotted-backend-server1 spotted-backend #levanta primeiro servidor na porta 5000 do host
sudo docker run -d -p 5001:5000 --name spotted-backend-server2 spotted-backend # levanta segundo servidor na porta 5001 do host
```

Para acessar o container execute no terminal:
```sh
sudo docker exec -it spotted-backend-server1 /bin/bash #entrará no terminal deste container
```


### Comunicação com a API

Para realizar requisições ao servidor API no docker na porta 5000:
```sh
curl -H "Content-Type: application/json" -X POST http://localhost:5000/freechains/chains/list # recebe a lista de cadeias no nó
curl -d '{"shared": "XXXXX..."}' -H "Content-Type: application/json" -X POST http://localhost:5000/freechains/chains/join/%21teste1 # cria uma cadeia #teste1
```