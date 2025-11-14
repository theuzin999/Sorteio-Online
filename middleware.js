export default async function middleware(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Rotas que DEVEM ser protegidas por sessão/cookie.
  const protegidas = ["/index.html", "/planilha.html", "/bot2x.html"];

  // Bloqueio de robôs (HTTrack, wget, curl, etc.)
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  if (ua.includes("httrack") || ua.includes("wget") || ua.includes("curl")) {
    return new Response("Forbidden", { status: 403 });
  }

  // Se a página não estiver na lista de protegidas (incluindo o novo '/index.html'), libera o acesso.
  if (!protegidas.includes(path)) return fetch(req);

  // --- Lógica de Proteção para Rotas Antigas ---

  // Verifica sessão pela existência do cookie 'sessionId'
  const cookies = req.headers.get("cookie") || "";
  const match = cookies.match(/sessionId=([^;]+)/);
  const tokenExiste = !!match; // Verifica se o cookie foi encontrado

  if (tokenExiste) {
    // Se o cookie existir (indicando sessão), libera acesso.
    return fetch(req);
  } else {
    // Se o cookie não existir, redireciona para a raiz (onde o novo index.html está)
    return Response.redirect(new URL("/", req.url), 302);
  }
}