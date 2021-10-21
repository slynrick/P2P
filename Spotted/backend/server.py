# coding: utf-8
import argparse
import socket
from typing import Dict, List, Optional, Tuple, Union
from flask import Flask, request, jsonify

parser = argparse.ArgumentParser(description='Freechains API server')
parser.add_argument("--host", dest="host", type=str, help="Hostname of freechains", default='localhost')
parser.add_argument("--port", dest="port", type=int, help="Port of freechains", default=8330)
args = parser.parse_args()

ADDR, PORT = args.host, args.port

def send_to_socket(cmd: str, payload: Optional[str], read_more=False) -> Tuple[bool, str]:
    global ADDR, PORT
    print(f"Connecting to {ADDR}:{PORT}...", end='')
    try:
        sckt = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sckt.connect((ADDR, PORT))
    except RuntimeError as e:
        print(f"Refused")
        return False, e
    print(f"Stablished")

    cmd += "\n"        
    sckt.send(cmd.encode('utf-8'))
    if payload:
        payload += "\n"
        sckt.send(payload.encode('utf-8'))
    response = ""
    while True:
        char = sckt.recv(1)
        if char == b'\n':
            break
        else:
            response += char.decode('utf-8')
    if len(response) > 0 and response[0] != '!' and read_more:
        response = sckt.recv(int(response)).decode('utf-8')
    return True, response



API = Flask(__name__)
MAJOR    = 0
MINOR    = 8
REVISION = 6
VERSION  = f"v{MAJOR}.{MINOR}.{REVISION}"
PRE      = f"FC {VERSION}"
"""
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
"""
def send_freechain_cmd(cmd: str, payload: Optional[str] = None, read_more=False) -> Dict[str, Union[Optional[str], bool]]:
    result = {}
    ok, response = send_to_socket(cmd, payload, read_more)
    print(ok, "res: ", response)
    result['status'] = ok
    result['message'] = "result returned" if ok else response
    result['data'] = response if ok else None
    return result

"""
CHAINS
"""
@API.route('/freechains/chains/join/<string:chain>')
def chains_join(chain : str):
    content = request.get_json(silent=True)
    shared = "" if 'shared' not in content else content['shared']
    global PRE
    result = send_freechain_cmd(f"{PRE} chains join {chain} {shared}", payload=None)
    return jsonify(result)

@API.route('/freechains/chains/leave/<string:chain>')
def chains_leave(chain : str):
    global PRE
    result = send_freechain_cmd(f"{PRE} chains leave {chain}", payload=None)
    return jsonify(result)

@API.route('/freechains/chains/list/')
def chains_list():
    global PRE
    result = send_freechain_cmd(f"{PRE} chains list", payload=None)
    return jsonify(result)
"""
CHAIN
"""
@API.route('/freechains/chain/genesis/<string:chain>')
def chain_genesis(chain : str):
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} genesis", payload=None)
    return jsonify(result)

@API.route('/freechains/chain/heads/<string:chain>', defaults={'mod': ""})
@API.route('/freechains/chain/heads/<string:chain>/<string:mod>')
def chain_heads(chain : str, mod: str = ""):
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} heads {mod}", payload=None)
    return jsonify(result)

@API.route('/freechains/chain/get/<string:chain>/<string:hash>', defaults={'mod': ""})
@API.route('/freechains/chain/get/<string:chain>/<string:hash>/<string:mod>')
def chain_get(chain : str, hash: str, mod: str = ""):
    content = request.get_json(silent=True)
    decript = "" if 'decript' not in content else content['decript']
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} get {mod} {hash} {decript}", payload=None, read_more=True)
    return jsonify(result)

@API.route('/freechains/chain/post/<string:chain>')
def chain_post(chain : str):
    content = request.get_json(silent=True)
    encrypt = "" if 'encrypt' not in content else content['encrypt']
    sign = "anon" if 'sign' not in content else content['sign']
    payload = "" if 'payload' not in content else content['payload']
    payload_len = len(payload)
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} post {sign} {encrypt} {payload_len}", payload=payload)
    return jsonify(result)

@API.route('/freechains/chain/like/<string:chain>/<string:hash>')
def chain_like(chain : str, hash: str):
    content = request.get_json(silent=True)
    sign = "" if 'sign' not in content else content['sign']
    payload = "" if 'why' not in content else content['why']
    payload_len = len(payload)
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} like 1 {hash} {sign} {payload_len}", payload=payload)
    return jsonify(result)

@API.route('/freechains/chain/dislike/<string:chain>/<string:hash>')
def chain_dislike(chain : str, hash: str):
    content = request.get_json(silent=True)
    sign = "" if 'sign' not in content else content['sign']
    payload = "" if 'why' not in content else content['why']
    payload_len = len(payload)
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} like -1 {hash} {sign} {payload_len}", payload=payload)
    return jsonify(result)

@API.route('/freechains/chain/reps/<string:chain>/<string:hash_or_pub>')
def chain_reps(chain : str, hash_or_pub: str):
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} reps {hash_or_pub}", payload=None)
    return jsonify(result)

@API.route('/freechains/chain/remove/<string:chain>/<string:hash>')
def chain_remove(chain : str, hash: str):
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} remove  {hash}", payload=None)
    return jsonify(result)

@API.route('/freechains/chain/traverse/<string:chain>')
def chain_traverse(chain: str):
    content = request.get_json(silent=True)
    hashes = [] if 'hashes' not in content else content['hashes']
    global PRE
    result = send_freechain_cmd(f"{PRE} chain {chain} traverse {' '.join(hashes)}", payload=None)
    return jsonify(result)
"""
PEER
"""
@API.route('/freechains/peer/<string:remote>/ping')
def peer_ping(remote : str):
    global PRE
    result = send_freechain_cmd(f"{PRE} peer {remote} ping", payload=None)
    return jsonify(result)

@API.route('/freechains/peer/<string:remote>/chains')
def peer_chains(remote : str):
    global PRE
    result = send_freechain_cmd(f"{PRE} peer {remote} chains", payload=None)
    return jsonify(result)

@API.route('/freechains/peer/send/<string:remote>/<string:chain>')
def peer_send(remote : str, chain: str):
    global PRE
    result = send_freechain_cmd(f"{PRE} peer {remote} send {chain}", payload=None)
    return jsonify(result)

@API.route('/freechains/peer/recv/<string:remote>/<string:chain>')
def peer_recv(remote : str, chain: str):
    global PRE
    result = send_freechain_cmd(f"{PRE} peer {remote} recv {chain}", payload=None)
    return jsonify(result)
"""
CRYPTO
"""
@API.route('/freechains/crypto')
def crypto():
    content = request.get_json(silent=True)
    mod = "" if 'mod' not in content else content['mod']
    passphrase = "" if 'passphrase' not in content else content['passphrase']
    if "\n" in passphrase:
        return "passfrase with new line"
    global PRE
    result = send_freechain_cmd(f"{PRE} crypto {mod}", payload=passphrase)
    return jsonify(result)
"""
HOST
"""
@API.route('/freechains/host/now/<string:time>')
def host_now(time : str):
    global PRE
    result = send_freechain_cmd(f"{PRE} host now {time}", payload=None)
    return jsonify(result)

print(f"API Server Up!")
API.run(host='0.0.0.0')