# Gera o site v3 da Aion (home + 7 páginas de serviço) em ../site-v3/.
# Rodar: python clientes/aion-psicologia/site-fontes/gerar-v3.py
# Todo texto de serviço veio da v1 (já revisada pela régua do CFP), da bio e das legendas do Instagram da clínica.
# O que falta dela é <span class="pend">, visível até o modo de apresentação.
import os, urllib.parse

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, '..', 'site-v3')
ZAP = '557191535067'  # confirmado pelo Marcelo em 28/07/2026; sem o nono dígito, e não se acrescenta

def wa(texto):
    return f'https://wa.me/{ZAP}?text=' + urllib.parse.quote(texto)

WA_GERAL = wa('Olá! Vim pelo site da Aion e gostaria de conversar sobre um atendimento.')
SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13L13 3M5.5 3H13v7.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
MANCHA = '<svg class="mancha" viewBox="0 0 400 350" aria-hidden="true"><path fill="currentColor" d="M64 30C140 2 250 10 312 54C374 100 396 186 366 250C336 314 250 348 176 336C102 324 42 272 20 204C4 136 10 58 64 30Z"/></svg>'
RAMO = '''<svg class="ramo" viewBox="0 0 150 262" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M100 252C97 198 91 150 78 108C66 70 52 44 34 20"/><path d="M95 215C112 202 134 206 146 222C130 234 106 232 95 215Z"/><path d="M88 180C70 168 48 172 36 188C52 200 76 198 88 180Z"/><path d="M80 146C97 133 119 137 131 153C115 165 91 163 80 146Z"/><path d="M70 114C52 102 30 106 18 122C34 134 58 132 70 114Z"/><path d="M58 80C75 67 97 71 109 87C93 99 69 97 58 80Z"/><path d="M46 48C30 38 12 42 4 56C18 66 36 64 46 48Z"/></g><g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".7"><path d="M97 216L140 222"/><path d="M86 181L42 187"/><path d="M82 147L125 153"/><path d="M68 115L24 121"/><path d="M60 81L103 87"/><path d="M48 49L10 55"/></g></svg>'''
ZAP_ICONE = '<svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.95 1.34-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .39-.06.61.47.24.56.79 1.94.86 2.08.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.11.07.66-.17 1.34z"/></svg>'

def btn(href, texto, classe='btn-cheio', externo=True):
    alvo = ' target="_blank" rel="noopener"' if externo else ''
    return f'<a class="btn {classe}" href="{href}"{alvo}>{texto}<span class="seta">{SETA}</span></a>'

EQUIPE = [
    dict(nome='Maria Tutti Cabussu', papel='Fundadora e coordenadora', crp='CRP 03/939', foto='foto-maria-tutti',
         bio='Psicóloga clínica, especialista em Neuropsicologia, Psicoterapia Analítica, Psicopedagogia e Avaliação Psicológica, com formação em Autismo e em Neurodesenvolvimento Atípico. Foi coordenadora acadêmica da especialização em Neuropsicologia da UFBA. <span class="pend">Trajetória do currículo público; confirmar com ela.</span>'),
    dict(nome='João Sarno', papel='Psicólogo', crp='CRP 03/20812', foto='foto-joao-sarno',
         bio='Especialista em Psicologia Clínica, com formação em Prevenção e Posvenção do Suicídio. Especializando em Terapia do Esquema.'),
    dict(nome='Giuliana Ragno', papel='Psicóloga', crp='CRP 03/23949', foto='foto-giuliana-ragno',
         bio='Especialista em Análise Comportamental Clínica, com formação em ACT, a Terapia de Aceitação e Compromisso.'),
]

QUEM_PADRAO = 'Todos os profissionais da Aion são psicólogos registrados no Conselho Regional de Psicologia. O caso vai para o profissional da equipe cuja formação corresponde à demanda, e isso se define depois da conversa inicial.'
FAQ_CONTATO = ('Como funciona o primeiro contato?', 'Você escreve para a clínica contando o que procura. A equipe responde com uma conversa inicial para entender a demanda e explicar como o processo funciona. Só depois dessa conversa se define o profissional e o formato do acompanhamento.')
FAQ_ONLINE = ('Este atendimento funciona online?', 'A clínica atende presencialmente, no Itaigara, e também online. <span class="pend">Quais serviços funcionam online: a confirmar.</span>')

SERVICOS = [
    dict(slug='atendimento-psicologico', nome='Atendimento <em>Psicológico</em>', simples='Atendimento Psicológico', img='sv-atendimento-psicologico',
         curto='Acompanhamento psicoterapêutico para o bem-estar emocional, cognitivo e social.',
         frase='Você convive há anos com algo que pesa e <em>nunca sentou para falar sobre isso</em>.',
         publico=['Crianças', 'Adolescentes', 'Adultos'],
         lead='Acompanhamento psicoterapêutico para promoção de bem-estar emocional, cognitivo e social. O trabalho acontece no ritmo de cada pessoa: entender o que motiva a busca e construir, junto, formas de lidar com o que aparece.',
         mais='A escolha da abordagem depende da demanda e do profissional que conduz o caso. A equipe reúne formações diferentes, e é por isso que a definição do profissional vem depois da conversa inicial, não antes dela.',
         passos=[('Conversa inicial', 'Para entender o que você procura.'), ('Encontros regulares', 'Com frequência combinada entre as partes.'), ('Sigilo', 'Sigilo profissional em todas as etapas.')],
         nota='', quem=QUEM_PADRAO,
         faq=[FAQ_CONTATO, ('A partir de que idade a clínica atende?', 'A Aion atende crianças, adolescentes e adultos. <span class="pend">Idade mínima do atendimento infantil: a confirmar.</span>'), FAQ_ONLINE]),
    dict(slug='avaliacao-neuropsicologica', nome='Avaliação <em>Neuropsicológica</em>', simples='Avaliação Neuropsicológica', img='sv-avaliacao-neuropsicologica',
         curto='Investigação dos transtornos do neurodesenvolvimento, como TDAH, TEA e dislexia.',
         frase='A escola chamou para conversar e <em>falou em avaliação</em>.',
         publico=['Crianças', 'Adolescentes', 'Adultos'],
         lead='Processo estruturado de investigação e diagnóstico dos transtornos do neurodesenvolvimento, entre eles TDAH, TEA e dislexia. Reúne entrevista, aplicação de instrumentos padronizados e uma devolutiva ao final, com a leitura do funcionamento cognitivo e a orientação dos próximos passos.',
         mais='A avaliação não acontece em um encontro só. São vários, porque cada etapa depende do que a anterior mostrou. O que será investigado se define na entrevista inicial, junto com a família.',
         passos=[('Entrevista inicial', 'Com a família, ou com a própria pessoa no caso de adultos, para entender a história e definir o que será investigado.'), ('Sessões de avaliação', 'A aplicação dos instrumentos acontece ao longo de alguns encontros.'), ('Devolutiva', 'Uma conversa para apresentar a leitura do funcionamento cognitivo e orientar os próximos passos, com o documento escrito do processo.')],
         nota='<span class="pend">Número usual de sessões, prazo total e se o documento é laudo ou relatório: a confirmar.</span>',
         quem='A fundadora, Maria Tutti Cabussu (CRP 03/939), é especialista em Neuropsicologia e em Avaliação Psicológica, com formação em Autismo e em Neurodesenvolvimento Atípico. ' + QUEM_PADRAO,
         faq=[('Quanto tempo leva uma avaliação neuropsicológica?', 'A avaliação é feita em vários encontros, porque envolve entrevista, aplicação de instrumentos e devolutiva. O número de sessões varia conforme o caso e é combinado no início. <span class="pend">Faixa usual de sessões e de prazo: a confirmar.</span>'),
              ('A avaliação pode ser feita online?', 'A clínica atende presencialmente e também online. <span class="pend">A avaliação neuropsicológica costuma exigir parte presencial, pela aplicação dos instrumentos. Confirmar como funciona aqui.</span>'),
              ('O que acontece depois da avaliação?', 'A devolutiva apresenta a leitura do funcionamento cognitivo e a orientação dos próximos passos. Quando o caso indica, um dos caminhos é a <a href="intervencao-neuropsicologica.html">intervenção neuropsicológica</a>, feita na própria clínica.')]),
    dict(slug='intervencao-neuropsicologica', nome='Intervenção <em>Neuropsicológica</em>', simples='Intervenção Neuropsicológica', img='sv-intervencao-neuropsicologica',
         curto='Treino e estímulo de atenção, memória e funções executivas depois da avaliação.',
         frase='O diagnóstico veio, e agora <em>ninguém disse o que fazer com ele</em>.',
         publico=['Após avaliação', 'Em qualquer idade'],
         lead='Treino e estímulo das funções cognitivas, como atenção, memória e funções executivas, para desenvolvimento e aprimoramento de habilidades que aparecem deficitárias.',
         mais='Costuma vir depois de uma <a href="avaliacao-neuropsicologica.html">avaliação</a>, que é o que orienta o que trabalhar e como. É a etapa que responde à pergunta que costuma sobrar quando o diagnóstico chega: e agora, o que a gente faz.',
         passos=[('Plano de trabalho', 'A partir do que a avaliação apontou.'), ('Encontros com atividades', 'Voltadas às habilidades em foco.')],
         nota='<span class="pend">Frequência, duração do processo e critérios de encerramento: a confirmar.</span>', quem=QUEM_PADRAO,
         faq=[('Preciso ter feito a avaliação na Aion?', '<span class="pend">A confirmar: se a clínica aceita laudo ou relatório feito em outro serviço, e o que é preciso apresentar nesse caso.</span>'), FAQ_CONTATO]),
    dict(slug='psicopedagogia', nome='<em>Psicopedagogia</em>', simples='Psicopedagogia', img='sv-psicopedagogia',
         curto='Acompanhamento das dificuldades no processo de aprender.',
         frase='Ele se esforça, mas <em>ler, escrever e estudar</em> continuam pesando mais do que deviam.',
         publico=['Crianças', 'Adolescentes'],
         lead='Acompanhamento das dificuldades no processo de aprender. É uma das três frentes que a Aion anuncia desde a sua apresentação: psicoterapia, avaliação neuropsicológica e psicopedagogia.',
         mais='A coordenadora da clínica é especialista em Psicopedagogia e coordenou uma especialização na área. <span class="pend">Como o atendimento se organiza e para que idades: a confirmar com a clínica.</span>',
         passos=[('Conversa inicial', 'Para entender o que está acontecendo nos estudos e o que já foi tentado.')],
         nota='<span class="pend">Etapas, frequência e relação com a escola: a confirmar.</span>',
         quem='A fundadora, Maria Tutti Cabussu (CRP 03/939), é especialista em Psicopedagogia. ' + QUEM_PADRAO,
         faq=[('Para que idade é?', '<span class="pend">A confirmar com a clínica.</span>'), FAQ_CONTATO, FAQ_ONLINE]),
    dict(slug='orientacao-familiar', nome='Orientação <em>Familiar</em>', simples='Orientação Familiar', img='sv-orientacao-familiar',
         curto='Aconselhamento para pais e responsáveis sobre os desafios do dia a dia.',
         frase='Em casa, <em>nada do que vocês tentam</em> com seu filho está funcionando.',
         publico=['Pais e responsáveis'],
         lead='Aconselhamento individualizado para pais e responsáveis sobre como lidar com os desafios da criança ou do adolescente no dia a dia. Um espaço para entender o que está acontecendo e sair com orientações práticas.',
         mais='Quem chega aqui costuma já ter tentado bastante coisa por conta. O trabalho começa por olhar o que já foi tentado, e não por uma lista pronta de recomendações.',
         passos=[('Conversa inicial', 'Para entender a situação em casa.'), ('Encontros com os responsáveis', 'Com frequência combinada entre as partes.'), ('Sigilo', 'Sigilo profissional em todas as etapas.')],
         nota='', quem=QUEM_PADRAO,
         faq=[('A criança precisa estar em atendimento na clínica?', '<span class="pend">A confirmar: se a orientação familiar acontece de forma independente ou acompanha um atendimento em curso.</span>'),
              ('Os dois responsáveis participam?', '<span class="pend">A confirmar como os encontros se organizam quando há mais de um responsável.</span>'), FAQ_ONLINE]),
    dict(slug='orientacao-profissional', nome='Orientação <em>Profissional</em>', simples='Orientação Profissional', img='sv-orientacao-profissional',
         curto='Autoconhecimento e escolha de carreira para adolescentes e jovens.',
         frase='Seu filho precisa escolher uma profissão e <em>travou</em>.',
         publico=['Adolescentes', 'Jovens adultos'],
         lead='Processo de autoconhecimento e escolha de carreira alinhada aos interesses e às aptidões de jovens. Um percurso para chegar a uma decisão com mais clareza, sem pressa.',
         mais='O trabalho é com o próprio jovem. A família costuma participar do primeiro contato e da conversa final, e a decisão continua sendo de quem vai cursar.',
         passos=[('Conversa inicial', 'Para entender em que ponto da escolha o jovem está.'), ('Encontros de autoconhecimento', 'Sobre interesses e aptidões.')],
         nota='<span class="pend">Número de encontros, uso de instrumentos e formato do fechamento: a confirmar.</span>', quem=QUEM_PADRAO,
         faq=[('Serve para quem já está na faculdade?', '<span class="pend">A confirmar: se a clínica atende reorientação de carreira para quem já começou um curso.</span>'), FAQ_CONTATO]),
    dict(slug='grupo-apoio-parental', nome='Grupo de Apoio <em>Parental</em>', simples='Grupo de Apoio Parental', img='sv-grupo-apoio-parental',
         curto='Acolhimento e escuta qualificada, em grupo, para familiares de jovens atípicos.',
         frase='Você queria conversar com <em>quem passa pela mesma coisa</em>, não com quem opina.',
         publico=['Familiares', 'Em grupo'],
         lead='Espaço de acolhimento e escuta qualificados para familiares de jovens atípicos. Encontrar quem passa por algo parecido, com a mediação de um profissional, tira o peso de atravessar isso sozinho.',
         mais='É o serviço da clínica que acontece em grupo. A mediação é de um profissional da equipe, e o sigilo vale para o que é dito ali dentro.',
         passos=[('Contato com a clínica', 'Para entender o formato e a agenda.'), ('Encontros em grupo', 'Com mediação de um profissional da equipe.')],
         nota='<span class="pend">Inscrição, tamanho da turma e agenda atual: a confirmar.</span>', quem=QUEM_PADRAO,
         faq=[('Quando abre uma turma nova?', '<span class="pend">A confirmar a periodicidade das turmas e como entrar na lista de espera.</span>'),
              ('Preciso ter um filho em atendimento na Aion?', '<span class="pend">A confirmar se o grupo é aberto a familiares que não acompanham na clínica.</span>')]),
]
for s in SERVICOS:
    s['wa'] = wa(f'Olá! Vim pelo site da Aion e gostaria de saber sobre {s["simples"].lower()}.')

def head(titulo, desc):
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Aion Psicologia">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/compartilhamento.jpg">
<meta property="og:locale" content="pt_BR">
<link rel="icon" href="assets/icone-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="assets/icone-180.png">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=gambetta@400,500,401&amp;f[]=switzer@400,500,600&amp;display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@500&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
</head>'''

CONTRATO = '''<!--
TESE: a clínica de 22 anos aparece do tamanho que ela é: gente real (a fundadora, a equipe, os congressos), não sala de banco de imagem. Recusa o "creme quieto com serifa" da v2.
MUNDO: a paleta inteira da marca em campos (vinho de terracota, pêssego, rosa dos posts, areia), serifa Gambetta com itálico em cor, arcos, botânica em traço e o labirinto do logo.
HISTÓRIA: quem chega entende o que a Aion faz, reconhece a sua situação num serviço, vê quem atende e escreve no WhatsApp já no assunto.
PRIMEIRA TELA: título com a frase da bio à esquerda e dois botões; à direita, a Tutti num arco grande sobre a mancha pêssego, o selo circular "desde 2004" e a ficha com o CRP.
FORMA: site de clínica de referência (Webflow/Awwwards), multipágina: home + 7 serviços.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->'''

def topo(pref=''):
    return f'''<a class="pula" href="#conteudo">Pular para o conteúdo</a>
<div class="aviso-demo" role="note"><p>Demonstração preparada pela Hórus. Os trechos marcados aguardam confirmação da clínica.</p><button class="pend-btn" type="button" aria-pressed="false">Ocultar marcações</button></div>
<header class="topo">
  <div class="topo-in">
    <a class="marca" href="{pref}index.html" aria-label="Aion Psicologia, início"><img src="assets/marca-simbolo.webp" width="38" height="40" alt=""><span class="marca-nome">AION<small>PSICOLOGIA</small></span></a>
    <nav class="menu" id="menu" aria-label="Principal">
      <a href="{pref}index.html#sobre">A clínica</a>
      <a href="{pref}index.html#servicos">Serviços</a>
      <a href="{pref}index.html#equipe">Equipe</a>
      <a href="{pref}index.html#perguntas">Perguntas</a>
      <a href="{pref}index.html#contato">Contato</a>
      {btn(WA_GERAL, 'Agendar uma conversa')}
    </nav>
    <button class="menu-abre" type="button" aria-controls="menu" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
  </div>
</header>'''

def rodape():
    links = ''.join(f'<li><a href="{s["slug"]}.html">{s["simples"]}</a></li>' for s in SERVICOS)
    return f'''<footer class="rodape">
  <div class="envolve rodape-in">
    <div>
      <a class="marca" href="index.html" aria-label="Aion Psicologia, início"><img src="assets/marca-simbolo.webp" width="38" height="40" alt=""><span class="marca-nome" style="color:var(--creme)">AION<small style="color:var(--pessego)">PSICOLOGIA</small></span></a>
      <p class="sobre-rod">Psicoterapia, avaliação neuropsicológica e psicopedagogia no Itaigara, em Salvador, e online. Desde 2004.</p>
    </div>
    <div><h4>Serviços</h4><ul>{links}</ul></div>
    <div><h4>Contato</h4><ul>
      <li><a href="{WA_GERAL}" target="_blank" rel="noopener">WhatsApp (71) 9153-5067</a></li>
      <li><a href="mailto:aion@aionpsicologia.com">aion@aionpsicologia.com</a></li>
      <li><a href="https://www.instagram.com/aionpsicologia/" target="_blank" rel="noopener">@aionpsicologia</a></li>
      <li><a href="https://www.google.com/maps/search/?api=1&amp;query=Alameda%20Benevento%2C%20429%2C%20Itaigara%2C%20Salvador" target="_blank" rel="noopener">Alameda Benevento, 429, Itaigara</a></li>
    </ul></div>
    <p class="legal">Responsável técnica: <span class="pend">a confirmar</span> · Registro da pessoa jurídica no CRP-03: <span class="pend">a confirmar</span> · Publicidade conforme a Resolução CFP nº 11/2018 · © 2026 Aion Psicologia · Site por Hórus</p>
  </div>
  <svg class="nome-gigante" viewBox="0 0 1400 250" aria-hidden="true"><text x="700" y="240" text-anchor="middle" textLength="1330" lengthAdjust="spacing">AION</text></svg>
  <p class="crise">Se você está em crise, ligue para o CVV no <a href="tel:188">188</a>, gratuito e disponível 24 horas, ou procure a emergência pelo <a href="tel:192">192</a>.</p>
</footer>
<a class="zap" href="{WA_GERAL}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">{ZAP_ICONE}</a>
<script src="assets/site.js" defer></script>
</body>
</html>
'''

def rostos(tam=''):
    return '<div class="rostos">' + ''.join(f'<img src="assets/img/{p["foto"]}.webp" width="64" height="64" alt="" loading="lazy">' for p in EQUIPE) + '</div>'

def faq_html(itens, classes_extra=None):
    out = []
    for i, (q, a) in enumerate(itens):
        so = ' class="so-pend"' if a.startswith('<span class="pend">') and a.endswith('</span>') else ''
        out.append(f'<details{so}><summary>{q}</summary><p>{a}</p></details>')
    return '<div class="faq">' + ''.join(out) + '</div>'

def cartao(s, img_ratio=True):
    pub = ' · '.join(s['publico'])
    return f'''<a class="cartao rev" href="{s["slug"]}.html">
  <div class="img"><img src="assets/img/{s["img"]}.webp" width="640" height="800" alt="" loading="lazy" decoding="async"></div>
  <span class="ir" aria-hidden="true">{SETA}</span>
  <h3>{s["nome"]}</h3>
  <p class="frase">“{s["frase"].replace("<em>","").replace("</em>","")}”</p>
  <p class="publico">{pub}</p>
</a>'''

def home():
    faixa_itens = ['Psicoterapia', '<em>Avaliação neuropsicológica</em>', 'Psicopedagogia', '<em>Orientação familiar</em>', 'Intervenção neuropsicológica', '<em>Orientação profissional</em>', 'Grupo de apoio parental']
    sep = '<img src="assets/labirinto.svg" width="44" height="46" alt="">'
    faixa = ''.join(f'<span>{t}</span>{sep}' for t in faixa_itens * 2)
    cartoes = ''.join(cartao(s) for s in SERVICOS)
    pessoas = ''.join(f'''<article class="pessoa rev">
  <div class="arco"><img src="assets/img/{p["foto"]}.webp" width="660" height="675" alt="Retrato de {p["nome"]}" loading="lazy" decoding="async"></div>
  <span class="papel">{p["papel"]}</span>
  <h3>{p["nome"]}</h3>
  <p class="crp">Psicólog{"o" if p["nome"].startswith("João") else "a"} · {p["crp"]}</p>
  <p class="bio">{p["bio"]}</p>
</article>''' for p in EQUIPE)
    orbita_pos = [('3%', '42%'), ('83%', '20%'), ('70%', '84%')]
    orbita = ''.join(f'<img src="assets/img/{p["foto"]}.webp" width="64" height="64" alt="" style="left:{x};top:{y}" loading="lazy">' for p, (x, y) in zip(EQUIPE, orbita_pos))
    faq_home = [
        ('O que eu conto na primeira mensagem?', 'Só o essencial: para quem é o atendimento (você, seu filho, sua família) e o que está procurando. Os detalhes ficam para a conversa inicial.'),
        ('A partir de que idade a clínica atende?', 'A Aion atende crianças, adolescentes e adultos. <span class="pend">Idade mínima do atendimento infantil: a confirmar.</span>'),
        ('Vocês atendem online?', 'Sim. A clínica atende presencialmente, no Itaigara, e também online. <span class="pend">Quais serviços funcionam online: a confirmar.</span>'),
        ('Vocês atendem plano de saúde?', '<span class="pend">Convênios aceitos e emissão de recibo para reembolso: a confirmar com a clínica.</span>'),
        ('O que eu conversar aqui fica entre nós?', 'Sim. O sigilo é dever do psicólogo, previsto no Código de Ética Profissional do Psicólogo.'),
        ('Onde fica a clínica?', 'No Centro Empresarial Itaigara Sul, Alameda Benevento, 429, salas 508 e 509. <span class="pend">Estacionamento no prédio: a confirmar.</span>'),
    ]
    return head('Aion Psicologia | Psicoterapia, avaliação neuropsicológica e psicopedagogia em Salvador',
                'Clínica de psicologia no Itaigara, em Salvador, desde 2004. Psicoterapia, avaliação neuropsicológica, psicopedagogia e apoio à família, para crianças, adolescentes e adultos. Presencial e online.') + f'''
<body>
{CONTRATO}
{topo()}
<main id="conteudo">

<!-- ABERTURA: o que é, para quem, quem cuida e a ação -->
<section class="envolve abertura">
  <div>
    <h1>Há mais de 20 anos cuidando da <em>sua saúde mental</em>.</h1>
    <p class="lead">Psicoterapia, avaliação neuropsicológica e psicopedagogia para crianças, adolescentes, adultos e famílias. No Itaigara, em Salvador, e online.</p>
    <div class="acoes">{btn(WA_GERAL, 'Agendar uma conversa')}{btn('#servicos', 'Ver os serviços', 'btn-claro', False)}</div>
    <div class="confianca">{rostos()}<p><strong>Equipe de psicólogos</strong> com registro no Conselho Regional de Psicologia da Bahia.</p></div>
  </div>
  <div class="cena">
    {MANCHA}
    <div class="arco arco-g abre-arco"><img src="assets/img/tutti-2026.webp" width="650" height="780" alt="Maria Tutti Cabussu, fundadora da Aion, sentada numa poltrona" fetchpriority="high"></div>
    <div class="selo" aria-hidden="true"><svg viewBox="0 0 140 140"><circle class="disco" cx="70" cy="70" r="70"/><defs><path id="circ" d="M70 70m-52 0a52 52 0 1 1 104 0a52 52 0 1 1-104 0"/></defs><g class="giro"><text><textPath href="#circ" textLength="322">Aion Psicologia · desde 2004 ·</textPath></text></g><image href="assets/labirinto.svg" x="46" y="45" width="48" height="50"/></svg></div>
    <div class="ficha"><strong>Maria Tutti Cabussu</strong><span>Fundadora · CRP 03/939</span></div>
  </div>
</section>

<!-- FAIXA: os serviços como palavra grande, andando com a rolagem -->
<div class="faixa" aria-hidden="true"><div class="faixa-trilho">{faixa}</div></div>

<!-- SOBRE: a clínica é gente, e a história não recomeça a cada porta -->
<section class="envolve sobre" id="sobre">
  <div class="colagem rev">
    <div class="foto-equipe"><img src="assets/img/equipe-aion.webp" width="864" height="544" alt="Giuliana Ragno, Maria Tutti Cabussu e João Sarno sentados num sofá" loading="lazy" decoding="async"></div>
    {RAMO}
    <p class="legenda"><strong>A equipe</strong>Giuliana Ragno, Tutti Cabussu e João Sarno, no Dia do Psicólogo.</p>
  </div>
  <div class="sobre-texto rev">
    <h2 class="tit">Psicologia é acolher, compreender e <em>transformar</em>.</h2>
    <p>Fundada em 2004 pela psicóloga Maria Tutti Cabussu, a Aion reúne psicólogos com formações diferentes sob o mesmo teto. Quando a demanda muda ao longo do processo, o acompanhamento continua dentro da mesma equipe, e você não recomeça a contar a sua história a cada porta nova.</p>
    <dl class="ficha-clinica">
      <div><dt>2004</dt><dd>ano de fundação</dd></div>
      <div><dt>7</dt><dd>serviços, da avaliação ao apoio à família</dd></div>
      <div><dt>3</dt><dd>psicólogos na equipe atual</dd></div>
      <div><dt>2</dt><dd>formatos: presencial no Itaigara e online</dd></div>
    </dl>
  </div>
</section>

<!-- SERVIÇOS: escolher pela própria situação e seguir para a página do serviço -->
<section class="servicos" id="servicos">
  <div class="envolve">
    <div class="cab-secao">
      <h2 class="tit">Como a Aion <em>pode ajudar</em></h2>
      <p>Sete serviços e uma equipe. Cada cartão começa pela situação em que as pessoas costumam chegar.</p>
    </div>
    <div class="cartoes">
      {cartoes}
      <a class="cartao cartao-ajuda rev" href="{WA_GERAL}" target="_blank" rel="noopener">
        <img class="labir" src="assets/labirinto.svg" width="72" height="75" alt="">
        <div><h3>Não sabe <em>por onde começar</em>?</h3><p>Conte em poucas linhas o que está acontecendo. A primeira conversa serve justamente para isso.</p></div>
        <span class="btn btn-claro">Conversar<span class="seta">{SETA}</span></span>
      </a>
    </div>
    <p class="ilustra">Fotos dos cartões: imagens ilustrativas, a trocar pelas fotos da clínica.</p>
  </div>
</section>

<!-- COMO COMEÇA: tirar o medo do primeiro contato -->
<section class="envolve comeca" id="comeca">
  <div class="comeca-visual">
    <div class="botanica" aria-hidden="true">{MANCHA}{RAMO}<img class="labir" src="assets/labirinto.svg" width="200" height="208" alt=""></div>
  </div>
  <div class="comeca-texto">
    <h2 class="tit">Começar é mais simples <em>do que parece</em>.</h2>
    <p class="lead">Ninguém precisa chegar com o problema explicado. O primeiro contato serve justamente para isso.</p>
    <ol class="passos">
      <li class="rev"><h3>Você manda uma mensagem</h3><p>Pelo WhatsApp, em poucas linhas: para quem é o atendimento e o que está procurando. Detalhes de saúde ficam para a conversa.</p></li>
      <li class="rev"><h3>Uma conversa inicial</h3><p>A equipe entende a demanda e explica como o processo funciona, sem compromisso de seguir adiante.</p></li>
      <li class="rev"><h3>O profissional certo</h3><p>O caso vai para o profissional da equipe cuja formação corresponde à demanda, e a frequência é combinada com você.</p></li>
    </ol>
    <p class="nota"><span class="pend">Prazo de resposta da primeira mensagem e agenda disponível: a confirmar.</span></p>
  </div>
</section>

<!-- QUEM ATENDE: pessoas, com registro -->
<section class="equipe" id="equipe">
  <div class="envolve">
    <div class="cab-secao">
      <h2 class="tit">Quem <em>atende</em></h2>
      <p>Psicólogos com formações diferentes, todos com registro no Conselho Regional de Psicologia da Bahia.</p>
    </div>
    <div class="pessoas">{pessoas}</div>
  </div>
</section>

<!-- APRENDIZADO: prova real de autoridade, no lugar do depoimento que o CFP proíbe -->
<section class="envolve aprende" id="aprendizado">
  <h2 class="tit">Estar em constante aprendizado faz parte da <em>essência da Aion</em>.</h2>
  <p class="lead">Acreditamos que essa escuta múltipla e curiosa é o que fortalece nosso trabalho e nos conecta cada vez mais às pessoas que acompanhamos.</p>
  <div class="galeria">
    <figure class="foto-evento rev"><div class="img"><img src="assets/img/congresso-labirinto-autismo.webp" width="900" height="1194" alt="Tutti Cabussu no 8º Congresso Labirinto de Autismo" loading="lazy" decoding="async"></div>
      <figcaption><strong>8º Congresso Labirinto de Autismo</strong>Perspectivas em pesquisa e clínica, com um encontro com o Dr. Laurent Mottron, autor de “Se o autismo não é uma doença, então o que ele é?”.</figcaption></figure>
    <figure class="foto-evento rev"><div class="img"><img src="assets/img/semana-educacao-inclusiva.webp" width="770" height="617" alt="Tutti Cabussu na 3ª Semana de Educação Inclusiva da Universidade Petrobras" loading="lazy" decoding="async"></div>
      <figcaption><strong>3ª Semana de Educação Inclusiva</strong>Universidade Petrobras. A palestra da Tutti: “Neurodivergência e diversidade: referências para inclusão no mundo do trabalho”.</figcaption></figure>
    <figure class="foto-evento rev"><div class="img"><img src="assets/img/congresso-baiano-neurodesenvolvimento.webp" width="900" height="1200" alt="Tutti Cabussu no Congresso Baiano de Neurodesenvolvimento" loading="lazy" decoding="async"></div>
      <figcaption><strong>Congresso Baiano de Neurodesenvolvimento</strong>Presença da fundadora no congresso. <span class="pend">Ano e participação: a confirmar.</span></figcaption></figure>
  </div>
</section>

<!-- NO INSTAGRAM: a voz da clínica, e a porta para o conteúdo -->
<section class="insta" id="instagram">
  <div class="envolve">
    <div class="cab-secao">
      <h2 class="tit">No Instagram <em>da Aion</em></h2>
      <p>Conteúdo da clínica sobre saúde mental e neurodivergência. <a class="link-seta" href="https://www.instagram.com/aionpsicologia/" target="_blank" rel="noopener">Seguir @aionpsicologia</a></p>
    </div>
    <div class="posts">
      <a class="post rev" href="https://www.instagram.com/p/DSceZCKEUxj/" target="_blank" rel="noopener"><div class="img"><img src="assets/img/post-verao-neurodivergencia.webp" width="700" height="875" alt="Post: Verão e neurodivergência" loading="lazy" decoding="async"></div><p>Para muitas pessoas no TEA, o verão não é apenas uma estação mais quente.</p><span>Ler no Instagram</span></a>
      <a class="post rev" href="https://www.instagram.com/p/DPpXD8rDHVk/" target="_blank" rel="noopener"><div class="img"><img src="assets/img/post-saude-mental.webp" width="700" height="875" alt="Post: 10 de outubro, Dia Mundial da Saúde Mental" loading="lazy" decoding="async"></div><p>Nem sempre estar bem é estar feliz o tempo todo.</p><span>Ler no Instagram</span></a>
      <a class="post rev" href="https://www.instagram.com/p/DRfn6lYAQwD/" target="_blank" rel="noopener"><div class="img"><img src="assets/img/post-25-novembro.webp" width="700" height="875" alt="Post: 25 de novembro, Dia Internacional da Eliminação da Violência Contra a Mulher" loading="lazy" decoding="async"></div><p>Proteger é também ensinar a reconhecer a violência.</p><span>Ler no Instagram</span></a>
    </div>
  </div>
</section>

<!-- PERGUNTAS: o que a pessoa tem vergonha de perguntar -->
<section class="envolve perguntas" id="perguntas">
  <div>
    <h2 class="tit">Perguntas que <em>chegam até nós</em></h2>
    <p class="lead" style="margin-top:20px">Se a sua não estiver aqui, a primeira mensagem também serve para isso.</p>
    {faq_html(faq_home)}
  </div>
  <figure class="rev" style="margin:0"><div class="arco" style="aspect-ratio:4/5"><img src="assets/img/sala-atendimento.webp" width="1500" height="837" alt="" loading="lazy" decoding="async" style="object-position:22% 50%"></div><figcaption class="ilustra" style="margin-top:12px">Imagem ilustrativa, a trocar pela foto da sala.</figcaption></figure>
</section>

<!-- CHAMADA FINAL + CONTATO: o último atrito, tudo num lugar -->
<section class="final" id="contato">
  <div class="envolve">
    <div class="final-topo">
      <div class="orbitas" aria-hidden="true"><span class="anel a1"></span><span class="anel a2"></span><span class="anel a3"></span>{orbita}</div>
      <h2 class="tit">O primeiro passo é <em>uma conversa</em>.</h2>
      <p>Conte em poucas linhas para quem é o atendimento e o que você procura. Os detalhes ficam para a conversa.</p>
      {btn(WA_GERAL, 'Conversar no WhatsApp', 'btn-claro')}
    </div>
    <div class="contato">
      <dl class="dados">
        <div><dt>Endereço</dt><dd>Alameda Benevento, 429, salas 508 e 509<br>Centro Empresarial Itaigara Sul, Itaigara<br>Salvador, BA, 41825-000</dd></div>
        <div><dt>Horário</dt><dd>Segunda a sexta, das 7h30 às 20h<br>Sábado, das 7h30 às 12h</dd></div>
        <div><dt>Atendimento</dt><dd>Presencial no Itaigara e online</dd></div>
        <div><dt>WhatsApp</dt><dd><a href="{WA_GERAL}" target="_blank" rel="noopener">(71) 9153-5067</a></dd></div>
        <div><dt>Telefone</dt><dd>(71) 3351-6630 <span class="pend">confirmar se está ativo</span></dd></div>
        <div><dt>E-mail</dt><dd><a href="mailto:aion@aionpsicologia.com">aion@aionpsicologia.com</a></dd></div>
      </dl>
      <div class="mapa"><iframe title="Mapa: Centro Empresarial Itaigara Sul, Alameda Benevento, 429" src="https://maps.google.com/maps?q=Alameda%20Benevento%2C%20429%2C%20Itaigara%2C%20Salvador%20BA&amp;z=16&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
  </div>
</section>
</main>
''' + rodape()

def pagina(s):
    i = SERVICOS.index(s)
    outros = [o for o in SERVICOS if o is not s][:6]
    passos = ''.join(f'<li class="rev"><h3>{t}</h3><p>{d}</p></li>' for t, d in s['passos'])
    chips = ''.join(f'<span>{c}</span>' for c in s['publico'])
    return head(f'{s["simples"]} | Aion Psicologia, Itaigara, Salvador', s['curto']) + f'''
<body>
{CONTRATO}
{topo()}
<main id="conteudo">
<section class="envolve sv-abertura">
  <div>
    <nav class="migalha" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">/</span><a href="index.html#servicos">Serviços</a><span aria-hidden="true">/</span><span>{s["simples"]}</span></nav>
    <h1>{s["nome"]}</h1>
    <div class="chips">{chips}</div>
    <p class="lead">{s["lead"]}</p>
    <p class="mais">{s["mais"]}</p>
    <div class="acoes">{btn(s["wa"], "Conversar sobre este serviço")}</div>
  </div>
  <div class="sv-cena">
    {MANCHA}
    <div class="arco abre-arco"><img src="assets/img/{s["img"]}.webp" width="640" height="800" alt="" fetchpriority="high"></div>
    {RAMO}
    <p class="ilustra">Imagem ilustrativa.</p>
  </div>
</section>

<section class="quando">
  <div class="envolve">
    <p class="rotulo">Quando esse serviço costuma ser procurado</p>
    <blockquote>{s["frase"]}</blockquote>
    <p class="obs">Reconhecer-se nessa frase não é um diagnóstico. É um ponto de partida para a conversa inicial, que é onde o caminho se define.</p>
  </div>
</section>

<section class="envolve sv-corpo">
  <div>
    <h2 class="tit-md">Como <em>funciona</em></h2>
    <ol class="passos">{passos}</ol>
    {f'<p class="nota">{s["nota"]}</p>' if s["nota"] else ''}
  </div>
  <aside class="quem rev">
    {rostos()}
    <h3>Quem conduz</h3>
    <p>{s["quem"]}</p>
    <a class="link-seta" href="index.html#equipe">Conhecer a equipe</a>
  </aside>
</section>

<section class="envolve sv-faq">
  <h2 class="tit-md">Perguntas sobre <em>{s["simples"].lower()}</em></h2>
  {faq_html(s["faq"])}
</section>

<section class="outros">
  <div class="envolve">
    <div class="cab-secao"><h2 class="tit">Os outros <em>serviços</em></h2><p>Quando a demanda muda ao longo do processo, o acompanhamento continua dentro da mesma equipe.</p></div>
    <div class="cartoes">{''.join(cartao(o) for o in outros)}</div>
  </div>
</section>

<section class="final" id="contato">
  <div class="envolve">
    <div class="final-topo">
      <h2 class="tit">O primeiro passo é <em>uma conversa</em>.</h2>
      <p>Para tirar uma dúvida sobre {s["simples"].lower()} ou marcar um horário.</p>
      {btn(s["wa"], 'Conversar no WhatsApp', 'btn-claro')}
    </div>
  </div>
</section>
</main>
''' + rodape()

os.makedirs(SAIDA, exist_ok=True)
with open(os.path.join(SAIDA, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(home())
for s in SERVICOS:
    with open(os.path.join(SAIDA, s['slug'] + '.html'), 'w', encoding='utf-8') as f:
        f.write(pagina(s))
print('ok:', 1 + len(SERVICOS), 'páginas em', os.path.normpath(SAIDA))
