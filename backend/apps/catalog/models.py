"""
Модели каталога: Category, Product, Promotion.

Контракт с фронтом (поля API — НЕ менять без синхронизации):
  Category : id, title, slug, description, icon, count (аннотация, не поле БД)
  Product  : id, brand, title, slug, price, final_price, categorie (string!),
             image, popular, stock,
             promoInfo{promo, conditional, condition_type, condition_text,
                       min_quantity, required_product, required_quantity,
                       eyebrow, title, description, discount,
                       starts_at, ends_at}

ВАЖНО про цены (изменение семантики):
  price       — исходная (полная) цена, не меняется.
  final_price — цена с учётом БЕЗУСЛОВНОЙ акции. Условные акции
                (от количества / нужен другой товар) здесь НЕ учитываются:
                их нельзя посчитать, глядя на один товар — нужна корзина.
                Итоговые цены корзины считает apps.catalog.pricing
                и отдаёт POST /api/orders/preview/.
"""

from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from core.utils import calc_discounted_price

ICON_ALLOWED_EXTENSIONS = ["svg", "png", "jpg", "jpeg", "webp"]


class Category(models.Model):
    """Категория товаров."""

    title: str = models.CharField("Название", max_length=128)
    slug: str = models.SlugField(
        "Slug",
        max_length=128,
        unique=True,
        help_text="Заполняется автоматически из title, если не задан вручную.",
    )
    description: str = models.TextField("Описание", blank=True, default="")
    icon = models.FileField(
        "Иконка",
        upload_to="categories/icons/",
        blank=True,
        default="",
        validators=[FileExtensionValidator(allowed_extensions=ICON_ALLOWED_EXTENSIONS)],
        help_text="SVG, PNG, JPG или WEBP.",
    )

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ["title"]

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class Product(models.Model):
    """Товар в каталоге."""

    category: Category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="Категория",
    )
    brand: str = models.CharField("Бренд", max_length=128)
    title: str = models.CharField("Название", max_length=256)
    slug: str = models.SlugField(
        "Slug",
        max_length=256,
        unique=True,
        help_text="Заполняется автоматически из title, если не задан вручную.",
    )
    price: models.DecimalField = models.DecimalField(
        "Цена (KGS)",
        max_digits=10,
        decimal_places=2,
    )
    image: str = models.ImageField(
        "Изображение",
        upload_to="products/",
        blank=True,
        default="",
    )
    popular: bool = models.BooleanField("Популярный", default=False)
    stock: int = models.PositiveIntegerField("Остаток на складе", default=0)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ["-popular", "title"]

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.brand} — {self.title}"

    @property
    def current_price(self) -> Decimal:
        """
        Цена с учётом БЕЗУСЛОВНОЙ активной акции.

        Раньше здесь считались все акции — теперь только те, что не требуют
        условий. Причина: условная акция («от 10 шт», «нужен рюкзак») зависит
        от состава корзины, а этот property видит ровно один товар и про
        корзину ничего не знает. Считать её здесь было бы враньём.

        Условные акции применяет apps.catalog.pricing.price_cart() —
        он же используется при оформлении заказа, поэтому цена в корзине
        и цена в заказе гарантированно совпадают.
        """
        promo = getattr(self, "promotion", None)
        if promo is None or not promo.is_active or not promo.is_unconditional:
            return self.price

        return calc_discounted_price(self.price, promo.discount)


class Promotion(models.Model):
    """
    Промо-акция, привязанная к товару (одна акция на товар).

    Тип акции (condition_type) определяет, когда скидка срабатывает:
      always            — всегда в период дат (прежнее поведение)
      min_quantity      — если в корзине N+ штук этого товара
      requires_product  — если в корзине есть другой конкретный товар

    Скидка всегда применяется ко ВСЕМ единицам товара в позиции
    (согласовано с заказчиком: «от 10 шт −15%» при 12 шт даёт скидку
    на все 12, а не только на 2 сверх порога).
    """

    class ConditionType(models.TextChoices):
        ALWAYS = "always", "Обычная (только по датам)"
        MIN_QUANTITY = "min_quantity", "От количества товара"
        REQUIRES_PRODUCT = "requires_product", "При покупке другого товара"

    product: Product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="promotion",
        verbose_name="Товар",
    )

    # --- Отображение ---
    eyebrow: str = models.CharField(
        "Надпись над заголовком (eyebrow)",
        max_length=128,
        blank=True,
        default="",
        help_text='Например: "Акция · Канцелярия"',
    )
    title: str = models.CharField("Заголовок акции", max_length=256)
    description: str = models.TextField("Описание акции", blank=True, default="")

    # --- Выгода ---
    discount: int = models.PositiveSmallIntegerField(
        "Скидка (%)",
        default=0,
        validators=[MaxValueValidator(100)],
        help_text="Целое число от 1 до 100.",
    )

    # --- Условие ---
    condition_type: str = models.CharField(
        "Тип акции",
        max_length=32,
        choices=ConditionType.choices,
        default=ConditionType.ALWAYS,
        db_index=True,
        help_text="От типа зависит, какие поля ниже нужно заполнить.",
    )
    min_quantity: int = models.PositiveIntegerField(
        "Минимальное количество",
        null=True,
        blank=True,
        help_text='Только для типа "От количества товара". Например: 10.',
    )
    required_product: "Product" = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="required_by_promotions",
        verbose_name="Требуемый товар",
        help_text='Только для типа "При покупке другого товара".',
    )
    required_quantity: int = models.PositiveIntegerField(
        "Количество требуемого товара",
        default=1,
        help_text='Сколько штук требуемого товара должно быть в корзине.',
    )

    # --- Период ---
    starts_at: models.DateTimeField = models.DateTimeField("Начало акции")
    ends_at: models.DateTimeField = models.DateTimeField("Конец акции")

    class Meta:
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    # ------------------------------------------------------------------
    # Свойства
    # ------------------------------------------------------------------

    @property
    def is_active(self) -> bool:
        """Акция в своём периоде дат. Про условия ничего не говорит."""
        now = timezone.now()
        return self.starts_at <= now <= self.ends_at

    @property
    def is_unconditional(self) -> bool:
        """Скидку можно применить, не зная состава корзины."""
        return self.condition_type == self.ConditionType.ALWAYS

    @property
    def condition_text(self) -> str:
        """
        Человекочитаемое условие для витрины («от 10 шт — скидка 15%»).
        Генерируется на бэкенде, чтобы фронт не собирал такие строки сам
        и формулировки не разъезжались между каталогом и корзиной.
        """
        if self.condition_type == self.ConditionType.MIN_QUANTITY:
            return f"От {self.min_quantity} шт — скидка {self.discount}%"

        if self.condition_type == self.ConditionType.REQUIRES_PRODUCT:
            if not self.required_product_id:
                return ""
            name = self.required_product.title
            if (self.required_quantity or 1) > 1:
                return (
                    f"Скидка {self.discount}% при покупке "
                    f"{self.required_quantity} шт «{name}»"
                )
            return f"Скидка {self.discount}% при покупке «{name}»"

        return ""

    # ------------------------------------------------------------------
    # Логика условия
    # ------------------------------------------------------------------

    def is_satisfied(self, quantity: int, cart_quantities: dict[int, int]) -> bool:
        """
        Выполнено ли условие акции.

        quantity        — сколько штук ЭТОГО товара в корзине
        cart_quantities — вся корзина: {product_id: quantity}

        Живёт на модели (а не в pricing.py), чтобы правило условия было
        в одном месте рядом с полями, которые оно проверяет.
        """
        if not self.is_active:
            return False

        if self.condition_type == self.ConditionType.ALWAYS:
            return True

        if self.condition_type == self.ConditionType.MIN_QUANTITY:
            return quantity >= (self.min_quantity or 0)

        if self.condition_type == self.ConditionType.REQUIRES_PRODUCT:
            if not self.required_product_id:
                return False
            in_cart = cart_quantities.get(self.required_product_id, 0)
            return in_cart >= (self.required_quantity or 1)

        return False

    # ------------------------------------------------------------------
    # Валидация
    # ------------------------------------------------------------------

    def clean(self) -> None:
        """
        Проверяет, что для выбранного типа заполнены нужные поля.
        Вызывается формой админки автоматически.
        """
        errors: dict[str, str] = {}

        if self.ends_at and self.starts_at and self.ends_at <= self.starts_at:
            errors["ends_at"] = "Конец акции должен быть позже начала."

        if not self.discount:
            errors["discount"] = "Скидка должна быть больше 0%."

        if self.condition_type == self.ConditionType.MIN_QUANTITY:
            if not self.min_quantity:
                errors["min_quantity"] = (
                    "Укажите минимальное количество для этого типа акции."
                )
            elif self.min_quantity < 2:
                errors["min_quantity"] = (
                    "Минимальное количество должно быть от 2. "
                    "Если скидка нужна с первой штуки — выберите тип «Обычная»."
                )

        if self.condition_type == self.ConditionType.REQUIRES_PRODUCT:
            if not self.required_product_id:
                errors["required_product"] = (
                    "Укажите товар, при покупке которого действует скидка."
                )
            elif self.product_id and self.required_product_id == self.product_id:
                errors["required_product"] = (
                    "Требуемый товар не может совпадать с товаром акции."
                )
            if not self.required_quantity or self.required_quantity < 1:
                errors["required_quantity"] = "Количество должно быть от 1."

        if errors:
            raise ValidationError(errors)

    def __str__(self) -> str:
        return f"Акция для {self.product}"