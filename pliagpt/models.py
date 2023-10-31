from django.db import models
from django.core.management.base import BaseCommand
from django.utils import timezone
import uuid
from datetime import timedelta


# Create your models here.
class Receita(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=255)
    ingredientes = models.TextField()
    preparo = models.TextField()
    criado = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return self.criado + timedelta(days=15) <= timezone.now()

    def __str__(self):
        return str(self.id)


class Command(BaseCommand):
    help = 'Deleta Receita após 15 dias'

    def handle(self, *args, **options):
        all_objects = Receita.objects.all()
        expired_objects = [obj for obj in all_objects if obj.is_expired()]
        Receita.objects.filter(id__in=[obj.id for obj in expired_objects]).delete()

