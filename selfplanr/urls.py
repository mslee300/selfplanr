from django.urls import path

from . import views

app_name = 'selfplanr'
urlpatterns = [
    path('', views.index, name='index'),
    path('loading/', views.loading, name='loading'),
    path('report/', views.report, name='report'),
    path('get_report/', views.get_report, name='get_report'),
]
