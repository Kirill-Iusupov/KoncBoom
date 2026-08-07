from django.urls import path

from .views import CartPreviewView, OrderCreateView

urlpatterns = [
    # Важно: "preview/" объявлен ДО "" — иначе пустой путь перехватит всё.
    path("preview/", CartPreviewView.as_view(), name="cart-preview"),
    path("", OrderCreateView.as_view(), name="order-create"),
]