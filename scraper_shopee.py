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
    "Roupas": [
        "blazer feminino", "cropped feminino", "body feminino",
        "pijama feminino", "macacao feminino",
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
        "conjunto feminino",
    ],
    "Calcas": [
        "calca jeans feminina", "calca pantalona feminina",
        "calca cargo feminina",
    ],
    "Fitness": [
        "calca legging feminina", "macaquinho fitness",
        "top fitness feminino", "short legging feminino",
    ],
    "Saias": [
        "saia feminina", "saia midi feminina", "saia longa feminina",
        "saia jeans feminina", "saia plissada feminina",
    ],
    "Shorts": [
        "short jeans feminino", "short alfaiataria feminino",
        "bermuda feminina", "short feminino",
    ],
}

# Palavras para re-categorizar produtos pelo nome
RECATEGORIZAR_POR_NOME = {
    "conjunto": "Conjuntos",
    "vestido": "Vestidos",
    "calça": "Calcas",
    "calca": "Calcas",
    "saia": "Saias",
    "macaquinho": "Fitness",
    "legging": "Fitness",
    "top": "Fitness",
    "sandalia": "Calcados",
    "sandália": "Calcados",
    "sapatilha": "Calcados",
    "rasteira": "Calcados",
    "salto": "Calcados",
    "bolsa": "Bolsas",
    "mochila": "Bolsas",
    "short": "Shorts",
    "bermuda": "Shorts",
    "blazer": "Roupas",
    "cropped": "Roupas",
    "body": "Roupas",
    "macacao": "Roupas",
    "pijama": "Roupas",
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
    # Itens não relacionados a moda
    "desentupidor", "sanitario",

    # Blacklist ultra rigorosa
    "masculino", "masculina", "masculinos", "masculinas",
    "homem", "homens", "for men", "men's", "male", "boy", "boys",
    "para homem", "para homens", "dos homens", "do homem",
    "macho", "cavalheiro", "senhor",
    "infantil", "crianca", "criança",
    "kids", "children", "child", "menino", "garoto", "garota",
    "bebe", "bebê", "baby", "recem nascido", "recém-nascido",
    "criancas", "crianças", "unissex", "unisex", "uni sex", "uni-sex",
    "cueca", "cuecas", "samba canção", "samba-canção", "gravata",
    "suspensorio", "suspensório", "terno", "blazer masculino",
    "calca social masculina", "camisa polo masculina",
    "regata masculina", "sapato social masculino", "tenis masculino",
    "chinelo masculino", "bota masculina", "sandalia masculina",
    "carteira masculina", "cinto masculino", "relogio masculino",
    "oculos masculino", "óculos masculino", "bone masculino", "boné masculino",
    "mochila masculina", "bolsa masculina",
    "revenda", "atacado", "kit com", "pacote com", "lote com",
    "ouro macico", "ouro 18k", "ouro puro", "ouro 24k",
    "adulto", "jovem", "teen", "teenager",
    "cachorro", "pet", "gato", "bazar", "brecho",
    "defeitos", "pequenos defeitos", "molde",
    "broche", "acessorios", "acessórios", "adesivos",
    "pingente", "bricolage", "botão", "botões", "encanto",
    "jóias", "joias", "colar", "anel", "brincos", "pulseira",
    "elástico de cabelo",
    "fita invisível", "fita dupla face",
    "descartável",
]

TERMOS_INTERNACIONAIS = [
    "import", "importado", "importação", "importacao",
    "china", "overseas", "cross-border", "internacional",
    "from china", "direct from", "global shipping",
    "worldwide", "cross border",
]

TERMOS_FEMININOS = [
    "feminino", "feminina", "menina", "mulher", "mulheres",
    "lady", "ladies", "woman", "women", "women's",
    "para mulher", "para mulheres", "das mulheres", "da mulher",
    "vestido", "saia", "blusa", "cropped",
    "body", "top", "camisa feminina", "camiseta feminina",
    "regata feminina", "legging", "calcinha", "sutia", "sutiã", "lingerie",
    "pijama", "sandalia", "sandália", "salto", "scarpin", "sapatilha",
    "rasteira", "bota feminina", "bolsa feminina",
    "clutch", "necessaire", "carteira feminina",
    "tiara", "faixa cabelo", "presilha",
]

TERMOS_AMBIGUOS = [
    "unissex", "unisex", "adulto", "esportivo", "casual",
    "tenis", "tênis", "bone", "boné", "oculos", "óculos",
    "relogio", "relógio",
]


def filtrar_produto(item):
    rating = float(item.get("ratingStar", 0))
    sales = int(item.get("sales", 0))
    nome = (item.get("productName", "") or "").lower()

    # Rating mínimo 4.7
    if rating < 4.7:
        return False

    # Mínimo de vendas
    if sales <= 40:
        return False

    # Blacklist: se conter qualquer termo proibido, rejeita
    for palavra in EXCLUIR_PALAVRAS:
        if palavra in nome:
            return False

    # Whitelist: se conter termo feminino, aprova
    for palavra in TERMOS_FEMININOS:
        if palavra in nome:
            return True

    # Termos ambíguos: sozinho não garante nada, deixa passar
    for palavra in TERMOS_AMBIGUOS:
        if palavra in nome:
            return True

    # Se não tem termo feminino nem ambíguo, rejeita
    return False


def mapear_produto(item, categoria):
    item_id = str(item.get("itemId", ""))
    shop_id = str(item.get("shopId", ""))
    preco_str = item.get("priceMin", "0")
    preco_atual = float(preco_str) if preco_str and float(preco_str) > 0 else 0

    if preco_atual <= 0:
        return None

    desconto_rate = float(item.get("priceDiscountRate", 0))
    preco_max = item.get("priceMax")

    nome = (item.get("productName", "") or "").lower()
    shop_name = (item.get("shopName", "") or "").lower()
    is_international = any(p in nome or p in shop_name for p in TERMOS_INTERNACIONAIS)
    flag = "🌎 " if is_international else ""

    # Re-categorizar pelo nome do produto (sobrescreve categoria da keyword)
    for palavra, cat in RECATEGORIZAR_POR_NOME.items():
        if palavra in nome:
            categoria = cat
            break

    if desconto_rate > 0:
        preco_original = float(preco_max) if preco_max else None
        tag = f"{flag}-{int(desconto_rate)}%"
    else:
        preco_original = None
        tag = f"{flag}Novo"

    url = item.get("offerLink") or item.get("productLink", "")
    if not url and item_id and shop_id:
        url = f"https://shopee.com.br/product/{shop_id}/{item_id}"

    nome = (item.get("productName", "") or "").lower()
    shop_name = (item.get("shopName", "") or "").lower()
    is_international = any(p in nome or p in shop_name for p in TERMOS_INTERNACIONAIS)

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
        "reviews_count": 0,
        "sales": int(item.get("sales", 0)),
        "affiliate_url": url,
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
    atualizados = 0

    resp = supabase.table("produtos").select("id,name,category,tag,rating,reviews_count,sales").execute()
    produtos = resp.data or []

    for p in produtos:
        nome = (p.get("name", "") or "").lower()
        tag_atual = p.get("tag", "") or ""
        cat_atual = p.get("category", "") or ""

        # Re-categorizar pelo nome do produto
        nova_cat = None
        for palavra, cat in RECATEGORIZAR_POR_NOME.items():
            if palavra in nome:
                nova_cat = cat
                break
        if nova_cat and nova_cat != cat_atual:
            supabase.table("produtos").update({"category": nova_cat}).eq("id", p["id"]).execute()
            atualizados += 1

        # Atualizar tag com flag internacional se necessário
        if any(term in nome for term in TERMOS_INTERNACIONAIS):
            if not tag_atual.startswith("🌎 "):
                nova_tag = f"🌎 {tag_atual}"
                supabase.table("produtos").update({"tag": nova_tag}).eq("id", p["id"]).execute()
                atualizados += 1

        # Remover produtos que não passam nos filtros
        item_fake = {
            "ratingStar": float(p.get("rating", 0)),
            "sales": int(p.get("sales", 0) or p.get("reviews_count", 0)),
            "productName": p.get("name", ""),
        }
        if not filtrar_produto(item_fake):
            supabase.table("produtos").delete().eq("id", p["id"]).execute()
            total_removidos += 1

    if total_removidos:
        print(f"Produtos removidos (nao atendem filtros): {total_removidos}")
    else:
        print("Nenhum produto antigo precisa ser removido.")
    if atualizados:
        print(f"Produtos atualizados (tag/categoria): {atualizados}")

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
            amostra_exibida = False
            for item in nodes:
                item_id = str(item.get("itemId", ""))
                if item_id in ids_vistos:
                    continue
                if not filtrar_produto(item):
                    filtrados += 1
                    continue

                produto = mapear_produto(item, categoria)
                if produto:
                    if not amostra_exibida:
                        print(f"  AMOSTRA: itemId={item_id} | external_id={produto.get('external_id')} | affiliate_url={produto.get('affiliate_url')}")
                        amostra_exibida = True
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
