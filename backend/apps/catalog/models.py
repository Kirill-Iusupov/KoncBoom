# Модели Category, Product, Promotion будут добавлены в PR#2
# (feature/backend-catalog), согласно контракту с фронтом:
# Category: id, title, slug, description, icon, count (аннотация)
# Product: id, brand, title, slug, price, categorie, image, popular,
#          stock, promoInfo{...}
from django.db import models  # noqa: F401
