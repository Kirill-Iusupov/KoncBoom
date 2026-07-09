# Модели Order (гость) и OrderItem будут добавлены в PR#3
# (feature/backend-orders). Ключевые требования:
# - Order.idempotency_key (unique) — защита от двойного сабмита
# - OrderItem.unit_price фиксируется на момент покупки (не FK на текущую цену)
# - Списание stock — строго через F('stock') - qty внутри transaction.atomic()
#   + select_for_update(), с CHECK constraint stock >= 0 на уровне БД.
from django.db import models  # noqa: F401
