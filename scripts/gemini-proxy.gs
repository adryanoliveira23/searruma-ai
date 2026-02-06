/**
 * API Gemini Alternativa (Versão Real 2026)
 * Gera imagens reais usando Gemini 2.0 Flash direto do Apps Script.
 *
 * INSTRUÇÕES:
 * 1. No Apps Script, vá em Configurações do Projeto (ícone de engrenagem).
 * 2. Em "Propriedades do script", adicione uma propriedade:
 *    Nome: API_KEY
 *    Valor: [Sua Chave do Gemini]
 * 3. IMPLANTE como "App da Web".
 * 4. Execute como: "Você".
 * 5. Quem tem acesso: "Qualquer pessoa".
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const prompt = data.prompt;
    const base64Image = data.image; // Dados da imagem em base64 (opcional)
    const imageUrl = data.imageUrl; // URL da imagem (opcional)

    const apiKey =
      PropertiesService.getScriptProperties().getProperty("API_KEY");
    if (!apiKey) {
      return responseJson({
        success: false,
        error: "API_KEY não configurada no Script Properties.",
      });
    }

    // Endpoint do Gemini 2.0 Flash
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

    // Preparar as partes da mensagem
    let parts = [{ text: prompt }];

    // Se houver imagem (por upload ou por URL)
    if (base64Image) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Image,
        },
      });
    } else if (imageUrl) {
      try {
        const imgBlob = UrlFetchApp.fetch(imageUrl).getBlob();
        parts.push({
          inline_data: {
            mime_type: imgBlob.getContentType(),
            data: Utilities.base64Encode(imgBlob.getBytes()),
          },
        });
      } catch (fError) {
        console.warn("Erro ao baixar imagem da URL:", fError);
      }
    }

    const payload = {
      contents: [{ parts: parts }],
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseText = response.getContentText();
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      return responseJson({
        success: false,
        error:
          "Erro do Google (" +
          responseCode +
          "): " +
          responseText.substring(0, 500),
      });
    }

    // Retorna o resultado JSON direto do Gemini (que contém os candidatos com a imagem gerada)
    return ContentService.createTextOutput(responseText).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return responseJson({ success: false, error: err.toString() });
  }
}

function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
