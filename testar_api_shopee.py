import os
import requests

SHOPEE_APP_ID = os.getenv("SHOPEE_APP_ID")
SHOPEE_API_KEY = os.getenv("SHOPEE_API_KEY")

if not SHOPEE_APP_ID or not SHOPEE_API_KEY:
    print("ERRO: Variaveis de ambiente nao encontradas!")
    print("Feche e abra um novo terminal PowerShell.")
    print("Depois rode: python testar_api_shopee.py")
    exit(1)

print(f"App ID: {SHOPEE_APP_ID}")
print(f"API Key: {SHOPEE_API_KEY[:4]}...{SHOPEE_API_KEY[-4:]}")
print("Variaveis de ambiente funcionando!\n")

url = "https://partner.shopeemobile.com/api/v2/shop/get"
params = {"partner_id": int(SHOPEE_APP_ID)}
headers = {"Authorization": SHOPEE_API_KEY}

response = requests.get(url, params=params, headers=headers)
print(f"Status: {response.status_code}")
print(f"Resposta: {response.text[:500]}")
