"""
Модели каталога: Category, Product, Promotion.

Контракт с фронтом (поля API — НЕ менять без синхронизации):
  Category : id, title, slug, description, icon, count (аннотация, не поле БД)
  Product  : id, brand, title, slug, price, final_price, categorie (string!),
             image, popular, stock,
             promoInfo{promo, eyebrow, title, description, discount,
                       starts_at, ends_at}
  final_price — НОВОЕ поле: итоговая цена с учётом активной акции.
  price — исходная (полная) цена, не меняется.
  promoInfo.promo вычисляется по датам Promotion, не хранится как флаг.
"""

from decimal import ROUND_HALF_UP, Decimal

from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

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
        Итоговая цена с учётом активной акции (если есть).

        ЕДИНАЯ точка расчёта скидки — используется и в API (сериализатор,
        поле final_price), и при оформлении заказа (services.create_order).
        Так гарантируется что цена, которую видит покупатель на сайте,
        совпадает с ценой, которая реально спишется при заказе.

        Если акции нет или она не активна — возвращает обычную price.
        Округление до 2 знаков — ROUND_HALF_UP (стандартное округление
        для денежных сумм, не банковское округление к чётному).
        """
        try:
            promo: "Promotion" = self.promotion
        except Promotion.DoesNotExist:
            return self.price

        if not promo.is_active:
            return self.price

        multiplier = (Decimal("100") - Decimal(promo.discount)) / Decimal("100")
        discounted = self.price * multiplier
        return discounted.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class Promotion(models.Model):
    """
    Промо-акция, привязанная к товару.

    promo в API вычисляется динамически: starts_at <= now() <= ends_at.
    Расчёт итоговой цены — в Product.current_price, не здесь, чтобы
    была одна точка правды для цены и в API, и в заказах.
    """

    product: Product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="promotion",
        verbose_name="Товар",
    )
    eyebrow: str = models.CharField(
        "Надпись над заголовком (eyebrow)",
        max_length=128,
        blank=True,
        default="",
        help_text='Например: "Акция · Канцелярия"',
    )
    title: str = models.CharField("Заголовок акции", max_length=256)
    description: str = models.TextField("Описание акции", blank=True, default="")
    discount: int = models.PositiveSmallIntegerField(
        "Скидка (%)",
        default=0,
        help_text="Целое число от 0 до 100.",
    )
    starts_at: models.DateTimeField = models.DateTimeField("Начало акции")
    ends_at: models.DateTimeField = models.DateTimeField("Конец акции")

    class Meta:
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    @property
    def is_active(self) -> bool:
        now = timezone.now()
        return self.starts_at <= now <= self.ends_at

    def __str__(self) -> str:
        return f"Акция для {self.product}"
