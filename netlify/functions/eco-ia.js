// Netlify Function - proxy seguro para el Eco-IA Asistente.
//
// La app es un HTML estatico sin backend propio, asi que no hay forma de
// llamar a la API de Google Gemini desde el navegador sin exponer la API
// key en el codigo fuente (GitHub bloquea ese tipo de push por seguridad,
// y con razon: cualquiera podria leer la key desde las devtools).
//
// Esta funcion corre en el servidor de Netlify (no en el navegador), lee
// la key desde una variable de entorno privada (GEMINI_API_KEY, configurada
// en Netlify -> Site settings -> Environment variables, nunca en el repo),
// y actua como intermediario entre el navegador del usuario y Gemini.
//
// El navegador llama a /.netlify/functions/eco-ia en vez de llamar
// directo a generativelanguage.googleapis.com.

const GEMINI_MODEL = 'gemini-flash-latest';

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'GEMINI_API_KEY no configurada en el servidor. Ve a Netlify > Site settings > Environment variables.' })
        };
    }

    let payload;
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'JSON invalido' }) };
    }

    const { contents, systemInstruction } = payload;
    if (!Array.isArray(contents) || contents.length === 0) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Falta el campo "contents"' }) };
    }

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
                    generationConfig: { temperature: 0.8, maxOutputTokens: 350 }
                })
            }
        );

        const data = await res.json();
        if (!res.ok) {
            return { statusCode: res.status, body: JSON.stringify({ error: data?.error?.message || 'Error de Gemini' }) };
        }

        const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('').trim();
        if (!text) {
            return { statusCode: 502, body: JSON.stringify({ error: 'Gemini devolvio una respuesta vacia' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        };
    } catch (e) {
        return { statusCode: 502, body: JSON.stringify({ error: 'No se pudo contactar a Gemini: ' + e.message }) };
    }
};
