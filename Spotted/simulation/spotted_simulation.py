# coding: utf-8

import argparse
from enum import Enum
from typing import Any, Dict, List, final
import docker
import time
import requests
import base64
import random
import json
import nltk
nltk.download('machado')
DOM_CASMURRO = nltk.corpus.machado.raw('romance/marm08.txt')
random.seed(int(time.time()))

class UserType(Enum):
    ACTIVE = 1
    TROLL = 2
    CASUALLY = 3

class MessageType(Enum):
    NEUTRAL = 1
    VIRAL = 2
    UNRESPECTFULL = 3
    

USERS_TYPE = [(UserType.ACTIVE, 20), (UserType.TROLL, 20), (UserType.CASUALLY, 40), (UserType.CASUALLY, 60), (UserType.CASUALLY, 80)]
LAST_TIME = round(time.time() * 1000) # first time in millisecond
SIMULATION_CHAIN = "%23SIMU" # chain #SIMU

def add_time(lapse: int) -> None:
    global CLIENT, LAST_TIME
    LAST_TIME += lapse
    for container in CLIENT.containers.list():
        if "Spotted-peer-" in container.name:
            address = f"localhost:{container.attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
            requests.get(f"http://{address}/freechains/host/now/{LAST_TIME}")
    print(f"[SETUP] New time for all nodes -> {LAST_TIME}")

def get_new_pic() -> str:
    response = requests.get("https://picsum.photos/200/300")
    b64img = base64.b64encode(response.content).hex()
    return b64img

def join_all_nodes_on_chain() -> None:
     global CLIENT, USERS, SIMULATION_CHAIN
     containers = [c for c in CLIENT.containers.list() if "Spotted-peer-" in c.name]
     pioneer = [user for user in USERS if user["pioneer"]][-1]
     for container in containers:
        address = f"localhost:{container.attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
        req = requests.get(f"http://{address}/freechains/chains/join/{SIMULATION_CHAIN}", json={"shared": pioneer["pub"]})
        print(req.json())
        print(f"[MESSAGE] Node {container.name} joined {SIMULATION_CHAIN.replace('%23', '#')}")

def user_selected(user: Dict[str, Any]) -> bool:
    threshold = 100
    selected = random.randrange(200)
    return  threshold + user["type"][1] >= selected or user["pioneer"]

def post_in_chain() -> None:
    global USERS, MESSAGES, SIMULATION_CHAIN
    for user in USERS:
        if user_selected(user):
            max_len = len(DOM_CASMURRO) - 200
            start = random.randrange(max_len)
            end = start + random.randrange(100, 200)
            message = {
                "text": DOM_CASMURRO[start:end].replace("\n", " "),
                "attachment": {
                    "type": "image",
                    "b64": get_new_pic()
                }
            }
            payload = {
                "payload": json.dumps(message),
                "sign": user["pvt"]
            }
            container = user["node"]
            address = f"localhost:{container.attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
            block = requests.get(f"http://{address}/freechains/chain/post/{SIMULATION_CHAIN}", json=payload).json()['data']
            MESSAGES[block] = {
                "type": random.choice([MessageType.UNRESPECTFULL, MessageType.NEUTRAL]) if user["type"][1] == UserType.TROLL else random.choice([MessageType.VIRAL, MessageType.NEUTRAL]),
                "message": payload
            }
            print(f"[MESSAGE] User {user['name']} on {container.name} send {block}")

def generate_why(message: Dict[str, Any]) -> None:
    if message["type"] == MessageType.NEUTRAL:
        return random.choice(["Muito bom!", "Isso aí", "Temos que ter mais conteúdos assim!"])
    elif message["type"] == MessageType.VIRAL:
        return random.choice(["LOL!", "kkkkkkkk Muito BOM!", "Isso vai viralizar!!! COntinue assim!"])
    elif message["type"] == MessageType.UNRESPECTFULL:
        return random.choice(["Lixo!", "Para de postar coisas sem sentido", "Esse não é o tema da chain!"])

def unblock_post() -> None:
    global USERS, MESSAGES, SIMULATION_CHAIN
    for user in USERS:
        address = f"localhost:{user['node'].attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
        user_reps = int(requests.get(f"http://{address}/freechains/chain/reps/{SIMULATION_CHAIN}/{user['pub']}").json()['data'])
        if user_reps > 0:
            blocked = requests.get(f"http://{address}/freechains/chain/heads/{SIMULATION_CHAIN}/blocked").json()['data'].split(" ")
            if len(blocked) > 0 and blocked[0] != "":
                blocked = [b for b in blocked if b in MESSAGES and MESSAGES[b]["type"] != MessageType.UNRESPECTFULL]
                num = min(user_reps, len(blocked))
                for i in range(num):
                    why = generate_why(MESSAGES[blocked[i]])
                    requests.get(f"http://{address}/freechains/chain/like/{SIMULATION_CHAIN}/{blocked[i]}", json={"why": why, "sign": user['pvt']})
                    print(f"[UNBLOCK] User {user['name']} on {user['node'].name} liked and unblocked {blocked[i]} because {why}")

def like_post() -> None:
    global USERS, MESSAGES, SIMULATION_CHAIN
    for user in USERS:
        if user_selected(user):
            address = f"localhost:{user['node'].attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
            user_reps = int(requests.get(f"http://{address}/freechains/chain/reps/{SIMULATION_CHAIN}/{user['pub']}").json()['data'])
            number_of_blocks = int(user_reps * 0.5)
            if number_of_blocks > 0:
                consensus = requests.get(f"http://{address}/freechains/chain/consensus/{SIMULATION_CHAIN}").json()['data'].split(" ")
                virals = [block for block in MESSAGES if MESSAGES[block]["type"] == MessageType.VIRAL and block in consensus]
                neutrals = [block for block in MESSAGES if MESSAGES[block]["type"] == MessageType.NEUTRAL and block in consensus]
                blocks = virals + neutrals
                num = min(number_of_blocks, len(blocks))
                for i in range(num):
                    why = generate_why(MESSAGES[blocks[i]])
                    requests.get(f"http://{address}/freechains/chain/like/{SIMULATION_CHAIN}/{blocks[i]}", json={"why": why, "sign": user['pvt']})
                    print(f"[LIKE] User {user['name']} on {user['node'].name} liked {blocks[i]} because {why}")

def dislike_post() -> None:
    global USERS, MESSAGES, SIMULATION_CHAIN
    for user in USERS:
        if user_selected(user):
            address = f"localhost:{user['node'].attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
            user_reps = int(requests.get(f"http://{address}/freechains/chain/reps/{SIMULATION_CHAIN}/{user['pub']}").json()['data'])
            number_of_unrespectfull = int(user_reps * 0.5)
            if number_of_unrespectfull > 0:
                consensus = requests.get(f"http://{address}/freechains/chain/consensus/{SIMULATION_CHAIN}").json()['data'].split(" ")
                unrespectfull = [block for block in MESSAGES if MESSAGES[block]["type"] == MessageType.UNRESPECTFULL and block in consensus]
                num = min(number_of_unrespectfull, len(unrespectfull))
                for i in range(num):
                    why = generate_why(MESSAGES[unrespectfull[i]])
                    requests.get(f"http://{address}/freechains/chain/dislike/{SIMULATION_CHAIN}/{unrespectfull[i]}", json={"why": why, "sign": user['pvt']})
                    print(f"[DISLIKE] User {user['name']} on {user['node'].name} disliked {unrespectfull[i]} because {why}")


def sync_all() -> None:
    global CLIENT, USERS, SIMULATION_CHAIN
    containers = [c for c in CLIENT.containers.list() if "Spotted-peer-" in c.name]
    for container in containers:
        address = f"localhost:{container.attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
        for rcontainer in containers:
            remote_address = f"{rcontainer.attrs['NetworkSettings']['IPAddress']}:8330"
            if container.id != rcontainer.id:
                response = requests.get(f"http://{address}/freechains/peer/recv/{remote_address}/{SIMULATION_CHAIN}").json()['data']
                print(f"[SYNC] Containers {container.name} recv from {rcontainer.name} ({response})")
                

def generate_pubpvt(passphrase: str) -> List[str]:
    global CLIENT
    container = CLIENT.containers.list()[-1]
    address = f"localhost:{container.attrs['NetworkSettings']['Ports']['5000/tcp'][0]['HostPort']}"
    response = requests.get(f"http://{address}/freechains/crypto/pubpvt", json={"passphrase": passphrase}).json()
    return response['data'].split(" ")


def setup_nodes_and_users(num_nodes: int, num_users: int) -> None:
    global CLIENT, USERS, USERS_TYPE
    print("[SETUP] Creating container")
    for node in range(num_nodes):
        container = CLIENT.containers.run("spotted-backend", detach=True, ports={'5000/tcp': 5001 + node}, name=f"Spotted-peer-{node}")
        print(f"[SETUP] Container {container.name} created and spotted-backend running on port {5001+node}")
        time.sleep(5)
    
    print("[SETUP] Creating users")
    containers = [c for c in CLIENT.containers.list() if "Spotted-peer-" in c.name]
    for user in range(num_users):
        pub, pvt = generate_pubpvt(f"string possword of user {user}")
        USERS.append({
            "name": f"User {user}",
            "pub": pub,
            "pvt": pvt,
            "type": (UserType.ACTIVE, 20) if user == 0 else random.choice(USERS_TYPE),
            "pioneer": True if user == 0 else False,
            "node": random.choice(containers)
        })
        print(f"[SETUP] {USERS[-1]}")

def close_all() -> None:
    global CLIENT
    print("[SETUP] Removing containers")
    for container in CLIENT.containers.list():
        if "Spotted-peer-" in container.name:
            container.remove(force=True)
            print(f"[SETUP] Container {container.name} stoped and removed")

def main(num_nodes: int, num_users: int, lifetime: int) -> None:
    setup_nodes_and_users(num_nodes, num_users)
    join_all_nodes_on_chain()

    total = 24 * 60 * 60 * 1000 * lifetime #simulation alive by day in millisecond
    lapse = 25 * 60 * 1000 # 25min in millisecond
    steps = total//lapse
    step = 0
    while step <= steps:
        post_in_chain()
        unblock_post()
        like_post()
        dislike_post()
        sync_all()
        step += random.randint(10, 20)
        add_time(lapse * step)
        print(f"[STEPS] {step}/{steps}")
    close_all()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Simulate spotted application')
    parser.add_argument("--nodes", dest="num_nodes", type=int, help="Número de nós de spotted serão levantados", required=True)
    parser.add_argument("--users", dest="num_users", type=int, help="Número de usuários de spotted serão simulados", required=True)
    parser.add_argument("--lifetime", dest="lifetime", type=int, help="Número de dias que serão simulados", required=True)
    args = parser.parse_args()

    CLIENT = docker.from_env()
    USERS = []
    MESSAGES = {}
    try: 
        main(args.num_nodes, args.num_users, args.lifetime)
    finally:
        close_all()
    