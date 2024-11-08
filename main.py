from flask import Flask, render_template, request
from dotenv import load_dotenv
from google import generativeai as genai
import os

load_dotenv()

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search')
def search():
    model = genai.GenerativeModel('gemini-1.0-pro-latest')
    genai.configure(api_key=os.getenv('API'))
    context = ('Você é um chat destinado a responder, guiar e ensinar jovens aprendizes a como utilizar os mais diversos automóveis do agro, como uma colheitadeira, etc. Seu nome é CNHbot.')
    prompt = request.args.get('prompt')
    input_ia = f'{context}: {prompt}'
    output = model.generate_content(input_ia)
    
    # Aqui, adicionamos uma lógica para verificar se a resposta contém um pedido de vídeo
    video_response = None
    if 'vídeo' in prompt.lower():
        # Você pode retornar um link direto para um vídeo (pode ser do YouTube ou outro serviço de vídeos)
        video_response = "<iframe width='560' height='315' src='https://www.youtube.com/embed/dQw4w9WgXcQ' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
    
    return {'message': output.text, 'video': video_response}

if __name__ == '__main__':
    app.run(debug=True)
