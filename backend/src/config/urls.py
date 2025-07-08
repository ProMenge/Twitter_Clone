"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    # TokenObtainPairView, # <-- Remova este import
    TokenRefreshView, # <-- Mantenha este import
)

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('users.urls')), # Isso inclui o seu 'login/' customizado

    # Apenas a URL para refresh do token é necessária
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Servir arquivos de mídia em desenvolvimento (NÃO USAR EM PRODUÇÃO)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)