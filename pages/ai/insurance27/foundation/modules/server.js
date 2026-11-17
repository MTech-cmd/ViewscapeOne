import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
const server = http.createServer(async (req,res)=>{
  try {
    const urlPath = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target = path.resolve(root, '.' + (urlPath === '/' ? '/index.html' : urlPath));
    if (!target.startsWith(root + path.sep) && target !== path.join(root,'index.html')) throw new Error('Forbidden');
    const body = await fs.readFile(target); res.writeHead(200,{'Content-Type':types[path.extname(target)] ?? 'application/octet-stream','X-Content-Type-Options':'nosniff'}); res.end(body);
  } catch { res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found'); }
});
const port = Number(process.env.PORT || 8000); server.listen(port,()=>console.log(`Picker running at http://localhost:${port}`));
