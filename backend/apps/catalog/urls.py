from rest_framework.routers import DefaultRouter

# Реальные ViewSet'ы (CategoryViewSet, ProductViewSet) регистрируются здесь в PR#2.
router = DefaultRouter()

urlpatterns = router.urls
