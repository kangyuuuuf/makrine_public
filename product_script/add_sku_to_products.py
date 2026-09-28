#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def add_sku_to_products(obj):
    if isinstance(obj, dict):
        products = obj.get("products")
        if isinstance(products, list):
            for product in products:
                if isinstance(product, dict):
                    product.setdefault("sku", "TODO")
                    add_sku_to_products(product)

        for value in obj.values():
            add_sku_to_products(value)

    elif isinstance(obj, list):
        for item in obj:
            add_sku_to_products(item)


def main():
    if len(sys.argv) < 2:
        print("Usage: python add_sku_to_products.py <input.json> [output.json]")
        sys.exit(1)

    src_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2]) if len(sys.argv) >= 3 else src_path

    with src_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    add_sku_to_products(data)

    with out_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Done. Added sku=\"TODO\" to all product objects in {src_path} -> {out_path}")


if __name__ == "__main__":
    main()
