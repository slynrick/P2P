import hashlib

filename = 'arquivo.ext'
sha512 = hashlib.sha512()
with open(filename, 'rb') as file:
    while True:
        data = file.read(1024)
        if not data:
            break
        sha512.update(data)
print(f"SHA512: {sha512.hexdigest()}")