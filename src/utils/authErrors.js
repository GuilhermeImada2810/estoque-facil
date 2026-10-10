export const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está sendo utilizado por outra conta.';
    case 'auth/invalid-email':
      return 'O formato de e-mail informado é inválido.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Utilize pelo menos 6 caracteres.';
    case 'auth/user-not-found':
      return 'Nenhum usuário encontrado com este e-mail.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Verifique os dados digitados.';
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/too-many-requests':
      return 'Acesso temporariamente bloqueado por muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique sua conexão com a internet.';
    case 'auth/popup-closed-by-user':
      return 'A autenticação foi cancelada antes de ser concluída.';
    default:
      return 'Ocorreu um erro durante a autenticação. Verifique os dados e tente novamente.';
  }
};
