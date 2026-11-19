import { Message } from '../../domain/entities/Message';

export class GroqDataSource {
  private apiKey: string;
  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY!;
  }

  async generateResponse(
    userMessage: string,
    history: Message[]
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Falta configurar EXPO_PUBLIC_GROQ_API_KEY en el archivo .env');
    }

    // Convertir nuestras entidades al formato que entiende Groq (estándar OpenAI)
    const messages = [
      ...history.map(msg => ({
        role: msg.role, // 'user' o 'assistant' coinciden directamente
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error HTTP ${response.status} en Groq`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content ?? 'No se recibió respuesta.';
  }
}