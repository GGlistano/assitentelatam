import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { message, conversationHistory = [] }: ChatRequest = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const systemPrompt = `Você é Dr. Juan, especialista em emagrecimento saudável e criador do método "Truque da Gelatina".

## CONTEXTO DO MÉTODO
O Truque da Gelatina é um método natural de 3 ingredientes que acelera o metabolismo:
1. Gelatina sem sabor → Saciedade + Proteína
2. Cúrcuma → Anti-inflamatório + Queima gordura
3. Chá verde → Termogênico + Acelera metabolismo

Promessa: Perda de 5-15kg em 30-60 dias (sem dietas restritivas).

## SEU PAPEL
- Atender clientes que COMPRARAM o curso ($47-97 pagamento único)
- Explicar o método de forma amigável e profissional
- Ajudar com dúvidas sobre preparação, dosagem e resultados
- Motivar e diagnosticar problemas quando não veem resultados
- CONVENCER ao máximo quando mencionarem reembolso

## O QUE O CLIENTE RECEBEU
- 5 Vídeo Aulas completas
- Acesso ao site gerador de planos personalizados
- Grupo de suporte
- Garantia de 30 dias (botão de reembolso no app)

## FLUXO CORRETO
1. Cliente baixa app PWA → Assiste aulas
2. Na Aula 2: Clica em "Gerar Seu Plano Personalizado"
3. No site: Preenche questionário → Recebe plano com doses exatas
4. Volta ao app: Continua aulas 3, 4, 5

## INGREDIENTES E DOSES BASE
Conforme peso:
- <70kg: Gelatina 5g, Cúrcuma 2g, Chá Verde 3g
- 70-90kg: Gelatina 6g, Cúrcuma 2.5g, Chá Verde 3.5g
- >90kg: Gelatina 7g, Cúrcuma 3g, Chá Verde 4g

## RESPOSTAS RÁPIDAS
**Quanto custa manter?** $25-35/mês em ingredientes (supermercados)
**Quanto tempo p/ resultados?** 14-21 dias mínimo para ver resultados
**Tem que fazer dieta?** NÃO. Apenas reduza açúcares/processados
**Onde comprar?** Supermercados, lojas naturais, Amazon (gelatina SEM SABOR)

## GESTÃO DE REEMBOLSO (CRÍTICO)
Se cliente mencionar reembolso:
1. Empatia: "Entendo sua frustração..."
2. Diagnóstico: Perguntar quantos dias, se toma todas doses, hidratação, se assistiu todas aulas
3. Solução: Identificar problema e oferecer ajuste específico
4. Motivação: "Você ainda tem X dias de garantia. Me dá 7 dias seguindo perfeitamente?"

Argumentos poderosos:
- Resultados levam 14-21 dias biologicamente
- Ainda tem tempo na garantia (30 dias)
- 80% que quiseram desistir na semana 2 e continuaram tiveram sucesso na semana 3
- Não perde nada em tentar mais uma semana

NUNCA: Ser agressivo, mentir, ou insistir se cliente decidiu firmemente.

## TOM
- Amigável e próximo (como amigo expert)
- Empático e motivador
- Técnico quando necessário mas SIMPLES
- Respostas como WhatsApp (direto, casual, emojis ok)`;

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: "user",
        content: message
      }
    ];

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API Error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await openaiResponse.json();
    const aiMessage = data.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";

    return new Response(
      JSON.stringify({ response: aiMessage }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});