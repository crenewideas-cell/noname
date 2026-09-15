import { net, type ProtocolRequest, type ProtocolResponse, type Session } from "electron";
import { onlineAssetResponse, onlineTextResponse } from "./online-assets";

type ReportError = (stage: string, error: unknown) => void;

async function proxyApi(session: Session, incoming: ProtocolRequest, reportError: ReportError): Promise<ProtocolResponse> {
  const headers = Object.fromEntries(Object.entries(incoming.headers)
    .filter(([name]) => !["host", "connection", "content-length", "transfer-encoding", "accept-encoding"].includes(name.toLowerCase())));
  headers["accept-encoding"] = "identity";
  const chunks: Buffer[] = [];
  // GET/HEAD navigation has no upload body. The online API uses JSON requests;
  // never interpret a renderer-supplied file path as a file to upload.
  if (!["GET", "HEAD"].includes(incoming.method)) {
    for (const part of incoming.uploadData || []) {
      if (part.bytes) chunks.push(Buffer.from(part.bytes));
      else if (part.blobUUID) chunks.push(await session.getBlobData(part.blobUUID));
      else throw new Error("联机 API 不支持此上传数据类型");
    }
  }
  return new Promise((resolve, reject) => {
    const request = net.request({
      url: incoming.url, method: incoming.method, session, headers,
      // Explicitly bypass our interception; otherwise the proxy calls itself.
      bypassCustomProtocolHandlers: true,
      credentials: Object.keys(headers).some(name => name.toLowerCase() === "authorization") ? "omit" : "include",
      origin: new URL(incoming.url).origin,
      redirect: "error",
    });
    const timer = setTimeout(() => {
      reject(new Error("联机服务器响应超时"));
      request.abort();
    }, 15000);
    request.once("error", error => {
      clearTimeout(timer); reject(error);
    });
    request.once("response", response => {
      // Chromium decodes the response stream; stale compression/length headers
      // must not make the renderer decode it again or wait for nonexistent bytes.
      const responseHeaders = Object.fromEntries(Object.entries(response.headers)
        .filter(([name]) => !["content-encoding", "content-length", "transfer-encoding", "connection"].includes(name.toLowerCase())));
      response.once("end", () => clearTimeout(timer));
      response.once("close", () => { clearTimeout(timer); request.abort(); });
      response.on("error", error => reportError("联机 API 响应流", error));
      resolve({ statusCode: response.statusCode, headers: responseHeaders, data: response });
    });
    for (const chunk of chunks) request.write(chunk);
    request.end();
  });
}

export function installOnlineProtocol(session: Session, root: string, origin: string, reportError: ReportError) {
  const installed: string[] = [];
  try {
    for (const scheme of ["http", "https"]) {
      const success = session.protocol.interceptStreamProtocol(scheme, (request, callback) => {
        const serve = async (): Promise<ProtocolResponse> => {
          const target = new URL(request.url);
          if (target.origin !== origin) return onlineTextResponse("Forbidden", 403);
          if (target.pathname.startsWith("/api/v1/")) return proxyApi(session, request, reportError);
          if (!["GET", "HEAD"].includes(request.method)) return onlineTextResponse("Method not allowed", 405);
          const response = await onlineAssetResponse(root, request);
          const stream = response.data as NodeJS.ReadableStream;
          stream.on("error", error => reportError(`联机资源流 ${target.pathname}`, error));
          return response;
        };
        void serve().then(callback, error => {
          const target = new URL(request.url);
          reportError(`联机请求 ${request.method} ${target.pathname}`, error);
          if (target.pathname === "/" || target.pathname === "/index.html") {
            // Fail navigation instead of resolving loadURL on a blank/error page.
            callback({ error: -2 });
          } else if (target.pathname.startsWith("/api/v1/")) {
            callback(onlineTextResponse("联机服务暂不可用", 502));
          } else {
            callback(onlineTextResponse("Local client asset missing", 404));
          }
        });
      });
      if (!success) throw new Error(`无法注册联机 ${scheme} 资源处理器`);
      installed.push(scheme);
    }
  } catch (error) {
    for (const scheme of installed) session.protocol.uninterceptProtocol(scheme);
    throw error;
  }
}
