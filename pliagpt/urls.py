from django.urls import path
from .views import index, receita, gerarReceita, receitaSalva

app_name = 'pliagpt'

urlpatterns = [
    path('', index, name='index'),
    path('receita', receita, name='receita'),
    path('gerar-receita', gerarReceita, name='gerar'),
    path('receita/<str:id>', receitaSalva, name='receita-salva')
]
