// Avalia a força de uma senha com base em tamanho e variedade de caracteres.
// Usado tanto no formulário de registro quanto no de login (o login só
// exibe, o registro exige pelo menos "forte" pra deixar cadastrar).
export function avaliarForcaSenha(senha) {
  if (!senha) {
    return { nivel: "fraca", pontos: 0, criterios: criteriosVazios() };
  }

  const criterios = {
    tamanhoMinimo: senha.length >= 8,
    tamanhoBom: senha.length >= 12,
    minuscula: /[a-z]/.test(senha),
    maiuscula: /[A-Z]/.test(senha),
    numero: /[0-9]/.test(senha),
    especial: /[^a-zA-Z0-9]/.test(senha),
  };

  const pontos = Object.values(criterios).filter(Boolean).length;

  let nivel = "fraca";
  if (senha.length >= 8 && pontos >= 5) nivel = "forte";
  else if (senha.length >= 6 && pontos >= 3) nivel = "média";

  return { nivel, pontos, criterios };
}

function criteriosVazios() {
  return {
    tamanhoMinimo: false,
    tamanhoBom: false,
    minuscula: false,
    maiuscula: false,
    numero: false,
    especial: false,
  };
}
