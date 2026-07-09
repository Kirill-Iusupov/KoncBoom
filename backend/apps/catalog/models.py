"""
Модели каталога: Category, Product, Promotion.

Контракт с фронтом (поля API — НЕ менять без синхронизации):
  Category : id, title, slug, description, icon, count (аннотация, не поле БД)
  Product  : id, brand, title, slug, price, categorie (string!), image,
             popular, stock, promoInfo{promo, eyebrow, title, description,
             discount, url}
  promoInfo.promo вычисляется по датам Promotion, не хранится как флаг.
"""

from django.db import models
from django.utils import timezone
from django.utils.text import slugify


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
    # icon — имя иконки (например из Ant Design Icons), не файл
    icon: str = models.CharField("Иконка", max_length=64, blank=True, default="")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ["title"]

    def save(self, *args, **kwargs) -> None:
        # Автогенерация slug из title при создании
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
    # DecimalField — обязательно для денег, FloatField запрещён архитектурно
    price: models.DecimalField = models.DecimalField(
        "Цена (KGS)",
        max_digits=10,
        decimal_places=2,
    )
    # image — относительный путь или URL; хранится как строка (CDN / media)
    image: str = models.ImageField(
        "Изображение",
        upload_to="products/",
        blank=True,
        default="",
    )
    popular: bool = models.BooleanField("Популярный", default=False)
    # stock с CHECK constraint stock >= 0 создаётся через migration RunSQL
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


class Promotion(models.Model):
    """
    Промо-акция, привязанная к товару.

    Поле promo в API НЕ хранится как флаг в БД — оно вычисляется
    динамически: promo = starts_at <= now() <= ends_at.
    Это сделано чтобы акция включалась/выключалась автоматически по времени
    без ручного переключения флага.
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
    url: str = models.CharField(
        "Ссылка на страницу акции",
        max_length=256,
        blank=True,
        default="",
    )
    starts_at: models.DateTimeField = models.DateTimeField("Начало акции")
    ends_at: models.DateTimeField = models.DateTimeField("Конец акции")

    class Meta:
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    @property
    def is_active(self) -> bool:
        """
        Вычисляет активность акции по текущему времени.
        Используется сериализатором для поля promoInfo.promo — не хранится в БД.
        """
        now = timezone.now()
        return self.starts_at <= now <= self.ends_at

    def __str__(self) -> str:
        return f"Акция для {self.product}"
