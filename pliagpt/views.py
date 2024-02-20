from django.shortcuts import render
from django.http import JsonResponse
from .models import Receita
import json
import requests
import qrcode
import base64
from io import BytesIO


def index(request):
    return render(request, 'receitas/index.html')


def receita(request):
    context = {
        'ingredientes': request.POST.getlist('ingrediente')
    }
    return render(request, 'receitas/receita.html', context=context)


def receitaSalva(request, id):
    receita = Receita.objects.get(id=id)
    codeqr = gerar_qr_code(f"{request.META['HTTP_HOST']}/receita/{receita.id}")

    context = {
        'titulo': json.loads(receita.titulo),
        'ingredientes': json.loads(receita.ingredientes),
        'preparo': json.loads(receita.preparo),
        'qrcode': codeqr,
        'link': f"{request.META['HTTP_HOST']}/receita/{receita.id}"
    }

    return render(request, 'receitas/receitaSalva.html', context=context)


def gerarReceita(request):
    ingredientes = [x for x in request.POST.getlist('ingrediente') if x != '']

    busca = f'eu tenho {", ".join(ingredientes[0].split(","))}, me de uma receita que eu possa fazer usando esses ingredientes, separe em titulo, ingredientes e modo de preparo'
    print(busca)
    
    # Atualizar Token
    headers = {
        'Authorization': 'token'
    }

    data = {
        'model': 'gpt-3.5-turbo',
        'messages': [{"role": 'user', 'content': busca}],
        'temperature': 0.7
    }

    r = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    passos = r.json()['choices'][0]['message']['content'].split('\n\n')

    resposta = {'titulo': passos[0].replace('Título: ', ''),
                'ingredientes': passos[1].split('\n'),
                'preparo': passos[2].split('\n')}

    nova_receita = Receita()
    nova_receita.titulo = json.dumps(resposta['titulo'])
    nova_receita.ingredientes = json.dumps(resposta['ingredientes'])
    nova_receita.preparo = json.dumps(resposta['preparo'])
    nova_receita.save()

    codeqr = gerar_qr_code(f"{request.META['HTTP_HOST']}/receita/{nova_receita.id}")

    resposta['link'] = f"{request.META['HTTP_HOST']}/receita/{nova_receita.id}"
    resposta['qrcode'] = codeqr

    return JsonResponse(resposta, status=200)


def gerar_qr_code(data):
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill='black', back_color='white')

    # Converte a imagem do QR code para base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    encoded = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return encoded
