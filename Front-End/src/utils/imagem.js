// Lê um arquivo de imagem, redimensiona (mantendo a proporção) para no
// máximo `tamanhoMax` px no maior lado e retorna um data URL comprimido
// em JPEG. Usado tanto pra foto de perfil quanto pra capa de livro, pra
// não mandar pro banco fotos de vários MB direto da câmera do celular.
export function redimensionarImagem(file, tamanhoMax = 512, qualidade = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const urlTemporaria = URL.createObjectURL(file);

    img.onload = () => {
      const escala = Math.min(1, tamanhoMax / Math.max(img.width, img.height));
      const largura = Math.round(img.width * escala);
      const altura = Math.round(img.height * escala);

      const canvas = document.createElement("canvas");
      canvas.width = largura;
      canvas.height = altura;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, largura, altura);

      const dataUrl = canvas.toDataURL("image/jpeg", qualidade);
      URL.revokeObjectURL(urlTemporaria);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(urlTemporaria);
      reject(new Error("Não foi possível carregar a imagem selecionada."));
    };

    img.src = urlTemporaria;
  });
}
