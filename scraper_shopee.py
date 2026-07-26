import hashlib
import json
import os
import random
import time
from datetime import datetime, timezone

import requests
from supabase import create_client

SHOPEE_APP_ID = os.getenv("SHOPEE_APP_ID")
SHOPEE_API_KEY = os.getenv("SHOPEE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

API_URL = "https://open-api.affiliate.shopee.com.br/graphql"

KEYWORDS_POR_CATEGORIA = {
    "Vestidos": [
        "vestido midi feminino", "vestido longo elegante", "vestido curto casual",
        "vestido floral verao", "vestido tubinho preto", "vestido feminino",
        "vestido festa feminino", "vestido casual dia a dia", "vestido jeans feminino",
    ],
    "Calcados": [
        "sandalia feminina", "rasteirinha feminina", "sapatilha feminina",
        "tamanco feminino", "sandalia salto feminino",
    ],
    "Bolsas": [
        "bolsa transversal feminina", "bolsa tiracolo feminina",
        "mochila feminina", "bolsa feminina",
    ],
    "Conjuntos": [
        "conjunto feminino", "cropped feminino", "body feminino",
    ],
    "Calcas": [
        "calca jeans feminina", "calca pantalona feminina",
        "calca cargo feminina", "short jeans feminino",
        "short alfaiataria feminino",
    ],
    "Fitness": [
        "calca legging feminina", "macaquinho fitness",
        "top fitness feminino", "short legging feminino",
    ],
}

MAX_QUERIES = 8
LIMIT = 50
SORT_TYPES = [1, 2, 4]


def autenticar(app_id, timestamp, payload, secret):
    string = f"{app_id}{timestamp}{payload}{secret}"
    return hashlib.sha256(string.encode()).hexdigest()


def montar_query(keyword, limit=50, sort_type=1, page=1):
    keyword_escaped = keyword.replace("\\", "\\\\").replace('"', '\\"')
    return f'''{{
    productOfferV2(
        keyword: "{keyword_escaped}",
        limit: {limit},
        sortType: {sort_type},
        page: {page}
    ) {{
        nodes {{
            itemId
            productName
            shopId
            shopName
            priceMin
            priceMax
            priceDiscountRate
            commissionRate
            sales
            ratingStar
            imageUrl
            productLink
            offerLink
        }}
    }}
}}'''


def buscar_produtos(keyword, sort_type, page):
    query = montar_query(keyword, LIMIT, sort_type, page)
    payload = json.dumps({"query": query}, separators=(",", ":"))
    timestamp = int(time.time())
    signature = autenticar(SHOPEE_APP_ID, timestamp, payload, SHOPEE_API_KEY)

    headers = {
        "Authorization": f"SHA256 Credential={SHOPEE_APP_ID}, Timestamp={timestamp}, Signature={signature}",
        "Content-Type": "application/json",
    }

    resp = requests.post(API_URL, headers=headers, data=payload, timeout=30)
    return resp.json()


EXCLUIR_PALAVRAS = [
    "masculino", "infantil", "criança", "crianca", "pet", "cachorro",
    "bebê", "bebe", "menino", "menina", "baby", "kids", "unisex",
    "brinquedo", "acessório pet", "ração", "berçário",
]


def filtrar_produto(item):
    rating = float(item.get("ratingStar", 0))
    sales = int(item.get("sales", 0))
    nome = (item.get("productName", "") or "").lower()

    if rating < 4.7:
        return False

    if rating >= 5.0 and sales <= 40:
        return False

    for palavra in EXCLUIR_PALAVRAS:
        if palavra in nome:
            return False

    return True


def mapear_produto(item, categoria):
    item_id = str(item.get("itemId", ""))
    preco_str = item.get("priceMin", "0")
    preco_atual = float(preco_str) if preco_str and float(preco_str) > 0 else 0

    if preco_atual <= 0:
        return None

    desconto_rate = float(item.get("priceDiscountRate", 0))

    if desconto_rate > 0:
        preco_original = round(preco_atual / (1 - desconto_rate / 100), 2)
        tag = f"-{int(desconto_rate)}%"
    else:
        preco_original = None
        tag = "Novo"

    return {
        "source": "shopee",
        "external_id": item_id,
        "name": item.get("productName", ""),
        "category": categoria,
        "price_current": preco_atual,
        "price_original": preco_original,
        "image": item.get("imageUrl", ""),
        "description": f"{item.get('productName', '')} - Encontre na Shopee",
        "rating": float(item.get("ratingStar", 0)),
        "reviews_count": int(item.get("sales", 0)),
        "affiliate_url": item.get("offerLink") or item.get("productLink", ""),
        "tag": tag,
        "spotlight": False,
        "last_checked_at": datetime.now(timezone.utc).isoformat(),
    }


def salvar_supabase(produtos):
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    inseridos = 0

    for p in produtos:
        data, count = supabase.table("produtos").upsert(p, on_conflict="source,external_id").execute()
        inseridos += 1

    return inseridos


def limpar_produtos_antigos():
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    total_removidos = 0

    resp = supabase.table("produtos").select("id,name,rating,reviews_count").execute()
    produtos = resp.data or []

    for p in produtos:
        rating = float(p.get("rating", 0))
        sales = int(p.get("reviews_count", 0))
        nome = (p.get("name", "") or "").lower()
        motivo = None

        if rating < 4.7:
            motivo = f"rating {rating} < 4.7"
        elif rating >= 5.0 and sales <= 40:
            motivo = f"rating 5.0 com apenas {sales} vendas"
        else:
            for palavra in EXCLUIR_PALAVRAS:
                if palavra in nome:
                    motivo = f"contem '{palavra}'"
                    break

        if motivo:
            supabase.table("produtos").delete().eq("id", p["id"]).execute()
            total_removidos += 1

    if total_removidos:
        print(f"Produtos removidos (nao atendem filtros): {total_removidos}")
    else:
        print("Nenhum produto antigo precisa ser removido.")

    return total_removidos


def gerar_combinacoes():
    combinacoes = []
    for categoria, keywords in KEYWORDS_POR_CATEGORIA.items():
        for kw in keywords:
            for sort_type in SORT_TYPES:
                combinacoes.append((kw, categoria, sort_type))
    random.shuffle(combinacoes)
    return combinacoes[:MAX_QUERIES]


def rodar():
    if not all([SHOPEE_APP_ID, SHOPEE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY]):
        print("ERRO: Variaveis de ambiente nao encontradas!")
        print("Execute no PowerShell e feche/abra o terminal:")
        print('  [System.Environment]::SetEnvironmentVariable("SHOPEE_APP_ID", "18305090601", "User")')
        print('  [System.Environment]::SetEnvironmentVariable("SHOPEE_API_KEY", "LDDV63HQRMR3SJ2BW7FMBMGASTZWHW6O", "User")')
        print('  [System.Environment]::SetEnvironmentVariable("SUPABASE_URL", "https://edzagtvukayclklhvokk.supabase.co", "User")')
        print('  [System.Environment]::SetEnvironmentVariable("SUPABASE_SERVICE_KEY", "sua_service_role_key", "User")')
        return

    print(f"Shopee Moda Feminina — Scraper via API")
    print(f"Max queries: {MAX_QUERIES}\n")

    print("Limpando produtos antigos que nao atendem os filtros...")
    limpar_produtos_antigos()
    print()

    combinacoes = gerar_combinacoes()
    todos_produtos = []
    ids_vistos = set()
    erros = 0

    for idx, (keyword, categoria, sort_type) in enumerate(combinacoes, 1):
        tipo_sort = {1: "Relevância", 2: "Mais Vendidos", 4: "Menor Preço"}.get(sort_type, str(sort_type))
        print(f"[{idx}/{len(combinacoes)}] '{keyword}' | {categoria} | {tipo_sort}")

        try:
            data = buscar_produtos(keyword, sort_type, 1)

            if "errors" in data:
                print(f"  ERRO API: {data['errors']}")
                erros += 1
                continue

            nodes = data.get("data", {}).get("productOfferV2", {}).get("nodes", [])
            filtrados = 0
            for item in nodes:
                item_id = str(item.get("itemId", ""))
                if item_id in ids_vistos:
                    continue
                if not filtrar_produto(item):
                    filtrados += 1
                    continue

                produto = mapear_produto(item, categoria)
                if produto:
                    ids_vistos.add(item_id)
                    todos_produtos.append(produto)

            print(f"  -> {len(nodes)} produtos ({filtrados} filtrados, {len(nodes) - filtrados} aprovados)")

        except Exception as e:
            print(f"  ERRO: {e}")
            erros += 1

        time.sleep(random.uniform(1, 2))

    print(f"\nProdutos unicos: {len(todos_produtos)}")

    if todos_produtos:
        for p in todos_produtos[:5]:
            p["spotlight"] = True

        print("Salvando no Supabase...")
        total = salvar_supabase(todos_produtos)
        print(f"Produtos salvos no Supabase: {total}")
    else:
        print("Nenhum produto encontrado.")


if __name__ == "__main__":
    rodar()
