from flask import Flask, render_template, request
from dotenv import load_dotenv
from google import generativeai as genai
import os

load_dotenv()

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


import re

@app.route('/search')
def search():
    model = genai.GenerativeModel('gemini-1.0-pro-latest')
    genai.configure(api_key=os.getenv('API'))
    
    # Contexto da IA
    context = ('Você é um chat destinado a responder, guiar e ensinar jovens aprendizes a como utilizar os mais diversos automóveis do agro, como uma colheitadeira, etc. Seu nome é CNHbot. Todos os vídeos solicitados devem ser do canal da CNH do youtube. Você deve guai tudo a CNH com um atendimento privado ao jovem aprendiz.')
    
    # Pega o prompt (mensagem do usuário)
    prompt = request.args.get('prompt')
    
    # Expressão regular para detectar as formas de "vídeo" ou "video"
    video_keywords = r'\b(vídeo|video|Vídeo|Video|Vídeos|Videos)\b'
    
    # Verificar se a palavra "vídeo" (ou suas variações) está no prompt
    if re.search(video_keywords, prompt, re.IGNORECASE):
        video_response = "<iframe width='560' height='315' src='https://www.youtube.com/embed/dQw4w9WgXcQ' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
    else:
        video_response = None
    
    # Gerar resposta com a IA
    input_ia = f'{context}: {prompt}'
    output = model.generate_content(input_ia)
    
    return {'message': output.text, 'video': video_response}


if __name__ == '__main__':
    app.run(debug=True)
